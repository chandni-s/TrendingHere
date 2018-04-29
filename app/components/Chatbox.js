//example from https://github.com/kentandlime/react-instant-chat/blob/master/src/components/ChatApp.js
import React from 'react';
import ChatInput from './ChatInput'
import Messages from './Messages'
var socket = require("../socket.js");

console.log(socket);

export default class Chatbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            typing : '',
            room: "default"
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        socket.on('receive-message', message => {
            this.addMessage(message);
        });
    }

    handleSubmit(message) {
        const messageObject = {
            chatId: "chatId",
            username: this.props.userName,
            //username: "usernameHere",
            msg: message,
            room: this.state.room
        };

        socket.emit('send-message', messageObject);

        messageObject.fromMe = true;
        this.addMessage(messageObject);
    }

    addMessage(message){
        const messages = this.state.messages;
        messages.push(message);
        this.setState({ messages: messages });
    }

    onTextChange(){

    }
    componentDidMount(){
        this.setState({room:this.props.chatId})
    }
    render () {
        return (
            <div id="ChatBoxWindow">
                <div className="container message-box">
                    <div className="card message-list">
                        <div id="cardimg" className="card-image">
                            <span>{this.state.room}</span>
                        </div>
                        <div className="scrollable side-pads top-pad">
                            <Messages messages={this.state.messages} />
                        </div>
                    </div>
                    <ChatInput onSend={this.handleSubmit.bind(this)} onTextChange={this.onTextChange.bind(this)}/>
                    <p>{this.state.typing}</p>
                </div>
            </div>

        )
    }
}