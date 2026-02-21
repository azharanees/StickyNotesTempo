let counter = 0;

// generate unique ID using timestamp + monotonic counter.
export function generateId(): string {
    return `${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
