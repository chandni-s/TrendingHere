import React from "react";
import axios from "axios";

import Trend_btn from "./Trends_container/Trend_btn";

var socket = require("../socket.js");

export default class Trend_container extends React.Component {

    constructor() {
        super();
        this.state = {
            trendsJson : [{ "trend" : "wassup" }, { "trend" : "nothing"}, {"trend":"this"}],
            trendsdb: [] //will be of format: [{tagname, date, username, long, lat}]
        };
    }
    //
    setTrends(){
        var that = this;

        axios.get('/api/tags/', {

        }).then(function (res) {
            if (res.status === 200) {
                //TODO: filter results by location
                var tagList = [];
                res.data.map((el) =>{
                    var obj = {
                        tagName: el.tagname
                    }
                    if(obj.tagName){
                        tagList.push(obj);
                    }
                    that.setState({trendsdb : tagList});
                });
            }
        }).catch(function (err) {
            Materialize.toast(err, 3000, 'rounded');
            console.log(err);
        });

    }

    componentDidMount(){
        this.setTrends();
    }


  trendClicked(trend) {
    this.props.trendClicked(trend);
  }


  addTrend(e) {
    e.preventDefault();
    const newTrend = document.getElementById("inputTrend").value;
    axios.post('/api/addtrend/', {
        name: newTrend,
        long: this.props.location.lng,
        lat: this.props.location.lat,

    }).then(function (res) {
        if (res.status === 200) {
            Materialize.toast("Adding the tag " + newTrend+". Please search again", 3000, 'rounded');

        }
    }).catch(function (err) {
        Materialize.toast(err, 3000, 'rounded');
        console.log(err);
    });
    document.getElementById("inputTrend").value =""; //clear form
//this.refreshTrends(newTrend);
  }

  searchTrend(e) {
    e.preventDefault();
    const tagName = document.getElementById("inputTrend").value;
    var that = this;
    axios.get('/api/trends/search/'+tagName+'/', {
        long: this.props.location.lng,
        lat: this.props.location.lat,
        radius: this.props.radius

      }).then(function (res) {
          if (res.status === 200) {
              //Materialize.toast("Adding the tag " + newTrend, 3000, 'rounded');
              //that.props.show("Map");

              if (res.data && res.data.length > 0){ //found a tag within radius
                   that.setState({trendsdb:[{tagName: tagName}]});
              }
          }
      }).catch(function (err) {
          Materialize.toast(err, 3000, 'rounded');
          console.log(err);
      });
    e.target.reset();
  }

  render() {
    var data = this.state.trendsJson;

    return (
      <div>
        <form onSubmit={this.searchTrend.bind(this)}>
          <input id="inputTrend" type="text" placeholder="Search Trend" />
        </form>
        {this.state.trendsdb.map((object, i) => {
          return <div className="trend" key={i}>
            {[
              <Trend_btn className="trends" key={i}
                trendClicked={this.trendClicked.bind(this)}
                trend={object.tagName} />
            ]}
          </div>;
        })}
        <div className="row buttons">
          <button className="col 10 waves-effect waves-light btn red lighten-2" onClick={this.addTrend.bind(this)}>add trend</button>
        </div>
      </div>
    );
  }
}