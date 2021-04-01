import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image, Pressable, Modal, Alert, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';



import Screen from '../components/Screen.jsx';
import ListItem from '../components/ListItem.jsx'; 
import Separator from '../components/Separator.jsx';
import firebase from '../../database/firebase.js';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderBottomLeftRadius: 10,
    borderStartColor: 'grey',
    marginTop: -30,
  },
  createIconContainer:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: -20,
  },
  messageText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  hangoutLogo:{
    backgroundColor: 'transparent',
    width: '35%',
    height: '140%',
    alignSelf: 'center',
    marginTop: 15,
    marginRight: 25,
    marginLeft: -30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
});


export default function MessageOverviewScreen() {
  const [currentUid, setCurrentUid] = useState('');
  const [userName, setUserName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messages, setMessages] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientUid, setRecipientUid] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const sendMessageHandler = () => {
    // Storing the chatId
    const storeData = async (chatId) => {
      await AsyncStorage.setItem('chatId', chatId);
    };

    // MessageID Generator
    const messageId = JSON.stringify(currentUid) + Math.random().toString(36).substr(2, 9);
    // Check if the user Exists
    firebase.database().ref('users/').orderByChild('email').equalTo(recipientEmail.toLowerCase()).on('value', (snapshot) => {
      // if user exists
      if (snapshot.exists()) {
        // check if current chat already present
        const result = snapshotToArray(snapshot);
        setRecipientName(result[0].name);
        setRecipientUid(result[0].userid);
        const recipientUidFound = result[0].userid;
        // check if the users has sent any message before
        firebase.database().ref('rooms/').orderByChild('senderUid').equalTo(currentUid).once('value', (snapshot) => {
          console.log('running');
          // if the user has sent any message, check if the user has send any message to this particular recipient 
          if (snapshot.exists()) {
            // console.log(snapshotToArray(snapshot));
            const recipientResultArray = snapshotToArray(snapshot); 
            // using the list of recipient found, match it to the UID
            const recipientFound = recipientResultArray.filter((recipient) => {
              if(recipient.recipientUid === result[0].userid) {
                storeData(recipient.key);
              }
              return recipient.recipientUid === result[0].userid;
            } );
            // if the user has sent a message to the recipient, send the user to the message screen
            if (recipientFound != ''){
              navigation.navigate('MessageScreen');
              setNewMessage('');
              setRecipientEmail('');
            } 
            else{
              firebase.database().ref('rooms/').orderByChild('recipientUid').equalTo(currentUid).once('value', (snapshot) => {
                if(snapshot.exists()){
                  const senderResultArray = snapshotToArray(snapshot);
                  const senderFound = senderResultArray.filter((sender) => {
                    if (sender.senderUid === recipientUidFound){
                      storeData(sender.key);
                    }
                    return sender.senderUid === recipientUidFound;
                  });
                  // if the user has sent a message to the person before
                  if (senderFound != '') {
                    navigation.navigate('MessageScreen');
                    setNewMessage('');
                    setRecipientEmail('');
                  }
                }
                else{
                  console.log('does not exist');
                  const newChat = firebase.database().ref('rooms/').push();
                  newChat.set(
                    {
                      roomName: result[0].name,
                      dateCreated: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                      createdBy: currentUid,
                      recipientUid: result[0].userid,
                      senderUid: currentUid,
                      users: {
                        senderEmail: senderEmail,
                        senderName: userName,
                        recipientName: result[0].name,
                        recipient: recipientEmail.toLowerCase(),
                      },
                      messages: [{ message: newMessage, date: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), sentBy: currentUid, id: messageId,}]
                    },
                  );
                  storeData(newChat.key);
                  setNewMessage('');
                  setRecipientEmail('');
                  navigation.navigate('MessageScreen');
                }
              });
            }
          }
          // else we check if the user has received any messages before
          else {
            firebase.database().ref('rooms/').orderByChild('recipientUid').equalTo(currentUid).once('value', (snapshot) => {
              // if the user has received any messages before, check if it is from the person he is trying to send to
              if(snapshot.exists()){
                const senderResultArray = snapshotToArray(snapshot);
                const senderFound = senderResultArray.filter((sender) => {
                  return sender.senderUid === recipientUidFound;
                });
                // if the user has sent a message to the person before
                if (senderFound != '') {
                  navigation.navigate('MessageScreen');
                  setNewMessage('');
                  setRecipientEmail('');
                }
              }
              else{
                const newChat = firebase.database().ref('rooms/').push();
                newChat.set(
                  {
                    roomName: result[0].name,
                    dateCreated: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                    createdBy: currentUid,
                    recipientUid: result[0].userid,
                    senderUid: currentUid,
                    users: {
                      senderEmail: senderEmail,
                      senderName: userName,
                      recipientName: result[0].name,
                      recipient: recipientEmail.toLowerCase(),
                    },
                    messages: [{ message: newMessage, date: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), sentBy: currentUid, id: messageId,}]
                  },
                );
                setNewMessage('');
                setRecipientEmail('');
                navigation.navigate('MessageScreen');
              }
            });
          }
        });
        setModalVisible(!modalVisible);
      }
      // if user does not exist 
      else {
        console.log('user does not exist');
        setErrorMessage(true);
        setNewMessage('');
        setRecipientEmail('');
      }
    });
  };

  const viewMessageHandler = (item) => {
    const chatId = item.id;
    const storeData = async () => {
      await AsyncStorage.setItem('chatId', chatId);
    };
    storeData();
    navigation.navigate('MessageScreen');
  };

  useFocusEffect(
    React.useCallback(() => {
      const displayNameRequest = firebase.auth().currentUser.displayName;
      const uidRequest = firebase.auth().currentUser.uid;
      const emailRequest = firebase.auth().currentUser.email;
      setUserName(displayNameRequest);
      setCurrentUid(uidRequest);
      setSenderEmail(emailRequest);
      const displayMessageArray = [];
      // firebase query for messages received by user
      firebase.database().ref('rooms/').orderByChild('recipientUid').equalTo(uidRequest).once('value', (snapshot) => {
        if (snapshot.exists()) {
        // console.log(snapshotToArray(snapshot));
          const receivedMessagesArray = snapshotToArray(snapshot);
          receivedMessagesArray.forEach((message) => {
            displayMessageArray.push({ id: message.key, roomName: message.users.senderName, date: message.messages[0].date, senderName: message.users.senderName, receiverName: message.users.recipientName, message: message.messages[0].message, image: require('../assets/anon.png')});
          });
          // console.log(displayMessageArray, 'received');
          setMessages(displayMessageArray);
        
        // console.log(messages);
        }
        else {
          console.log('No messages Found');
        }
      });
      // firebase query for messages sent by user
      firebase.database().ref('rooms/').orderByChild('senderUid').equalTo(uidRequest).once('value', (snapshot) => {
        if (snapshot.exists()) {
        // console.log(snapshotToArray(snapshot));
          const sentMessagesArray = snapshotToArray(snapshot);
          sentMessagesArray.forEach((message) => {
            displayMessageArray.push({ id: message.key,roomName: message.users.recipientName, date: message.messages[0].date, senderName: message.users.senderName, receiverName: message.users.recipientName, message: message.messages[0].message, image: require('../assets/anon.png')});
          });
          // console.log(displayMessageArray, 'sent');
          setMessages(displayMessageArray);
        }
        else {
          console.log('No messages Found');
        }
        setIsLoading(false);
      });
    }, [])
  );


  if(isLoading){
    return(
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
    );
  } 
  
  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={require('../assets/hangout-logo-resized.png')}
          resizeMode='cover'
          style={styles.hangoutLogo} />
        <Text style={styles.messageText}> Messages</Text>
        <View style={styles.createIconContainer}>
          <TouchableOpacity onPress={() => {setModalVisible(true);}}>
            <Ionicons name="create-outline" size={25} >
            </Ionicons>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <FlatList
          data={messages}
          keyExtractor={(message) => message.id.toString()}
          renderItem={({item}) => (
            <ListItem
              title={item.roomName}
              subTitle={item.message}
              image={item.image}
              timeStamp={item.date}
              onPress={() => { viewMessageHandler(item);} }/>
          )}
          ItemSeparatorComponent={Separator}
        >
        </FlatList>
        <Separator></Separator>
      </View>
      {modalVisible && (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          > 
            <Screen>
              <View>
                <MaterialCommunityIcons name='close' size={30} onPress={() => setModalVisible(!modalVisible)}></MaterialCommunityIcons>
              </View>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {errorMessage && (
                    <View> 
                      <Text>User does not exist</Text>
                    </View>
                  )}
                  <TextInput
                    style={styles.modalText}
                    placeholder="Enter Email of the person you wish to send a message to"
                    value={recipientEmail}
                    onChangeText={setRecipientEmail}
                  > 
                  </TextInput>
                  <TextInput
                    style={styles.modalText}
                    placeholder="Enter Message"
                    value={newMessage}
                    onChangeText={setNewMessage}
                  > 
                  </TextInput>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={sendMessageHandler}
                  >
                    <Text style={styles.textStyle}>Send Message</Text>
                  </Pressable>
                </View>
              </View>
            </Screen>
          </Modal>
        </View>
      )}
    </Screen>
  );
}
