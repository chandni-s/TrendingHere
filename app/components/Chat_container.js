import React from "react";
import axios from "axios";
import Trend_btn from "./Trends_container/Trend_btn";

export default class Chat_container extends React.Component {
    constructor() {
        super();
        this.state = {
            chats : [{ "topic" : "wassup", "chatId" : 1 }, { "topic" : "nothing", "chatId" : 2}, {"topic":"this", "chatId" : 3}],

        };
    }

    componentDidMount(){
        var that = this;
        var tagNAME = this.props.trendSelected;
        var chatNames =[];
        axios.get('/api/search/trend/'+tagNAME+'/', {})
            .then(function (res) {
                if (res.status === 200) {
                    // TODO: filter results by location
                    res.data.forEach((el)=>{
                        var obj ={
                            "topic" : el.chatname,
                            "chatId" : el.chatname
                        }
                        chatNames.push(obj)
                    });
                    that.setState({chats: chatNames});
                }
            })
            .catch(function (err) {
                console.log(err);
            });
        this.setState({chats:[{ "topic" : this.props.trendSelected, "chatId" : 1 }]});
    }

    chatClicked(e) {
        var topicClicked = e.target.innerHTML;
        this.props.chatClicked(topicClicked);
        Materialize.toast("User joined in", 3000, 'rounded');
    }

    chatListClosed(){
        Materialize.toast("User left", 3000, 'rounded');
        this.props.chatListClosed();
    }

    createChat(){
        this.props.createChat();
    }

    render() {
        var data = this.state.chats;
        {
            //below from http://stackoverflow.com/questions/34938026/react-onclick-inside-map-then-change-data-in-another-sibling-component
            //http://jsfiddle.net/69z2wepo/1844/
        } //comments
        return (
            <div>
                <p onClick={this.chatListClosed.bind(this)}>&larr;</p>
                {data.map((object, i) => {
                    return <div className="chatsList" key={i}>
                        {[
                            <span className="chat" key={i} name={object.chatId}
                                       onClick={this.chatClicked.bind(this)}
                                       >{object.topic}</span>
                        ]}
                    </div>;
                })}
                <span className="chat" name="Add new chat"
                      onClick={this.createChat.bind(this)}
                >Add new chat</span>
            </div>
            );
    }
}