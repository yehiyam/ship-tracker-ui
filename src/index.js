import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// const config = {
//     apiKey: process.env.REACT_APP_FIREBASE_TOKEN,
//     projectId: 'ship-tracker-ba67c',
// };



ReactDOM.render(

    <App />
    , document.getElementById('root'));
registerServiceWorker();
