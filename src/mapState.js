import { fromJS } from 'immutable';
import outdoorStyle from './style.json';
// import satStyle from './satStyle.json';
// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'point',
  source: 'track',
  type: 'circle',
  paint: {
    'circle-radius': 3,
    'circle-color': '#007cbf',
  }
});
export const dataLayerLine = fromJS({
  id: 'lines',
  source: 'trackLine',
  type: 'line',
  layout: {
    "line-join": "round",
    "line-cap": "round"
  },
  paint: {
    "line-color": "#E9967A",
    "line-width": 3
  }
});

export const defaultMapStyle = fromJS(outdoorStyle);