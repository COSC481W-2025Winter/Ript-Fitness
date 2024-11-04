import React, { createContext, useContext, useState } from 'react';

//Defines Note object
export interface Note {
  id: string;
  title: string;
  date: string;
  text: string;
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (updatedNote: Note) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Note) => {
    // setNotes((prevNotes) => [...prevNotes, { ...note, id: Date.now().toString() }]);
    // console.log("Updated notes:", updateNote);
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes, note];
      console.log("Notes after adding:", updatedNotes);
      return updatedNotes;
    });
    console.log("Added note:", note);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))
    );
  }

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};