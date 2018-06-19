import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';

class Map extends Component {

    state = {
        viewport: {
            width: 1024,
            height: 800,
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 4
        }
    };

    render() {
        return (
            <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/light-v9"
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({ viewport })}
            />
        );
    }
}

export default Map;