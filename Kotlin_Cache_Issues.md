```kotlin
import java.util.concurrent.ConcurrentHashMap

class SimpleCache<K, V> {
    private val cache = ConcurrentHashMap<K, CacheEntry<V>>()
    private val ttlMs = 60000 // 1 minute
    
    data class CacheEntry<V>(val value: V, val timestamp: Long)
    
    fun put(key: K, value: V) {
        cache[key] = CacheEntry(value, System.currentTimeMillis())
    }
    
    fun get(key: K): V? {
        val entry = cache[key]
        if (entry != null) {
            if (System.currentTimeMillis() - entry.timestamp < ttlMs) {
                return entry.value
            }
        }
        return null
    }
    
    fun size(): Int {
        return cache.size
    }
}
```

# Identified Issues

## Issue 1: Unbounded Memory Leak

The `get()` method checks TTL and silently returns `null` for expired entries — but **never removes them**.  
Additionally, `put()` performs no eviction, allowing expired entries to accumulate indefinitely within the `ConcurrentHashMap`.

With hundreds of writes per second and a 1-minute TTL, the map grows unbounded over time. This leads to heap exhaustion, `OutOfMemoryError`, or stop-the-world GC pauses.

Two fixes are required:

1. **Lazy cleanup in `get()`:**
   Remove expired entries atomically when detected.

   ```kotlin
   fun get(key: K): V? {
       val entry = cache[key] ?: return null
       if (System.currentTimeMillis() - entry.timestamp >= ttlMs) {
           cache.remove(key, entry) // atomic removal
           return null
       }
       return entry.value
   }
   ```

2. **Background eviction thread:**  
   Lazy cleanup alone isn't enough under heavy write loads where many keys are never re-accessed.  
   Implement a `ScheduledExecutorService` to periodically scan and evict expired entries in the background.

---

## Issue 2: Cache Stampede / Thundering Herd (Critical)

When a popular key expires or is missing, all concurrent threads calling `get()` receive `null` simultaneously. Each thread then independently calls the backing data source (DB/API), causing concurrent recomputation and surge load.

This creates massive spikes in DB traffic (often 20x+), leading to connection pool exhaustion or cascading service failures—especially if multiple high-traffic keys expire around the same time.

Use `ConcurrentHashMap.computeIfAbsent()` or a loading-cache pattern to ensure only one thread performs the workload while others block and reuse the same result.

```kotlin
fun getOrLoad(key: K, loader: () -> V): V {
    val existing = get(key)
    if (existing != null) return existing
    return cache.computeIfAbsent(key) {
        CacheEntry(loader(), System.currentTimeMillis())
    }.value
}
```

---

## Issue 3: Unreliable Clock for Elapsed Time (High)

`System.currentTimeMillis()` is wall-clock-based and subject to adjustments from NTP syncs, DST changes, or manual clock corrections. This can cause backward time jumps.

Entries may appear valid longer than their intended TTL following a rollback, leading to the serving of stale data or effectively infinite TTL extensions.

Use `System.nanoTime()` for elapsed duration. It's monotonic and immune to clock drift.

```kotlin
data class CacheEntry<V>(
    val value: V,
    val insertedAt: Long = System.nanoTime()
)

// In get():
if (System.nanoTime() - entry.insertedAt < ttlMs * 1_000_000L) {
    // entry still valid
}
```

---

## Issue 4: Misleading `size()` (Medium)

The `size()` method returns the raw `ConcurrentHashMap` count, which includes expired entries that haven't been evicted.

Monitoring tools or custom eviction strategies using this value may incorrectly estimate live entry counts, sometimes overreporting by 2–10x.

Either:
- Count only non-expired entries when returning `size()`, **or**
- Clearly document that it reports the total count including expired entries.

---

## Issue 7: Hardcoded, Non-Configurable TTL (Low)

`ttlMs` is currently hardcoded as a compile-time constant. This prevents reuse of the cache for varying TTL requirements (e.g., session data vs. product listings).

Lack of configurability reduces flexibility and code reuse across different caching contexts.

Make `ttlMs` configurable through the constructor, with optional per-entry TTL overrides.

```kotlin
class SimpleCache<K, V>(
    private val ttlMs: Long = 60_000
)
```

---
