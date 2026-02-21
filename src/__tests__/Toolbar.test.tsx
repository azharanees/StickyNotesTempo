import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from '../components/Toolbar';

describe('Toolbar', () => {
    const defaultProps = {
        selectedColor: 'yellow' as const,
        onColorChange: vi.fn(),
        onAddNote: vi.fn(),
    };

    it('renders the "Add Note" button', () => {
        render(<Toolbar {...defaultProps} />);
        expect(screen.getByText('Add Note')).toBeInTheDocument();
    });

    it('renders the app title', () => {
        render(<Toolbar {...defaultProps} />);
        expect(screen.getByText('Sticky Notes')).toBeInTheDocument();
    });

    it('calls onAddNote when Add Note button is clicked', async () => {
        const user = userEvent.setup();
        const onAddNote = vi.fn();
        render(<Toolbar {...defaultProps} onAddNote={onAddNote} />);

        await user.click(screen.getByText('Add Note'));
        expect(onAddNote).toHaveBeenCalledOnce();
    });

    it('toggles the color dropdown when color toggle is clicked', async () => {
        const user = userEvent.setup();
        render(<Toolbar {...defaultProps} />);

        // dropdown should not be visible initially
        expect(screen.queryByLabelText('Color: pink')).not.toBeInTheDocument();

        // click the color toggle
        await user.click(screen.getByLabelText('Choose note color'));

        // dropdown should now show color options
        expect(screen.getByLabelText('Color: pink')).toBeInTheDocument();
    });

    it('calls onColorChange and closes dropdown when a color is picked', async () => {
        const user = userEvent.setup();
        const onColorChange = vi.fn();
        render(<Toolbar {...defaultProps} onColorChange={onColorChange} />);

        // open dropdown
        await user.click(screen.getByLabelText('Choose note color'));

        // pick a color
        await user.click(screen.getByLabelText('Color: green'));
        expect(onColorChange).toHaveBeenCalledWith('green');

        // dropdown should close
        expect(screen.queryByLabelText('Color: green')).not.toBeInTheDocument();
    });
});
