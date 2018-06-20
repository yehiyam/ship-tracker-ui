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
            width: window.innerWidth,
            height: window.innerHeight,
            latitude: 20,
            longitude: 40,
            zoom: 2
        }
    };

    _loadData = data => {
        const mapStyle = defaultMapStyle
            // Add geojson source to map
            .setIn(['sources', 'track'], fromJS({ type: 'geojson', data }))
            // Add point layer to map
            .set('layers', defaultMapStyle.get('layers').push(dataLayer));

        this.setState({ data, mapStyle });
    };

    componentDidMount() {
        window.onresize = () => this.setState({
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }
    loadFromFirestore() {
        // ReactMapGL.getMap().on('load',()=>{
        db
            .collection('ship-location')
            .orderBy('timestamp', 'asc')
            .get()
            .then(collection => {
                const data = collection.docs.map(d => ({ ...(d.data()), 'marker-symbol': 'rocket' }))
                // .map(d=>([d.long, d.lat]))
                // this.setState({ data });
                const geoJsonData = GeoJSON.parse(data, { Point: ['lat', 'long'] });
                this._loadData(geoJsonData)
            })
        // })

    }

    _renderMarker(location, i) {
        const { timestamp, lat, long } = location;
        return (
            <Marker key={i} longitude={+long} latitude={+lat} >
                <div className="station"><span>{timestamp ? new Date(timestamp).toString() : ''}</span></div>
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
                    onViewportChange={(viewport) => this.setState({ viewport })}
                    onLoad={this.loadFromFirestore.bind(this)}        >

                </ReactMapGL>
            </div>
        );
    }
}

export default Map;