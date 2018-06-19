import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import { fromJS } from 'immutable';
import { FirestoreCollection } from 'react-firestore';
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

    _loadData = data => {
        const geoJsonData = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
        const mapStyle = defaultMapStyle
        // // Add geojson source to map
        // .setIn(['sources', 'track'], fromJS({ type: 'geojson', geoJsonData }))
        // // Add point layer to map
        // .set('layers', defaultMapStyle.get('layers').push(dataLayer));

        this.setState({ data, mapStyle });
    };

    render() {
        const { viewport, mapStyle } = this.state;
        return (
            <div>
                <FirestoreCollection
                    path="ship-location"
                    sort="timestamp:desc"
                    limit={200}
                    render={({ isLoading, data }) => {
                        if (!isLoading) {
                            // this._loadData(data);
                            const geoJsonData = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
                            console.log(defaultMapStyle)
                            // const mapStyle2 = defaultMapStyle
                            //     .setIn(['sources', 'track'], fromJS({ type: 'geojson', geoJsonData }))
                            //     .set('layers', defaultMapStyle.get('layers').push(dataLayer));
                            return ('xxx')
                        }
                        return <div />
                    }}
                />
                <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={defaultMapStyle}
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                />
            </div>
        );
    }
}

export default Map;