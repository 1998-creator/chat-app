
import React, { Component } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";


const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
      uid: 0,
      isConnected: false,
    };


    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAXqcquerdAp1S08x0dWpGJ2KdiPU7jDiQ",
        authDomain: "chat-app-28f0e.firebaseapp.com",
        projectId: "chat-app-28f0e",
        storageBucket: "chat-app-28f0e.appspot.com",
        messagingSenderId: "488613227744",
        appId: "1:488613227744:web:226c1fd7729d87d6983485",
        measurementId: "G-NRMWD45QMX"
      });
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");

  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // componentDidMount() {
  //   NetInfo.fetch().then((connection) => {
  //     if (connection.isConnected) {
  //       console.log("online");
  //     } else {
  //       console.log("offline");
  //     }
  //   });

  //   this.referenceChatMessages = firebase
  //         .firestore()
  //         .collection('messages');

  //   this.getMessages();

  //   this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
  //     if (!user) {
  //       firebase.auth().signInAnonymously();
  //     }

  //     this.setState({
  //       _id: user.uid,
  //       messages: [],
  //     });

  //     this.unsubscribe = this.referenceChatMessages
  //       .orderBy("createdAt", "desc")
  //       .onSnapshot(this.onCollectionUpdate);
  //   });
  // }

  componentDidMount() {
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            isConnected: true,
            user: {
              _id: user.uid,
              name: this.props.route.params.name,
              avatar: 'https://placeimg.com/140/140/any'
            },
            messages: [],
          });
          this.referenceChatMessages = firebase.firestore().collection('messages');
          this.unsubscribeChatUser = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();

    this.authUnsubscribe();
  }


  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data

      let data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });

    this.setState({
      messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }


  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();

        this.saveMessages();
      }
    );
  }


  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {

            backgroundColor: "#576775",

          },
        }}
      />
    );
  }


  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}

        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }

}

