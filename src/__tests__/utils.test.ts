import { describe, it, expect } from 'vitest';
import { generateId } from '../utils';

describe('generateId', () => {
    it('returns a non-empty string', () => {
        const id = generateId();
        expect(id).toBeTruthy();
        expect(typeof id).toBe('string');
    });

    it('returns unique IDs on successive calls', () => {
        const ids = new Set(Array.from({ length: 100 }, () => generateId()));
        expect(ids.size).toBe(100);
    });

    it('follows the timestamp-counter format', () => {
        const id = generateId();
        // format: base36timestamp-base36counter
        expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    });
});
