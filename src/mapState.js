import { fromJS } from 'immutable';
import MAP_STYLE from './style.json';
// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
    id: 'data',
    source: 'track',
    type: 'symbol',
    interactive: true,
    layout: {
        'icon-image': '{icon}-15'
    }
});

export const defaultMapStyle = fromJS(MAP_STYLE);