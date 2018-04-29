import React from "react";
import axios from "axios";
var socket = require("../../socket.js");

export default class Signup extends React.Component {

  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    }
  }

  signupClicked(e) {
    e.preventDefault();
    const username = document.getElementById("inputusername").value;
    const pass = document.getElementById("inputpassword").value;
    var that = this;

    axios.put('/api/signup', {
        username: username,
        pass: pass
      })
      .then(function (res) {
        if (res.status === 200) {
          Materialize.toast("Sign up successful", 3000, 'rounded');
          that.props.show("Signin");
        }
      })
  }

  showSignIn() {
    socket.on('user-signedup', function (msg) {
        Materialize.toast(msg, 3000, 'rounded');
    });
    this.props.show("Signin");
  }

  render() {
    return (
      <div className="container">
        <div className="card sign-form">
          <div id="cardimg" className="card-image">
            <span>Sign Up</span>
          </div>
          <div className="container sign-inputs">
            <form onSubmit={this.signupClicked.bind(this)}>
              <div className="input-field">
                <input id="inputusername" type="text"/>
                <label htmlFor="inputusername">Username or Email</label>
              </div>
              <div className="input-field">
                <input id="inputpassword" type="password"/>
                <label htmlFor="inputpassword">Password</label>
              </div>
            </form>
            <br/>
            <div className="row">
              <button className="col s12 waves-effect waves-light btn red lighten-2" onClick={this.signupClicked.bind(this)}>Sign Up</button>
            </div>
            <div className="row">
              <button className="col s12 waves-effect waves-light btn red lighten-2" onClick={this.showSignIn.bind(this)}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}