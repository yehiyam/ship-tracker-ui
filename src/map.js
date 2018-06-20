import React, { Component } from 'react';
import ReactMapGL, { FlyToInterpolator , Marker} from 'react-map-gl';
import { fromJS } from 'immutable';
import { db } from './firestore'
import { easeCubic } from 'd3-ease';
import { defaultMapStyle, dataLayer } from './mapState.js';
import MARKER_STYLE from './marker-style';

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
        }, 
        lastPos: null
    };

    _onViewportChange = viewport => {
        this.setState({ viewport });
    };

    _goToPos = (lat, long, zoom) => {
        const viewport = {
            ...this.state.viewport,
            longitude: long,
            latitude: lat,
            zoom: zoom,
            transitionDuration: 5000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: easeCubic
        };
        this.setState({ viewport });
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
        window.onresize = () => {
            this.setState({
                viewport: {
                    ...this.state.viewport,
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            })
        };
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
                const { lat, long , timestamp} = data[data.length - 1];
                // this.setState({ viewport: { ...this.state.viewport, latitude: +lat, longitude: +long, zoom: 4 } });
                this._goToPos(+lat, +long, 4)
                this.setState({lastPos:{lat: +lat, long: +long, timestamp: new Date(timestamp)}})
            })
        // })

    }

    render() {
        const { viewport, mapStyle, lastPos } = this.state;
        return (
            <div>

                <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={mapStyle}
                    {...viewport}
                    onViewportChange={this._onViewportChange}
                    onLoad={this.loadFromFirestore.bind(this)}        >
                    <style>{MARKER_STYLE}</style>
                    {lastPos?<Marker latitude={lastPos.lat} longitude={lastPos.long} > <div className="station"><span>{lastPos.timestamp.toString()}</span></div></Marker>:null}
                </ReactMapGL>
            </div>
        );
    }
}

export default Map;