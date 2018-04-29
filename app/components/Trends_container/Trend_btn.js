
import React from "react";


export default class Trend_btn extends React.Component {

  trendClicked(e) {
    const trend = e.target.innerHTML;
    this.props.trendClicked(trend);
  }

  render() {

    return (
      <div>
        <button type="button" onClick={this.trendClicked.bind(this)}>{this.props.trend}</button>
      </div>
    );
  }
}