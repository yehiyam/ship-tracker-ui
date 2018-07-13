import React, { Component } from 'react';
import ReactMapGL, { FlyToInterpolator, Marker } from 'react-map-gl';
import { ScaleControl } from "mapbox-gl";
import { fromJS } from 'immutable';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { db } from './firestore'
import { easeCubic } from 'd3-ease';
import ReactGA from 'react-ga';
import { defaultMapStyle, dataLayer, dataLayerLine } from './mapState.js';
import MARKER_STYLE from './marker-style';
import trips from './trips';
const moment = require('moment-timezone');
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
        lastPos: null,
        dateMarkers: [],
        isLoaded: true,
        hoverInfo: null,
        mouseLocation: null,
        selectedTrip: 2

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
    _clearData = () => {
        const mapStyle = defaultMapStyle
            // Add point layer to map
            .set('layers', defaultMapStyle.get('layers').remove(dataLayerLine).remove(dataLayer))


        this.setState({ mapStyle });
    }

    _loadData = (data, lineData) => {
        const mapStyle = defaultMapStyle
            // Add geojson source to map
            .setIn(['sources', 'track'], fromJS({ type: 'geojson', data }))
            .setIn(['sources', 'trackLine'], fromJS({ type: 'geojson', data: lineData }))
            // Add point layer to map
            .set('layers', defaultMapStyle.get('layers').push(dataLayerLine).push(dataLayer))


        this.setState({ data, mapStyle });
    };

    componentDidMount() {
        ReactGA.initialize('UA-121693825-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
        window.onresize = () => {
            this.setState({
                viewport: {
                    ...this.state.viewport,
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            })
        };
        const map = this.mapRef.getMap();
        map.addControl(new ScaleControl({
            maxWidth: 200
        }));
    }
    loadFromFirestore() {
        this.setState({ isLoaded: false });
        this._clearData();
        if (this.state.selectedTrip < 0) {
            return;
        }
        // ReactMapGL.getMap().on('load',()=>{
        let ref = db.collection('ship-location')
            .orderBy('timestamp', 'asc');
        if (this.state.selectedTrip !== 0) {
            const trip = trips[this.state.selectedTrip];
            ref = ref.where('timestamp', '>', trip.start)
                .where('timestamp', '<', trip.end)
        }
        ref.get()
            .then(collection => {
                const data = collection.docs.map(d => ({ ...(d.data()), 'marker-symbol': 'rocket' }))
                // .map(d=>([d.long, d.lat]))
                // this.setState({ data });
                const line = data.map(d => {
                    const lat = +d.lat;
                    const long = +d.long;
                    return [long < 0 ? long + 360 : long, lat]
                });
                const geoJsonData = GeoJSON.parse(data, { Point: ['lat', 'long'] });
                const geoJsonLine = GeoJSON.parse({ line }, { 'LineString': 'line' });
                this._loadData(geoJsonData, geoJsonLine)
                const { lat, long, timestamp } = data[data.length - 1];
                // this.setState({ viewport: { ...this.state.viewport, latitude: +lat, longitude: +long, zoom: 4 } });
                this._goToPos(+lat, +long, 4)
                const dateMarkers = data.filter(d => {
                    if (!d.timestamp) {
                        return false;
                    }
                    const hours = moment.tz(d.timestamp, 'UTC').tz('Asia/Kamchatka').hours();
                    return (hours === 7);
                })
                this.setState({
                    lastPos: {
                        lat: +lat,
                        long: +long,
                        timestamp: new Date(timestamp)
                    },
                    isLoaded: true,
                    dateMarkers
                })
            })
        // })

    }

    _normalizeLong(long, viewportLong) {
        if (viewportLong < 0) {
            long = long > 0 ? long - 360 : long;
        }
        else {
            long = long < 0 ? long + 360 : long;
        }
        return long;
    }

    _renderLastPos(item, viewportLong) {
        if (!item) {
            return null;
        }
        const lat = +item.lat;
        const long = this._normalizeLong(+item.long, viewportLong);
        return (
            <Marker latitude={lat} longitude={long} >
                <div className="station">
                    <span>
                        {item.timestamp.toString()}
                    </span>
                </div>
            </Marker>
        )
    }
    _createDayMarker(item, i, viewportLong) {
        const lat = +item.lat;
        const long = this._normalizeLong(+item.long, viewportLong);

        return (
            <Marker key={`hourly${i}`}
                latitude={lat}
                longitude={long} >
                <div className="hourly">
                    <span>
                        {moment(item.timestamp).tz('Asia/Kamchatka').format('D MMM')}
                    </span>
                </div>
            </Marker>
        )
    }

    _normalizeLongLat([long, lat]) {
        if (long > 180) {
            long = 360 - long;
        }
        if (long < -180) {
            long = long + 360;
        }
        return [long, lat];
    }
    _onHover(event) {
        let hoverInfo = null;

        const point = event.features && event.features.find(f => f.layer.id === 'point');
        if (point) {
            hoverInfo = {
                lngLat: event.lngLat,
                properties: point.properties
            };
        }
        this.setState({ hoverInfo, mouseLocation: this._normalizeLongLat(event.lngLat) })
    };

    _mouse = (container, event) => {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left - container.clientLeft;
        const y = event.clientY - rect.top - container.clientTop;
        return [x, y];
    }

    _onMouseMove(event) {
        //const pixel = this._mouse(this.refs.container, event);
        //const lngLat = this.context.viewport.unproject(pixel);
        console.log(event)

    }

    _renderMouseLocation() {

        return (
            <div className='mouse-location'>
                {/* {this.state.mouseLocation ? formatcoords(this.state.mouseLocation, true).format({decimalPlaces:0}) : null}
                <br/> */}
                {this.state.mouseLocation ? `${this.state.mouseLocation[1].toFixed(3)} ${this.state.mouseLocation[0].toFixed(3)}` : null}
            </div>
        )
    }
    _renderHover() {
        //        {lastPos ? <Marker latitude={lastPos.lat} longitude={lastPos.long} > <div className="station"><span>{lastPos.timestamp.toString()}</span></div></Marker> : null}
        const { hoverInfo } = this.state;
        if (!hoverInfo) {
            return null;
        }
        return (
            <Marker latitude={hoverInfo.lngLat[1]} longitude={hoverInfo.lngLat[0]}>
                <div className="station"><span>{moment(hoverInfo.properties.timestamp).tz('Asia/Kamchatka').format('D MMM H:mm')}</span></div>
            </Marker>
        )

    }

    handleChange = (event) => {
        this.setState({ selectedTrip: event.target.value });
        
    };

    componentWillUpdate(nextProps, nextState){
        if (this.state.selectedTrip !== nextState.selectedTrip){
            this.loadFromFirestore();
        }
    }

    render() {
        const { viewport, mapStyle, lastPos, isLoaded, dateMarkers } = this.state;
        return (
            <div>

                <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={mapStyle}
                    {...viewport}
                    onViewportChange={this._onViewportChange}
                    onLoad={this.loadFromFirestore.bind(this)}
                    onHover={this._onHover.bind(this)}
                    onMouseMove={this._onMouseMove.bind(this)}
                    ref={map => this.mapRef = map}     >
                    <div>
                        {isLoaded ? null : <div className="loading">Loading</div>}
                        <style>{MARKER_STYLE}</style>
                        {dateMarkers.map((item, i) => this._createDayMarker(item, i, viewport.longitude))}
                        {this._renderLastPos(lastPos, viewport.longitude)}
                        {this._renderHover()}
                        {this._renderMouseLocation()}
                    </div>
                </ReactMapGL>
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

export default Map;