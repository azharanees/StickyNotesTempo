import { useRef, useCallback, useState, useEffect } from 'react';
import type React from 'react';
import type { Note, NoteColor } from '../types';
import { StickyNote } from './StickyNote';
import { TrashZone } from './TrashZone';
import { Toolbar } from './Toolbar';
import './Board.css';

interface BoardProps {
    notes: Note[];
    onAdd: (x: number, y: number, color: NoteColor) => void;
    onUpdate: (id: string, changes: Partial<Note>) => void;
    onRemove: (id: string) => void;
    onBringToFront: (id: string) => void;
}

export function Board({
    notes,
    onAdd,
    onUpdate,
    onRemove,
    onBringToFront,
}: BoardProps) {
    const trashRef = useRef<HTMLDivElement>(null);
    const [selectedColor, setSelectedColor] = useState<NoteColor>('yellow');
    const [dragging, setDragging] = useState(false);

    const handleDoubleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget) return;
            onAdd(e.clientX - 110, e.clientY - 90, selectedColor);
        },
        [onAdd, selectedColor],
    );

    const handleAddFromToolbar = useCallback(() => {
        // placing the note near the centre of the viewport with a small random offset
        const x = window.innerWidth / 2 - 110 + (Math.random() - 0.5) * 60;
        const y = window.innerHeight / 2 - 90 + (Math.random() - 0.5) * 60;
        onAdd(x, y, selectedColor);
    }, [onAdd, selectedColor]);

    const handleDragStateChange = useCallback((isDragging: boolean) => {
        setDragging(isDragging);
    }, []);

    useEffect(() => {
        if (dragging) {
            document.body.classList.add('dragging');
        } else {
            document.body.classList.remove('dragging');
        }
    }, [dragging]);

    return (
        <>
            <Toolbar
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                onAddNote={handleAddFromToolbar}
            />

            <div
                className="board"
                onDoubleClick={handleDoubleClick}
            >
                <div className="board__hint" style={{ display: notes.length === 0 ? undefined : 'none' }}>
                    <p className="board__hint-title">No notes yet</p>
                    <p className="board__hint-sub">
                        Double-click anywhere or press <strong>Add Note</strong> to get started
                    </p>
                </div>

                {notes.map((note) => (
                    <StickyNote
                        key={note.id}
                        note={note}
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                        onBringToFront={onBringToFront}
                        onDragStateChange={handleDragStateChange}
                        trashRef={trashRef}
                    />
                ))}
            </div>

            <TrashZone innerRef={trashRef} isActive={dragging} />
        </>
    );
}
