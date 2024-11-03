import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotesProvider, useNotes, Note } from '../MyNotes/NotesContext';
import { TouchableOpacity, View, Text } from 'react-native';

const TestComponent = () => {
  const { addNote, updateNote, notes } = useNotes();

  return (
    <View>
      <TouchableOpacity onPress={() => addNote({ id: '1', title: 'Test Note', date: '01/01/2022', text: 'This is a test' })}>
        <Text>Add Note</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateNote({ id: '1', title: 'Updated Note', date: '01/01/2022', text: 'This is an updated test' })}>
        <Text>Update Note</Text>
      </TouchableOpacity>
      {notes.map(note => (
        <View key={note.id}>
          <Text>{note.title}</Text>
          <Text>{note.text}</Text>
        </View>
      ))}
    </View>
  );
};


describe('Notes Context', () => {
  it('should add a note', () => {
    const { getByText } = render(
      <NotesProvider>
        <TestComponent />
      </NotesProvider>
    );

    fireEvent.press(getByText('Add Note')); // Testing add note

    expect(getByText('Test Note')).toBeTruthy();
  });

  it('should update an existing note', async () => {
    const { getByText, findByText } = render(
      <NotesProvider>
        <TestComponent />
      </NotesProvider>
    );

    // Add note
    fireEvent.press(getByText('Add Note'));

    // Verify note was added
    expect(await findByText('Test Note')).toBeTruthy();

    // Update note
    fireEvent.press(getByText('Update Note'));

    // Verify note was updated
    expect(await findByText('This is an updated test')).toBeTruthy(); // Check for updated note text
    expect(() => getByText('Test Note')).toThrow(); // Ensure the old note does not exist anymore
  });
});
