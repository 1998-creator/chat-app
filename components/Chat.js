import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

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
    };
    

  


  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name });
    let backgroundColor = this.props.route.params.backgroundColor;
   


    return (
      <View style={[styles.outerview, { backgroundColor: backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
    outerview: {
      flex: 1,
    },
})
