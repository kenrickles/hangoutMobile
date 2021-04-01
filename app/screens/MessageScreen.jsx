import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {  MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen.jsx';
import firebase from '../../database/firebase.js';
import ListMessage from '../components/ListMessage.jsx';

const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor: 'rgba(243,243,243,1)'
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(243,243,243,1)',
    borderStyle: 'solid',
    borderBottomLeftRadius: 10,
    borderStartColor: '#F9F9F9',
  },
  messageContainer: {
    flex: 5,
    backgroundColor:'white',
    // backgroundColor:'black',
  },
  newMessageContainer:{
    // height: 300,
    // width: 300,
    marginLeft: 50,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234,236,239,1)',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,1)',
    width: 310,
    height: 36
  },
  messageInput: {
    // backgroundColor: 'white',
    alignSelf: 'center',
    width: 300,
    height: 35
  },
  bottomContainer: {
    flex: 0.5,
    flexDirection: 'row',
    backgroundColor: 'rgba(243,243,243,1)',
  },
  sendIconContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
  },
  backArrowContainer:{
    flexDirection: 'row',
    // backgroundColor: 'grey',
  },
  backArrow: {
    marginLeft: -170
  },
  ballon:{
    width: 'auto',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 7,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderWidth: 20,
    borderRadius: 20,
    backgroundColor: 'white'
  }
});

export default function MessageScreen() {
  const [newMessage, setNewMessage] = useState({
    id: 0, message: '', date: '', sentBy: '',
  });
  const [writtenMessage, setWrittenMessage] = useState('');
  const [messages, setMessages] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [currentUid, setcurrentUid] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatId, setChatId] = useState('');


  const navigation = useNavigation();

  // function that extracts Firebase response to Array of Objects
  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });
    return returnArr;
  };
  const getData = async () => {
    const displayNameRequest = firebase.auth().currentUser.displayName;
    const uidRequest = firebase.auth().currentUser.uid;
    setUserName(displayNameRequest);
    setcurrentUid(uidRequest);
    const chatIdRetrieval = await AsyncStorage.getItem('chatId');
    console.log(chatIdRetrieval);
    setChatId(chatIdRetrieval);
    firebase.database().ref('rooms/').orderByKey().equalTo(chatIdRetrieval).on('value', (snapshot) => {
      console.log(snapshot);
      const messagesArray = snapshotToArray(snapshot);
      if(messagesArray[0].createdBy === uidRequest){
        setRecipientName(messagesArray[0].users.recipientName);
      }
      else {
        setRecipientName(messagesArray[0].users.senderName);
      }
      setMessages(messagesArray[0].messages);
      setIsLoading(false); // This worked for me
      return () => {
      };
    });

  };
 
  useEffect(() => {
    getData();
  }, [chatId]);
  
  const submitMessage = () => { 
    const submittedMessageDetails = newMessage;
    submittedMessageDetails.id = JSON.stringify(currentUid) + Math.random().toString(36).substr(2, 9);
    submittedMessageDetails.date = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    submittedMessageDetails.message = writtenMessage;
    submittedMessageDetails.sentBy = currentUid;
    // console.log(submittedMessageDetails);
    const submittedMessage = firebase.database().ref('rooms/'+ chatId).child('messages');
    submittedMessage.once('value', (snapshot) => {
      if(snapshot.exists()){
        const previousMessages = snapshot.val();
        submittedMessage.set([...previousMessages, submittedMessageDetails]);
      }
    });

    setWrittenMessage('');
  };

  if(isLoading){
    return(
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
    );
  }  
  return (
    <Screen style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.backArrowContainer}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('MessageOverviewScreen');
            setIsLoading(true);
            setIsLoading(false);
          }}>
            <MaterialCommunityIcons name='arrow-left-bold' size={30} style={styles.backArrow}></MaterialCommunityIcons> 
          </TouchableOpacity>
        </View>
        <Text> {recipientName} </Text>
      </View>
      <View style={styles.messageContainer}>
        {/* <View style={styles.ballon}> */}
        <FlatList
          data={messages}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({item}) => { 
            return (
              <ListMessage
                title={item.message}
                timeStamp={item.date}
              ></ListMessage>
            );}}></FlatList>
        {/* </View> */}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.newMessageContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Write a new message..."
            value={writtenMessage}
            onChangeText={setWrittenMessage}
          >  
          </TextInput>
        </View>
        <View style={styles.sendIconContainer}>
          <TouchableOpacity onPress={() => submitMessage()}>
            <MaterialCommunityIcons name="send" color="#F96C87" size={30}></MaterialCommunityIcons>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
