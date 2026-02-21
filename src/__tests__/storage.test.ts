import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadNotes, saveNotes } from '../services/storage';
import type { Note } from '../types';

function makeNote(overrides: Partial<Note> = {}): Note {
    return {
        id: 'note-1',
        x: 0,
        y: 0,
        width: 220,
        height: 180,
        text: 'Test',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
        updatedAt: 1000,
        ...overrides,
    };
}

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        get length() {
            return Object.keys(store).length;
        },
        key: vi.fn(() => null),
    };
})();

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('storage', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('loadNotes', () => {
        it('returns an empty array when storage is empty', () => {
            expect(loadNotes()).toEqual([]);
        });

        it('returns parsed notes from storage', () => {
            const notes = [makeNote({ id: 'a' }), makeNote({ id: 'b' })];
            localStorageMock.setItem('sticky-notes-data', JSON.stringify(notes));
            const result = loadNotes();
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('a');
        });

        it('returns an empty array for non-array JSON', () => {
            localStorageMock.setItem('sticky-notes-data', JSON.stringify({ bad: true }));
            expect(loadNotes()).toEqual([]);
        });

        it('returns an empty array on parse error', () => {
            localStorageMock.setItem('sticky-notes-data', '{{not valid json');
            expect(loadNotes()).toEqual([]);
        });
    });

    describe('saveNotes', () => {
        it('writes JSON to the correct key', () => {
            const notes = [makeNote()];
            saveNotes(notes);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'sticky-notes-data',
                JSON.stringify(notes),
            );
        });

        it('silently ignores storage errors', () => {
            localStorageMock.setItem.mockImplementationOnce(() => {
                throw new Error('QuotaExceeded');
            });
            // should not throw
            expect(() => saveNotes([makeNote()])).not.toThrow();
        });
    });
});
