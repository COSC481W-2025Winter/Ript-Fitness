import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
     <Ionicons name="search-outline" size={20} color="#747474" style={styles.iconStyle} />
      <TextInput
        placeholder="Search"
        placeholderTextColor={'#747474'}
        style={styles.inputStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    // borderColor: 'grey',
    width: '90%',
    // height: '10%',
    backgroundColor: '#EDEDED',
  },
  iconStyle: {
    marginRight: 5,
    marginLeft: 10,
  },
  inputStyle: {
    flex: 1, // Ensures the input takes up the remaining space
    // color: '#747474',
  },
});

export default SearchBar;