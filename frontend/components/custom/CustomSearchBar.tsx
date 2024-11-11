import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
     <Ionicons name="search-outline" size={20} color="grey" style={styles.iconStyle} />
      <TextInput
        placeholder="Search"
        style={styles.inputStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'grey',
    width: '90%',
    alignSelf: 'center',
    margin: 10, 
  },
  iconStyle: {
    marginRight: 10,
    marginLeft: 10,
  },
  inputStyle: {
    flex: 1, // Ensures the input takes up the remaining space
  },
});

export default SearchBar;