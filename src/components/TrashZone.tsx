import type React from 'react';
import './TrashZone.css';

interface TrashZoneProps {
    innerRef: React.RefObject<HTMLDivElement | null>;
    isActive: boolean;
}

export function TrashZone({ innerRef, isActive }: TrashZoneProps) {
    return (
        <div
            ref={innerRef}
            className={`trash-zone${isActive ? ' trash-zone--active' : ''}`}
        >
            <svg
                className="trash-zone__icon"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1.5 14a2 2 0 0 1-2 1.75H8.5a2 2 0 0 1-2-1.75L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            <span className="trash-zone__label">Drop here to delete</span>
        </div>
    );
}
