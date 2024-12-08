import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from '@/context/GlobalContext';
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
  deleteNote: (noteId: string) => void;
  fetchNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(GlobalContext);
  const [notes, setNotes] = useState<Note[]>([]);

  // Fetch notes for use4r
  const fetchNotes = async () => {
    try {
      // console.log('Fetching notes...');
      const response = await fetch(`${httpRequests.getBaseURL()}/note/getAllNotesFromLoggedInUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context?.data.token}`,
        },
      });
      const data = await response.json();
      // console.log('Fetched notes:', data); 
      if (response.ok) {
        // Map the response 
        const mappedNotes = data.map((note: any) => {
          const createdDate = note.createdAt || note.date || new Date().toISOString();  
          // Format the date in 'month/day/year' format
          const formattedDate = new Date(createdDate).toLocaleDateString('en-US', {
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric'
          });
          return {
            id: note.noteId.toString(), 
            title: note.title,
            date: formattedDate, 
            text: note.description,
          };
        });
  
        setNotes(mappedNotes);
      } else {
        console.error('Failed to fetch notes:', data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Add a new note
  const addNote = async (note: Note) => {
    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/note/addNote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context?.data.token}`,
        },
        body: JSON.stringify({
          title: note.title,
          description: note.text,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(prevNotes => [note, ...prevNotes]);
      } else {
        console.error('Failed to add note:', data);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Edit an existing note
  const updateNote = async (updatedNote: Note) => {
    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/note/editNote/${updatedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context?.data.token}`,
        },
        body: JSON.stringify({
          title: updatedNote.title,
          description: updatedNote.text,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(prevNotes =>
          prevNotes.map(note => (note.id === updatedNote.id ? updatedNote : note))
        );
      } else {
        console.error('Failed to update note:', data);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Delete a note
  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/note/deleteNote/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context?.data.token}`,
        },
      });
      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, fetchNotes }}>
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