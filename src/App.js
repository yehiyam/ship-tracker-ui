import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from './map'
import trips from './trips';
import { Menu } from '@material-ui/core';
// import Switch from './switch'
// Be sure to include styles at some point, probably during your bootstrapping
require('dotenv').config()

class App extends Component {

  state = {
    selectedTrip: 0
  }
  handleChange = (event) => {
    this.setState({ selectedTrip: event.target.value });
  };
  render() {
    console.log(trips)
    return (
      <div className="App">
        <Map selectedTrip={this.state.selectedTrip}/>
        <div className="dropdown-container">
          <form>
            <FormControl>
              <InputLabel htmlFor="trip">Trip</InputLabel>
              <Select
                value={this.state.selectedTrip}
                onChange={this.handleChange}
                inputProps={{
                  name: 'trip',
                  id: 'trip',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {trips.map(t => (<MenuItem key={t.value} value={t.value}>{t.title}</MenuItem>))}
              </Select>
            </FormControl>
          </form>
        </div>
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