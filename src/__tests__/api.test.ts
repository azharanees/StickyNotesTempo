import { describe, it, expect, beforeEach } from 'vitest';
import { createNote, fetchNotes, patchNote, deleteNote, resetStore } from '../services/api';
import type { Note } from '../types';

function makeNote(overrides: Partial<Note> = {}): Note {
    return {
        id: 'api-note-1',
        x: 0,
        y: 0,
        width: 220,
        height: 180,
        text: 'API test',
        color: 'blue',
        zIndex: 1,
        createdAt: 1000,
        updatedAt: 1000,
        ...overrides,
    };
}

describe('api service', () => {
    beforeEach(() => {
        resetStore([]);
    });

    it('createNote stores and returns the note', async () => {
        const note = makeNote();
        const result = await createNote(note);
        expect(result).toEqual(note);
        const all = await fetchNotes();
        expect(all).toHaveLength(1);
        expect(all[0].id).toBe('api-note-1');
    });

    it('fetchNotes returns all stored notes', async () => {
        await createNote(makeNote({ id: 'a' }));
        await createNote(makeNote({ id: 'b' }));
        const all = await fetchNotes();
        expect(all).toHaveLength(2);
    });

    it('patchNote merges changes and updates updatedAt', async () => {
        await createNote(makeNote({ id: 'patch-me', text: 'Original' }));
        const patched = await patchNote('patch-me', { text: 'Updated' });
        expect(patched).not.toBeNull();
        expect(patched!.text).toBe('Updated');
        expect(patched!.updatedAt).toBeGreaterThanOrEqual(1000);
    });

    it('patchNote returns null for an unknown ID', async () => {
        const result = await patchNote('nonexistent', { text: 'Oops' });
        expect(result).toBeNull();
    });

    it('deleteNote removes the note and returns true', async () => {
        await createNote(makeNote({ id: 'delete-me' }));
        const deleted = await deleteNote('delete-me');
        expect(deleted).toBe(true);
        const all = await fetchNotes();
        expect(all).toHaveLength(0);
    });

    it('deleteNote returns false for an unknown ID', async () => {
        const result = await deleteNote('nonexistent');
        expect(result).toBe(false);
    });

    it('resetStore replaces all data', async () => {
        await createNote(makeNote({ id: 'old' }));
        resetStore([makeNote({ id: 'new-1' }), makeNote({ id: 'new-2' })]);
        const all = await fetchNotes();
        expect(all).toHaveLength(2);
        expect(all.map((n) => n.id).sort()).toEqual(['new-1', 'new-2']);
    });
});
