import React from 'react';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className="">
        <span style={
          {
            fontFamily: 'Helvetica Neue LT Com, Helvetica, Arial, Sans Serif',
            color: 'white',
            backgroundColor: '#ef9a9a',
            borderRadius: 25,
            paddingLeft: 10,
            paddingRight: 10,
          }
        }
        >#Trend</span>
      </div>
    )
  }
}