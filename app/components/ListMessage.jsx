import React from 'react';
import { View, StyleSheet, Text } from 'react-native';


const styles = StyleSheet.create({
  detailsContainer: {
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
  },
  timeStampContainer:{
    alignSelf: 'flex-start',
    marginLeft: 10,
    
  },
  timeStamp:{
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  subTitle: {
    color: 'grey',
  },
  title: {
    fontWeight: '300',
    padding: 10,
    margin: 10,
    fontSize: 14,
    alignSelf:'center',
    color: 'white',
  },
  ballon: {
    // borderTopStartRadius: 20,
    // borderTopEndRadius: 20,
    // borderWidth: 3,
    // borderRadius: 20,
    // backgroundColor: 'white',
    // border
    // maxHeight: 40,
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start'
    // flex: 1,
    width: 'auto',
    height: 'auto',
    maxHeight: 500,
    borderRadius: 20,
    backgroundColor: '#000000'
  }
});

export default function ListMessage( {title, timeStamp,}) {
  return (
    <>
      <View style={styles.detailsContainer}>
        <View style={styles.ballon}> 
          <Text style={styles.title} numberOfLines={200}>
            {title}
          </Text>
        </View>
      </View>
      <View style={styles.timeStampContainer}>
        <Text style={styles.timeStamp}>{timeStamp}</Text>
      </View>
    </>
  
  );
}
