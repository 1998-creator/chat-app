
import React, { Component } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

//import custom CustomActions
import CustomActions from "./CustomActions";
//import MapView
import MapView from "react-native-maps";



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
        apiKey: "AIzaSyC8t1Imk8PyaBcVo6dUPzKAzSftkJeKy4o",
        authDomain: "chat-app-july.firebaseapp.com",
        projectId: "chat-app-july",
        storageBucket: "chat-app-july.appspot.com",
        messagingSenderId: "806716994968",
        appId: "1:806716994968:web:0f7a9f8b6cc330fe21e7ed",
        measurementId: "G-B3ZDEHSMPX"
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


    /**
   * onCollectionUpdte takes snapshot on collection update
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {number} created.At
   * @param {object} user
   * @param {string} user._id
   * @param {string} image
   * @param {object} location
   * @param {number} location.longitude
   * @param {number} location.latitude
   */
     onCollectionUpdate = (querySnapshot) => {
      const messages = [];
      // go through each document
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        const data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text || "",
          createdAt: data.createdAt.toDate(),
          user: data.user,
          image: data.image || null,
          location: data.location || null,
        });
      });
  
      this.setState({
        messages,
      });
    };

  /**
   * adds the message object to firestore, fired by onSend function
   * @function addMessage
   * @param {string} _id
   * @param {string} text
   * @param {number} created.At
   * @param {object} user
   * @param {string} user._id
   * @param {string} image
   * @param {object} location
   * @param {number} location.longitude
   * @param {number} location.latitude
   */
   addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };


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

   /**
   * displays the communication features
   * @function renderCustomActions
   */
    renderCustomActions = (props) => <CustomActions {...props} />;

    //custom map view
    renderCustomView(props) {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
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
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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