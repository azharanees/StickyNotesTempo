export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: NoteColor;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export type NoteColor =
  | 'yellow'
  | 'pink'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange';

export const NOTE_COLORS: readonly NoteColor[] = [
  'yellow',
  'pink',
  'blue',
  'green',
  'purple',
  'orange',
] as const;

export const COLOR_MAP: Record<NoteColor, { bg: string; header: string }> = {
  yellow: { bg: '#fff9c4', header: '#fff176' },
  pink: { bg: '#f8bbd0', header: '#f48fb1' },
  blue: { bg: '#bbdefb', header: '#90caf9' },
  green: { bg: '#c8e6c9', header: '#a5d6a7' },
  purple: { bg: '#e1bee7', header: '#ce93d8' },
  orange: { bg: '#ffe0b2', header: '#ffcc80' },
};

