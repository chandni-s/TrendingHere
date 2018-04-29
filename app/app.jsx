var React = require('react');
var ReactDOM = require('react-dom');
var Map = require('./components/Map');
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Layout from './components/Layout';

require('style!css!sass!./style/app.scss');

ReactDOM.render(<Layout/>,
  document.getElementById('app')
);
