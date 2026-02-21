import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from '../components/ColorPicker';
import { NOTE_COLORS } from '../types';
import type { NoteColor } from '../types';

describe('ColorPicker', () => {
    it('renders a button for each color', () => {
        render(<ColorPicker selected="yellow" onChange={() => { }} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(NOTE_COLORS.length);
    });

    it('applies active class to the selected color', () => {
        render(<ColorPicker selected="pink" onChange={() => { }} />);
        const pinkBtn = screen.getByLabelText('Color: pink');
        expect(pinkBtn.className).toContain('color-dot--active');
    });

    it('does not apply active class to unselected colors', () => {
        render(<ColorPicker selected="pink" onChange={() => { }} />);
        const yellowBtn = screen.getByLabelText('Color: yellow');
        expect(yellowBtn.className).not.toContain('color-dot--active');
    });

    it('calls onChange with the clicked color', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ColorPicker selected="yellow" onChange={onChange} />);

        await user.click(screen.getByLabelText('Color: blue'));
        expect(onChange).toHaveBeenCalledWith('blue' as NoteColor);
    });

    it('supports md size variant', () => {
        const { container } = render(
            <ColorPicker selected="yellow" onChange={() => { }} size="md" />,
        );
        expect(container.querySelector('.color-picker--md')).toBeTruthy();
    });
});
