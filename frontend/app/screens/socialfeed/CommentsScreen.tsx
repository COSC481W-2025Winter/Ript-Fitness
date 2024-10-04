import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CommentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.postContent}>Placeholder text</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  postContent: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CommentsScreen