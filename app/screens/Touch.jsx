const sendMessageHandler = () => {
// MessageID Generator
const messageId = JSON.stringify(currentUid) + Math.random().toString(36).substr(2, 9);
// Check if the user Exists
firebase.database().ref('users/').orderByChild('email').equalTo(recipientEmail.toLowerCase()).on('value', (snapshot) => {
  if (snapshot.exists()) {
    // check if current chat already present
        const result = snapshotToArray(snapshot);
        setRecipientName(result[0].name);
        setRecipientUid(result[0].userid);
        firebase.database().ref('rooms/').orderByChild('senderUid').equalTo(currentUid).once('value', (snapshot) => {
          console.log('running');
          if (snapshot.exists()) {
            const recipientFound = recipientResultArray.filter((recipient) => {
              return recipient.recipientUid === result[0].userid;
            })
            if (recipientFound != ''){
              navigation.navigate('MessageScreen');
              setNewMessage('');
              setRecipientEmail('');
            }
            else{
              console.log('moving on')
            }
          }
          else {
            firebase.database().ref('rooms/').orderByChild('recipientUid').equalTo(currentUid).once('value', (snapshot) => {
              if (snapshot.exists()) {
                navigation.navigate('MessageScreen');
                setNewMessage('');
                setRecipientEmail('');
              }
              else {
                firebase.database().ref('rooms/').orderByChild('senderUid').equalTo(currentUid).once('value', (snapshot) => {
                  if (snapshot.exists()) {
                    navigation.navigate('MessageScreen');
                    setNewMessage('');
                    setRecipientEmail('');
                    }
                  else {
                    const newChat = firebase.database().ref('rooms/').push();
                    newChat.set( {
                      oomName: result[0].name,
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
                        });
                        setNewMessage('');
                        setRecipientEmail('');
                        navigation.navigate('MessageScreen');
                    }
                  }
                  }
                }
              }
            }
          }
  else {
    console.log('user does not exist');
        setErrorMessage(true);
        setNewMessage('');
        setRecipientEmail('');
  }
        }
  }
}
}