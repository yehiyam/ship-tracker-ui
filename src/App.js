import React, { Component } from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from './map'
import trips from './trips';
// import Switch from './switch'
// Be sure to include styles at some point, probably during your bootstrapping
require('dotenv').config()

class App extends Component {

  state = {
    selectedTrip:0
  }
  handleChange = (value) => {
    this.setState({selectedTrip: value});
  };
  render() {
    return (
      <div className="App">
        <Map />
        {/* <Switch isChecked={ true } label="xxx" /> */}
        <Dropdown
        auto
        onChange={this.handleChange}
        source={trips}
        value={this.state.value}
      />
      </div>
    );
  }
}

export default App;


// import React, { Component } from 'react';
// import MapGL from 'react-map-gl';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <MapGL
//           width={1024}
//           height={768}
//           latitude={37.768}
//           longitude={-122.331}
//           zoom={9.017}
//           mapStyle="mapbox://styles/mapbox/light-v9"
//           mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
//         />
//       </div>
//     );
//   }
// }

// export default App;