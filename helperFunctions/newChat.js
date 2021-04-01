const newChat = firebase.database().ref('rooms/').push();
newChat.set(
  {
    roomName: result[0].name,
    sentBy: currentUid,
    dateCreated: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    recipientUid: result[0].userid,
    senderUid: currentUid,
    users: {
      senderEmail: senderEmail,
      senderName: userName,
      recipientName: result[0].name,
      recipient: recipientEmail.toLowerCase(),
    },
    messages: [{ message: newMessage, date: moment(new Date()).format('DD/MM/YYYY HH:mm:ss')}]
  },
);