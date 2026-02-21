import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Board } from '../components/Board';
import type { Note, NoteColor } from '../types';

function makeNote(overrides: Partial<Note> = {}): Note {
    return {
        id: 'board-note-1',
        x: 100,
        y: 200,
        width: 220,
        height: 180,
        text: 'Board Note',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
        updatedAt: 1000,
        ...overrides,
    };
}

const defaultProps = () => ({
    onAdd: vi.fn(),
    onUpdate: vi.fn(),
    onRemove: vi.fn(),
    onBringToFront: vi.fn(),
});

describe('Board', () => {
    it('shows empty-state hint when there are no notes', () => {
        render(<Board notes={[]} {...defaultProps()} />);
        expect(screen.getByText('No notes yet')).toBeInTheDocument();
        expect(
            screen.getByText(/Double-click anywhere or press/),
        ).toBeInTheDocument();
    });

    it('hides empty-state hint when there are notes', () => {
        render(<Board notes={[makeNote()]} {...defaultProps()} />);
        const hint = screen.getByText('No notes yet');
        // The hint element should have display: none
        expect(hint.closest('.board__hint')).toHaveStyle({ display: 'none' });
    });

    it('renders note text when notes are provided', () => {
        render(<Board notes={[makeNote({ text: 'My Note' })]} {...defaultProps()} />);
        expect(screen.getByText('My Note')).toBeInTheDocument();
    });

    it('renders multiple notes', () => {
        const notes = [
            makeNote({ id: 'a', text: 'Note A' }),
            makeNote({ id: 'b', text: 'Note B' }),
        ];
        render(<Board notes={notes} {...defaultProps()} />);
        expect(screen.getByText('Note A')).toBeInTheDocument();
        expect(screen.getByText('Note B')).toBeInTheDocument();
    });

    it('calls onAdd when "Add Note" toolbar button is clicked', async () => {
        const user = userEvent.setup();
        const props = defaultProps();
        render(<Board notes={[]} {...props} />);

        await user.click(screen.getByRole('button', { name: /add note/i }));
        expect(props.onAdd).toHaveBeenCalledOnce();
        // onAdd is called with (x, y, color)
        const [x, y, color] = props.onAdd.mock.calls[0];
        expect(typeof x).toBe('number');
        expect(typeof y).toBe('number');
        expect(color).toBe('yellow' as NoteColor);
    });

    it('renders the Toolbar', () => {
        render(<Board notes={[]} {...defaultProps()} />);
        expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
    });
});
