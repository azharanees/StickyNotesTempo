import { useNotes } from './hooks/useNotes';
import { Board } from './components/Board';

export default function App() {
  const { notes, addNote, updateNote, removeNote, bringToFront } = useNotes();

  return (
    <Board
      notes={notes}
      onAdd={addNote}
      onUpdate={updateNote}
      onRemove={removeNote}
      onBringToFront={bringToFront}
    />
  );
}
