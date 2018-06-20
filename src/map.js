import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { fromJS } from 'immutable';
import { db } from './firestore'
import { defaultMapStyle, dataLayer } from './mapState.js';
const GeoJSON = require('geojson');
class Map extends Component {


    state = {
        mapStyle: defaultMapStyle,
        data: null,
        viewport: {
            width: 1024,
            height: 800,
            latitude: 0,
            longitude: 0,
            zoom: 1
        }
    };

    // _loadData = data => {
    //     const mapStyle = defaultMapStyle
    //         // Add geojson source to map
    //         .setIn(['sources', 'track'], fromJS({ type: 'geojson', data }))
    //         // Add point layer to map
    //         .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    //     this.setState({ data, mapStyle });
    // };

    componentDidMount() {
        db
            .collection('ship-location')
            .orderBy('timestamp')
            .get()
            .then(collection => {
                const data = collection.docs.map(d => d.data())
                this.setState({ data });
                // const geoJsonData = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
                // this._loadData(geoJsonData)
            })
    }

    _renderMarker(location, i) {
        const { timestamp, lat, lng } = location;
        return (
            <Marker key={i} longitude={lng} latitude={lat} >
                <div className="station"><span>{timestamp}</span></div>
            </Marker>
        );
    }

    render() {
        const { viewport, mapStyle, data } = this.state;
        return (
            <div>

                <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={mapStyle}
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })}                >
                    {data ? data.map(this._renderMarker) : null}
                </ReactMapGL>
            </div>
        );
    }
}

export default Map;