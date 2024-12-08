import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => {

    // // Initial data
    // const data = [
    //   { id: '1', name: 'Apple' },
    //   { id: '2', name: 'Banana' },
    //   { id: '3', name: 'Orange' },
    //   { id: '4', name: 'Grapes' },
    //   { id: '5', name: 'Strawberry' },
    // ];
  
    // // State for the search query
    // const [searchQuery, setSearchQuery] = useState('');
  
    // // Filter the data based on the search query
    // const filteredData = data.filter((item) =>
    //   item.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

  return (
    <View style={styles.searchContainer}>
     <Ionicons name="search-outline" size={20} color="#747474" style={styles.iconStyle} />
      <TextInput
        placeholder="Search"
        placeholderTextColor={'#747474'}
        style={styles.inputStyle}
        // value={searchQuery}
        // onChangeText={setSearchQuery} // Update the query as user types
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