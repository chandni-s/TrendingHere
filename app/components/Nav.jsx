import React from 'react';
import Signup from './user/Signup';

export default class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      signup: "Sign up",
      username: ""
    }
  }

  signedinUser(user) {
    this.setState({
      signup: "",
      username: user
    });
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
            <a href="#" className="brand-logo center">TRENDING<b>HERE</b></a>
            <ul className="right">
              <li><a data-activates="slide-out" id="side-nav-btn" href="#"><i className="material-icons">menu</i></a></li>
            </ul>
        </div>
      </nav>
    );
  }
}
