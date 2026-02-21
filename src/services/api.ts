import type { Note } from '../types';
import { loadNotes, saveNotes } from './storage';

function simulateLatency(): Promise<void> {
    const ms = 50 + Math.random() * 150;
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let store: Map<string, Note> = new Map(
    loadNotes().map((n) => [n.id, n]),
);

function persist(): void {
    saveNotes([...store.values()]);
}

export async function fetchNotes(): Promise<Note[]> {
    await simulateLatency();
    return [...store.values()];
}

export async function createNote(note: Note): Promise<Note> {
    await simulateLatency();
    store.set(note.id, note);
    persist();
    return note;
}

export async function patchNote(
    id: string,
    changes: Partial<Note>,
): Promise<Note | null> {
    await simulateLatency();
    const existing = store.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...changes, updatedAt: Date.now() };
    store.set(id, updated);
    persist();
    return updated;
}

export async function deleteNote(id: string): Promise<boolean> {
    await simulateLatency();
    const deleted = store.delete(id);
    if (deleted) persist();
    return deleted;
}

export function resetStore(notes: Note[]): void {
    store = new Map(notes.map((n) => [n.id, n]));
}
