import { useState, useRef, useEffect } from 'react';
import type { NoteColor } from '../types';
import { ColorPicker } from './ColorPicker';
import './Toolbar.css';

interface ToolbarProps {
    selectedColor: NoteColor;
    onColorChange: (color: NoteColor) => void;
    onAddNote: () => void;
}

export function Toolbar({ selectedColor, onColorChange, onAddNote }: ToolbarProps) {
    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!expanded) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [expanded]);

    return (
        <header className="toolbar">
            <div className="toolbar__brand">
                <svg className="toolbar__logo" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                </svg>
                <span className="toolbar__title">Sticky Notes</span>
            </div>

            <div className="toolbar__actions">
                <div className="toolbar__color-section" ref={containerRef}>
                    <button
                        className="toolbar__color-toggle"
                        onClick={() => setExpanded((v) => !v)}
                        title="Choose color"
                        aria-label="Choose note color"
                        type="button"
                    >
                        <span
                            className="toolbar__color-preview"
                            style={{
                                backgroundColor:
                                    selectedColor === 'yellow' ? '#fff176'
                                        : selectedColor === 'pink' ? '#f48fb1'
                                            : selectedColor === 'blue' ? '#90caf9'
                                                : selectedColor === 'green' ? '#a5d6a7'
                                                    : selectedColor === 'purple' ? '#ce93d8'
                                                        : '#ffcc80',
                            }}
                        />
                    </button>
                    {expanded && (
                        <div className="toolbar__color-dropdown">
                            <ColorPicker
                                selected={selectedColor}
                                onChange={(c) => {
                                    onColorChange(c);
                                    setExpanded(false);
                                }}
                                size="md"
                            />
                        </div>
                    )}
                </div>

                <button className="toolbar__add-btn" onClick={onAddNote} type="button">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Note
                </button>
            </div>
        </header>
    );
}
