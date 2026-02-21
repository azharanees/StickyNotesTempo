import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { Note, NoteAction, NoteColor } from '../types';
import { DEFAULT_NOTE_WIDTH, DEFAULT_NOTE_HEIGHT } from '../types';
import { generateId } from '../utils';
import { loadNotes, saveNotes } from '../services/storage'
import * as api from '../services/api';

function notesReducer(state: Note[], action: NoteAction): Note[] {
    switch (action.type) {
        case 'ADD':
            return [...state, action.payload];

        case 'UPDATE':
            return state.map((n) =>
                n.id === action.payload.id
                    ? { ...n, ...action.payload.changes, updatedAt: Date.now() }
                    : n,
            );

        case 'REMOVE':
            return state.filter((n) => n.id !== action.payload);

        case 'BRING_TO_FRONT': {
            const maxZ = Math.max(0, ...state.map((n) => n.zIndex));
            return state.map((n) =>
                n.id === action.payload ? { ...n, zIndex: maxZ + 1 } : n,
            );
        }

        case 'LOAD':
            return action.payload;
    }
}

export function useNotes() {
    const [notes, dispatch] = useReducer(notesReducer, []);
    const initialised = useRef(false);

    useEffect(() => {
        const persisted = loadNotes();
        if (persisted.length > 0) {
            api.resetStore(persisted);
            dispatch({ type: 'LOAD', payload: persisted });
        }
        initialised.current = true;
    }, []);

    useEffect(() => {
        if (initialised.current) {
            saveNotes(notes);
        }
    }, [notes]);

    const addNote = useCallback(
        (x: number, y: number, color: NoteColor = 'yellow') => {
            const maxZ = Math.max(0, ...notes.map((n) => n.zIndex));
            const note: Note = {
                id: generateId(),
                x,
                y,
                width: DEFAULT_NOTE_WIDTH,
                height: DEFAULT_NOTE_HEIGHT,
                text: '',
                color,
                zIndex: maxZ + 1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            dispatch({ type: 'ADD', payload: note });
            api.createNote(note);
        },
        [notes],
    );

    const updateNote = useCallback(
        (id: string, changes: Partial<Note>) => {
            dispatch({ type: 'UPDATE', payload: { id, changes } });
            api.patchNote(id, changes);
        },
        [],
    );

    const removeNote = useCallback((id: string) => {
        dispatch({ type: 'REMOVE', payload: id });
        api.deleteNote(id);
    }, []);

    const bringToFront = useCallback((id: string) => {
        dispatch({ type: 'BRING_TO_FRONT', payload: id });
    }, []);

    return { notes, addNote, updateNote, removeNote, bringToFront } as const;
}
