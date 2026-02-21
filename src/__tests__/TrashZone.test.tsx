import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { TrashZone } from '../components/TrashZone';

describe('TrashZone', () => {
    it('renders the "Drop here to delete" label', () => {
        const ref = createRef<HTMLDivElement>();
        render(<TrashZone innerRef={ref} isActive={false} />);
        expect(screen.getByText('Drop here to delete')).toBeInTheDocument();
    });

    it('has the active class when isActive is true', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(<TrashZone innerRef={ref} isActive={true} />);
        expect(container.querySelector('.trash-zone--active')).toBeTruthy();
    });

    it('does not have the active class when isActive is false', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(<TrashZone innerRef={ref} isActive={false} />);
        expect(container.querySelector('.trash-zone--active')).toBeNull();
    });

    it('renders the trash icon SVG', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(<TrashZone innerRef={ref} isActive={false} />);
        expect(container.querySelector('svg')).toBeTruthy();
    });
});
