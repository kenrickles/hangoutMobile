import React from 'react';
import { View, StyleSheet, Image, TouchableHighlight, Text } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  timeStampContainer:{
    alignSelf: 'flex-start',
    
  },
  timeStamp:{
    fontSize: 12,
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
    fontWeight: '500',
  },
});

export default function ListItem( {title, subTitle, image, IconComponent, onPress, timeStamp, renderRightActions,}) {
  return (
    <>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight underlayColor="grey" onPress={onPress}>
          <View style={styles.container}>
            {IconComponent}
            {image && <Image style={styles.image} source={image} />}
            <View style={styles.detailsContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {subTitle && (
                <Text style={styles.subTitle} numberOfLines={2}>
                  {subTitle}
                </Text>
              )}
            </View>
            <View style={styles.timeStampContainer}>
              <Text style={styles.timeStamp}>{timeStamp}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeable>
    </>
  
  );
}
