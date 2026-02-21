import { useState, useRef, useCallback, useEffect } from 'react';
import type React from 'react';
import type { Note, NoteColor } from '../types';
import { COLOR_MAP, MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT } from '../types';
import { ColorPicker } from './ColorPicker';
import './StickyNote.css';

interface StickyNoteProps {
    note: Note;
    onUpdate: (id: string, changes: Partial<Note>) => void;
    onRemove: (id: string) => void;
    onBringToFront: (id: string) => void;
    onDragStateChange: (isDragging: boolean) => void;
    trashRef: React.RefObject<HTMLDivElement | null>;
}

export function StickyNote({
    note,
    onUpdate,
    onRemove,
    onBringToFront,
    onDragStateChange,
    trashRef,
}: StickyNoteProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [overTrash, setOverTrash] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const noteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.selectionStart = textAreaRef.current.value.length;
        }
    }, [isEditing]);

    const isOverTrash = useCallback(
        (clientX: number, clientY: number): boolean => {
            if (!trashRef.current) return false;
            const rect = trashRef.current.getBoundingClientRect();
            return (
                clientX >= rect.left &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom
            );
        },
        [trashRef],
    );

    const handleMoveStart = useCallback(
        (e: React.PointerEvent) => {
            if (isEditing) return;
            // not to start drag when clicking interactive elements like dots or delete button
            const target = e.target as HTMLElement;
            if (target.closest('button')) return;
            e.preventDefault();
            e.stopPropagation();
            onBringToFront(note.id);
            onDragStateChange(true);

            const el = noteRef.current;
            if (!el) return;
            el.setPointerCapture(e.pointerId);

            const startX = e.clientX;
            const startY = e.clientY;
            const origX = note.x;
            const origY = note.y;

            const onMove = (ev: PointerEvent) => {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                onUpdate(note.id, { x: origX + dx, y: origY + dy });
                setOverTrash(isOverTrash(ev.clientX, ev.clientY));
            };

            const onUp = (ev: PointerEvent) => {
                el.removeEventListener('pointermove', onMove);
                el.removeEventListener('pointerup', onUp);
                el.releasePointerCapture(ev.pointerId);
                onDragStateChange(false);

                if (isOverTrash(ev.clientX, ev.clientY)) {
                    onRemove(note.id);
                }
                setOverTrash(false);
            };

            el.addEventListener('pointermove', onMove);
            el.addEventListener('pointerup', onUp);
        },
        [note.id, note.x, note.y, isEditing, onUpdate, onRemove, onBringToFront, onDragStateChange, isOverTrash],
    );

    const handleResizeStart = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onBringToFront(note.id);
            onDragStateChange(true);

            const target = e.currentTarget as HTMLElement;
            target.setPointerCapture(e.pointerId);

            const startX = e.clientX;
            const startY = e.clientY;
            const origW = note.width;
            const origH = note.height;

            const onMove = (ev: PointerEvent) => {
                const newW = Math.max(MIN_NOTE_WIDTH, origW + (ev.clientX - startX));
                const newH = Math.max(MIN_NOTE_HEIGHT, origH + (ev.clientY - startY));
                onUpdate(note.id, { width: newW, height: newH });
            };

            const onUp = (ev: PointerEvent) => {
                target.removeEventListener('pointermove', onMove);
                target.removeEventListener('pointerup', onUp);
                target.releasePointerCapture(ev.pointerId);
                onDragStateChange(false);
            };

            target.addEventListener('pointermove', onMove);
            target.addEventListener('pointerup', onUp);
        },
        [note.id, note.width, note.height, onUpdate, onBringToFront, onDragStateChange],
    );

    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onUpdate(note.id, { text: e.target.value });
        },
        [note.id, onUpdate],
    );

    const handleBodyDoubleClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
    }, []);

    const handleColorChange = useCallback(
        (color: NoteColor) => {
            onUpdate(note.id, { color });
        },
        [note.id, onUpdate],
    );

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        onBringToFront(note.id);
    }, [note.id, onBringToFront]);

    const colors = COLOR_MAP[note.color];

    return (
        <div
            ref={noteRef}
            className={`sticky-note${overTrash ? ' sticky-note--over-trash' : ''}`}
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.height,
                zIndex: note.zIndex,
                backgroundColor: colors.bg,
            }}
            onMouseDown={handleMouseDown}
        >
            <div
                className="sticky-note__header"
                style={{ backgroundColor: colors.header }}
                onPointerDown={handleMoveStart}
            >
                <ColorPicker selected={note.color} onChange={handleColorChange} />
                <button
                    className="sticky-note__delete"
                    onClick={() => onRemove(note.id)}
                    title="Delete note"
                    aria-label="Delete note"
                    type="button"
                >
                    ×
                </button>
            </div>

            <div className="sticky-note__body" onDoubleClick={handleBodyDoubleClick}>
                {isEditing ? (
                    <textarea
                        ref={textAreaRef}
                        className="sticky-note__textarea"
                        value={note.text}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        placeholder="Type your note…"
                    />
                ) : (
                    <div className="sticky-note__text">
                        {note.text || (
                            <span className="sticky-note__placeholder">
                                Double-click to edit…
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div
                className="sticky-note__resize"
                onPointerDown={handleResizeStart}
            />
        </div>
    );
}
