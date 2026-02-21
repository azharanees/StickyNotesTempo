import { describe, it, expect } from 'vitest';
import { notesReducer } from '../hooks/useNotes';
import type { Note, NoteAction } from '../types';

function makeNote(overrides: Partial<Note> = {}): Note {
    return {
        id: 'note-1',
        x: 100,
        y: 200,
        width: 220,
        height: 180,
        text: 'Hello',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
        updatedAt: 1000,
        ...overrides,
    };
}

describe('notesReducer', () => {
    describe('ADD', () => {
        it('appends a new note to the state', () => {
            const note = makeNote();
            const action: NoteAction = { type: 'ADD', payload: note };
            const result = notesReducer([], action);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(note);
        });

        it('preserves existing notes when adding', () => {
            const existing = makeNote({ id: 'existing' });
            const newNote = makeNote({ id: 'new-note' });
            const result = notesReducer([existing], { type: 'ADD', payload: newNote });
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('existing');
            expect(result[1].id).toBe('new-note');
        });
    });

    describe('UPDATE', () => {
        it('merges changes into the matching note and updates updatedAt', () => {
            const note = makeNote({ updatedAt: 1000 });
            const action: NoteAction = {
                type: 'UPDATE',
                payload: { id: 'note-1', changes: { text: 'Updated' } },
            };
            const result = notesReducer([note], action);
            expect(result[0].text).toBe('Updated');
            expect(result[0].updatedAt).toBeGreaterThan(1000);
        });

        it('leaves state unchanged for a non-existent ID', () => {
            const note = makeNote();
            const action: NoteAction = {
                type: 'UPDATE',
                payload: { id: 'non-existent', changes: { text: 'Nope' } },
            };
            const result = notesReducer([note], action);
            expect(result[0].text).toBe('Hello');
        });

        it('can update position', () => {
            const note = makeNote();
            const result = notesReducer([note], {
                type: 'UPDATE',
                payload: { id: 'note-1', changes: { x: 300, y: 400 } },
            });
            expect(result[0].x).toBe(300);
            expect(result[0].y).toBe(400);
        });
    });

    describe('REMOVE', () => {
        it('filters out the matching note', () => {
            const notes = [makeNote({ id: 'a' }), makeNote({ id: 'b' })];
            const result = notesReducer(notes, { type: 'REMOVE', payload: 'a' });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('b');
        });

        it('leaves state unchanged for a non-existent ID', () => {
            const notes = [makeNote({ id: 'a' })];
            const result = notesReducer(notes, { type: 'REMOVE', payload: 'zzz' });
            expect(result).toHaveLength(1);
        });
    });

    describe('BRING_TO_FRONT', () => {
        it('sets zIndex to max + 1', () => {
            const notes = [
                makeNote({ id: 'a', zIndex: 1 }),
                makeNote({ id: 'b', zIndex: 5 }),
            ];
            const result = notesReducer(notes, { type: 'BRING_TO_FRONT', payload: 'a' });
            expect(result.find((n) => n.id === 'a')!.zIndex).toBe(6);
        });

        it('sets zIndex to 1 when state is empty except for target', () => {
            const notes = [makeNote({ id: 'a', zIndex: 0 })];
            const result = notesReducer(notes, { type: 'BRING_TO_FRONT', payload: 'a' });
            expect(result[0].zIndex).toBe(1);
        });
    });

    describe('LOAD', () => {
        it('replaces state entirely', () => {
            const existing = [makeNote({ id: 'old' })];
            const loaded = [makeNote({ id: 'new-1' }), makeNote({ id: 'new-2' })];
            const result = notesReducer(existing, { type: 'LOAD', payload: loaded });
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('new-1');
            expect(result[1].id).toBe('new-2');
        });
    });
});
