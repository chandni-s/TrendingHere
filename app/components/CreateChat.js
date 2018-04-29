//example from https://github.com/kentandlime/react-instant-chat/blob/master/src/components/ChatApp.js
import React from 'react';
import axios from "axios";
import ChatInput from './ChatInput'
import Messages from './Messages'
var socket = require("../socket.js");

export default class CreateChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMsg: [],
            typing : ''
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
            msg: message
        };
        socket.emit('send-message', messageObject);

        messageObject.fromMe = true;
        this.addMessage(messageObject);
    }

    addMessage(message){
        const messages = this.state.chatMsg;
        messages.push(message);
        this.setState({ messages });
    }

    addChatBox(e) {
        e.preventDefault();
        var chatName = document.getElementById("inputChatName").value;
        var trends = document.getElementById("inputChatTrends").value;
        var chatDesc = document.getElementById("inputChatDescription").value;

        axios.post('/api/chat/', {
            chatname: chatName,
            description: chatDesc,
            tags: trends,
            long: this.props.currentLocation.lng,
            lat: this.props.currentLocation.lat,

        }).then(function (res) {
            if (res.status === 200) {
                Materialize.toast("Creating the chat " + res.chatname, 3000, 'rounded');

            }
        }).catch(function (err) {
            Materialize.toast(err, 3000, 'rounded');
            console.log(err);
        });

        e.target.reset();
        this.props.setChatId("Chat", "ChatId");
    }
    render () {
        return (
            <div id="CreateChatBoxWindow">
                <div className="container">
                    <div className="card-panel input-field">
                        <form id="chatForm" onSubmit={this.addChatBox.bind(this)}>
                            Name: <input id="inputChatName" type="text" placeholder="Enter a name for the chat"/>
                            Trends: <input id="inputChatTrends" type="text" value={this.props.trendSelected}/>
                            Description <input id="inputChatDescription" type="text" placeholder="Enter a description for the chat"/>
                        </form>
                        <button type="submit" form="chatForm" >Submit</button>
                    </div>
                </div>
            </div>

        )
    }
}