import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { StickyNote } from '../components/StickyNote';
import { COLOR_MAP } from '../types';
import type { Note } from '../types';

function makeNote(overrides: Partial<Note> = {}): Note {
    return {
        id: 'test-note',
        x: 100,
        y: 200,
        width: 220,
        height: 180,
        text: 'Hello World',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
        updatedAt: 1000,
        ...overrides,
    };
}

const defaultProps = () => ({
    onUpdate: vi.fn(),
    onRemove: vi.fn(),
    onBringToFront: vi.fn(),
    onDragStateChange: vi.fn(),
    trashRef: createRef<HTMLDivElement>(),
});

describe('StickyNote', () => {
    it('renders note text content', () => {
        render(<StickyNote note={makeNote()} {...defaultProps()} />);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('shows placeholder when text is empty', () => {
        render(<StickyNote note={makeNote({ text: '' })} {...defaultProps()} />);
        expect(screen.getByText('Double-click to edit…')).toBeInTheDocument();
    });

    it('applies correct background color from COLOR_MAP', () => {
        const note = makeNote({ color: 'pink' });
        const { container } = render(<StickyNote note={note} {...defaultProps()} />);
        const noteEl = container.querySelector('.sticky-note') as HTMLElement;
        expect(noteEl).toHaveStyle({ backgroundColor: COLOR_MAP.pink.bg });
    });

    it('applies correct header color from COLOR_MAP', () => {
        const note = makeNote({ color: 'blue' });
        const { container } = render(<StickyNote note={note} {...defaultProps()} />);
        const header = container.querySelector('.sticky-note__header') as HTMLElement;
        expect(header).toHaveStyle({ backgroundColor: COLOR_MAP.blue.header });
    });

    it('calls onRemove when delete button is clicked', async () => {
        const user = userEvent.setup();
        const props = defaultProps();
        render(<StickyNote note={makeNote()} {...props} />);

        await user.click(screen.getByLabelText('Delete note'));
        expect(props.onRemove).toHaveBeenCalledWith('test-note');
    });

    it('enters edit mode on double-click and shows textarea', async () => {
        const user = userEvent.setup();
        render(<StickyNote note={makeNote()} {...defaultProps()} />);

        // double-click the body to enter edit mode
        const body = screen.getByText('Hello World');
        await user.dblClick(body);

        expect(screen.getByPlaceholderText('Type your note…')).toBeInTheDocument();
    });

    it('positions the note at the correct x,y coordinates', () => {
        const note = makeNote({ x: 50, y: 75 });
        const { container } = render(<StickyNote note={note} {...defaultProps()} />);
        const noteEl = container.querySelector('.sticky-note') as HTMLElement;
        expect(noteEl).toHaveStyle({
            left: '50px',
            top: '75px',
        });
    });

    it('renders the resize handle', () => {
        const { container } = render(<StickyNote note={makeNote()} {...defaultProps()} />);
        expect(container.querySelector('.sticky-note__resize')).toBeTruthy();
    });

    it('renders the ColorPicker in the header', () => {
        render(<StickyNote note={makeNote()} {...defaultProps()} />);
        // ColorPicker renders buttons with aria-label "Color: <name>"
        expect(screen.getByLabelText('Color: yellow')).toBeInTheDocument();
    });
});
