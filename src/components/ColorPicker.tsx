import type React from 'react';
import { NOTE_COLORS, COLOR_MAP } from '../types';
import type { NoteColor } from '../types';
import './ColorPicker.css';

interface ColorPickerProps {
    selected: NoteColor;
    onChange: (color: NoteColor) => void;
    size?: 'sm' | 'md';
}

export function ColorPicker({ selected, onChange, size = 'sm' }: ColorPickerProps) {
    const handleClick = (color: NoteColor) => (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(color);
    };

    return (
        <div className={`color-picker color-picker--${size}`}>
            {NOTE_COLORS.map((color) => (
                <button
                    key={color}
                    className={`color-dot${color === selected ? ' color-dot--active' : ''}`}
                    style={{ backgroundColor: COLOR_MAP[color].header }}
                    onClick={handleClick(color)}
                    title={color}
                    aria-label={`Color: ${color}`}
                    type="button"
                />
            ))}
        </div>
    );
}
