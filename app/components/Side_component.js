import React from "react";
import axios from "axios";

import Trend_container from "./Trend_container";
import Chat_container from "./Chat_container";

export default class Side_component extends React.Component {
  constructor() {
    super();
    this.state = {
      show: "Search",
      trendSelected: ""
    }
  }

  trendClicked(trend) {
    this.props.onTrendClick(trend);
    this.setState({trendSelected : trend});
    this.setState({ show: "ChatsList" });
  }

  chatClicked(topic) {
    this.props.show("Chat", topic);

  }

  chatListClosed() {
    this.setState({ show: "Search" });
    this.props.show("Map", "");
  }

  createChat(){
    this.props.show("CreateChat","");
  }
  render() {
    return (
      <div className="Side_component">
          {this.state.show == "Search" && (
              <div>
                <Trend_container trendClicked = {this.trendClicked.bind(this)} location = {this.props.location}
                                radius = {this.props.radius} />

              </div>)
          }
          {this.state.show == "ChatsList" && <Chat_container chatClicked = {this.chatClicked.bind(this)}
                                                             chatListClosed = {this.chatListClosed.bind(this)}
                                                             createChat = {this.createChat.bind(this)}
                                                             trendSelected = {this.state.trendSelected}
                                                             location = {this.props.location}
          />}

      </div>
    );
  }
}