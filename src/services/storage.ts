import type { Note } from 'e:/Projects/tempo/src/types';

const STORAGE_KEY = 'sticky-notes-data';

export function loadNotes(): Note[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed as Note[];
    } catch {
        return [];
    }
}

export function saveNotes(notes: Note[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
        // Storage full or unavailable
    }
}
