import React from "react";
import axios from "axios";
var socket = require("../../socket.js");

export default class Signin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      signInFailed: false
    }
  }

  setUsername() {
      //TODO
    // socket.on('user-signedin', (user) => {
    //     if (user === true) {
    //         this.setState({
    //             isAuthorized: true
    //         });
    //         Materialize.toast("Sign-in Successful", 3000, 'rounded');
    //     }
    //
    //     if (this.state.isAuthorized) {
    //         this.props.show("Map");
    //     }
    //
    //     else {
    //         Materialize.toast(user, 3000, 'rounded');
    //     }
    // });
  }


  signinClicked(e) {
    e.preventDefault();
    const username = document.getElementById("inputusername").value;
    const pass = document.getElementById("inputpassword").value;
    var that = this;

    axios.post('/api/signin/', {
        username: username,
        pass: pass
      })
      .then(function (res) {
        if (res.status === 200) {
            console.log(res);
          that.props.show("Map");
        }

      })
      .catch(function (err) {
          if (err.response && err.response.status === 401){
              that.setState({signInFailed:true});
          }
        console.log(err);
      })
  }

  signupClicked() {
    this.props.show("Signup");
  }

  render() {
    return (
      <div className="container">
        <div className="card sign-form">
          <div id="cardimg" className="card-image">
            <span>Sign In</span>
          </div>
          <div className="container sign-inputs">
            <form onSubmit={this.signinClicked.bind(this)}>
              <div className="input-field">
                <input id="inputusername" type="text"/>
                <label htmlFor="inputusername">Username or Email</label>
              </div>
              <div className="input-field">
                <input id="inputpassword" type="password"/>
                <label htmlFor="inputpassword">Password</label>
              </div>
                {(this.state.signInFailed) && <p>Invalid username and password. Please try again</p>}
            </form>
            <br/>
            <div className="row">
              <button className="col s12 btn red lighten-2" onClick={this.signupClicked.bind(this)}>Sign up</button>
            </div>
            <div className="row">
              <button className="col s12 btn red lighten-2" onClick={this.signinClicked.bind(this)}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}