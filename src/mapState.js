import { fromJS } from 'immutable';
import outdoorStyle from './style.json';
import satStyle from './satStyle.json';
// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
    id: 'point',
    source: 'track',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#007cbf',
    }
});

export const defaultMapStyle = fromJS(satStyle);