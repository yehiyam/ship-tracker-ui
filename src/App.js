import React, { Component } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from './map'
require('dotenv').config()

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map />
      </div>
    );
  }
}

export default App;
