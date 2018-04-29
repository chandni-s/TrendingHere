import React, { PropTypes } from 'react';
import axios from 'axios';
import Map from './Map';
import Side_component from './Side_component';
import Chat_container from './Chat_container';
import Trend_container from './Trend_container';
import Nav from './Nav';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';
import Signup from './user/Signup';
import Signin from './user/Signin';
import CreateChat from './CreateChat';

var socket = require("../socket.js");

const propTypes = {
  center: PropTypes.object.isRequired
}

const defaultProps = {
  center: {
    lat: 79.3832,
    lng: 43.6532
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: "Signin",
      chatId: "",
      username: "usernameHere",
      radius: 50,
      center: this.props.center,
      markers: []
    }
  }

  getNearbyMarkers() {
    var that = this;
    axios.get('/api/chats/search/nearby/' + that.state.trend)
      .then(function (res) {
        that.setState({
          markers: []
        })
        res.data.forEach((chat) => {
          if ((google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(that.state.currentLocation.lat, that.state.currentLocation.lng),
            new google.maps.LatLng(parseFloat(chat.lat), parseFloat(chat.long))
          ) / 1000) <= that.state.radius) {
            that.setState({
              markers: [
                ...that.state.markers,
                {
                  title: chat.chatname,
                  username: chat.username,
                  position: {
                    lng: parseFloat(chat.long),
                    lat: parseFloat(chat.lat)
                  },
                  showInfo: false,
                  description: chat.description,
                  infoContent: (
                    <div>
                      <div className="row center-text">
                        <h5>{chat.chatname}</h5>
                      </div>
                      <h6>Created by: {chat.username}</h6>
                      <p>{chat.description}</p>
                      <button className="waves-effect waves-light btn red lighten-2">Join Chat</button>
                    </div>
                  )
                }
              ]
            })
          }
        })
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  updateLocation(location) {
    this.setState({
      currentLocation: location
    })
  }

  updateTrend(trend) {
    this.setState({
      trend: trend
    }, () => {
      this.getNearbyMarkers()
    })
  }

  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            position: marker.position,
            infoContent: marker.infoContent,
            showInfo: true
          };
        }
        return marker;
      }),
    });

  }

  setChatBoxID(chatIdClicked) {
    this.setState({chatId : chatIdClicked});
  }

  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            position: marker.position,
            infoContent: marker.infoContent,
            showInfo: true
          };
        }
        return marker;
      }),
    });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            position: marker.position,
            infoContent: marker.infoContent,
            showInfo: false
          };
        }
        return marker;
      })
    })
  }

  handleOpenChat(show, chatId) {
    this.handleChangeShow(show);
    this.setState({chatId : chatId});
  }

  handleChangeShow(show) {
    this.setState({ show });
  }

  componentDidMount(){

  }

  changeRadius(e){
    e.preventDefault()
    var rad = document.getElementById("inputTextRadius").value;
    if (isNaN(rad)){
      Materialize.toast("Sorry, that is not a number. Please try again", 3000, 'rounded');
    }
    else{
      this.setState({radius:rad});
      document.getElementById("inputTextRadius").value = "";
    }

  }

  clearCookies(){
      document.cookie.split(";").forEach(function(c)
      { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  }

  signOut(){
    this.clearCookies();
    console.log("signing out...");
    axios.get('/api/signout/', {
      }).then(function (res) {
          if (res.status === 200) {
            }
      })
        .catch(function (err) {
            console.log(err);
    })
    this.setState({show:"Signin"});
  }

  render() {
      //socket.emit('location-id', this.state.center);
      var that = this;
      if (this.state.show === "Signin") {

        axios.get('/', {})
            .then(function (res) {
                console.log("res", res.status);
                if (res.status === 200) {
                    that.setState({show: "Map"})
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    return (
      <div>
        <Nav />
          {(this.state.show == "Signup" || this.state.show == "Signin" ||
          this.state.show == "Chat" || this.state.show == "CreateChat") &&
          <div className="background-image"></div>}
        <div className="row">
          <div className="col s12 m2 side-bar">
              {this.state.show !== "Signup" && this.state.show !== "Signin"
              && <Side_component show={this.handleOpenChat.bind(this)} center={this.state.center}
              location={this.props.center} radius={this.state.radius} onTrendClick={this.updateTrend.bind(this)}/>}
          </div>
          <div id="content" className="col s12 m10">
            {this.state.show == "Signup" && <Signup show={this.handleChangeShow.bind(this)} />}
            {this.state.show == "Signin" && <Signin show={this.handleChangeShow.bind(this)} />}
            {this.state.show == "Map" && <Map loadMarkers={this.getNearbyMarkers.bind(this)} updateLocation={this.updateLocation.bind(this)} markers={this.state.markers} onMarkerClick={this.handleMarkerClick.bind(this)} onMarkerClose={this.handleMarkerClose.bind(this)} />}
            {this.state.show == "Chat" && <Chatbox chatId={this.state.chatId} />}

            {this.state.show == "CreateChat" && <CreateChat currentLocation={this.state.currentLocation} setChatId={this.handleOpenChat.bind(this)} />}

          </div>
        </div>
          <ul id="slide-out" className="side-nav">
            <li>
              <div className="userView">
                <div className="background">
                  <img src="http://i.imgur.com/tpLPnfX.jpg"/>
                </div>
                <span className="white-text name">Hello,</span>
                <span className="white-text email">{this.state.username}</span>
              </div>
            </li>
            <li>
              <span className="subheader">Radius: {this.state.radius} km</span>
            </li>
            <li><form onSubmit={this.changeRadius.bind(this)}>
                  Set Radius: <input id = "inputTextRadius" type="text" placeholder="Enter search radius (in km)"/>
                </form>
            </li>
            <li><a href="#!">Second Link</a></li>
            <li><div className="divider"></div></li>
            <li><a className="subheader">Settings</a></li>
            <li><a className="waves-effect" onClick={this.signOut.bind(this)}>Sign Out</a></li>
          </ul>
          <a href="#" data-activates="slide-out" className="button-collapse show-on-large"><i className="material-icons">menu</i></a>
      </div>
    )
  }
}

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;