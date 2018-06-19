import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import '@firebase/firestore';
import { FirestoreProvider } from 'react-firestore';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// const config = {
//     apiKey: process.env.REACT_APP_FIREBASE_TOKEN,
//     projectId: 'ship-tracker-ba67c',
// };

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_TOKEN,
    authDomain: "ship-tracker-ba67c.firebaseapp.com",
    databaseURL: "https://ship-tracker-ba67c.firebaseio.com",
    projectId: "ship-tracker-ba67c",
    storageBucket: "ship-tracker-ba67c.appspot.com",
    messagingSenderId: "22141898653"
};
firebase.initializeApp(config);

ReactDOM.render(
    <FirestoreProvider firebase={firebase}>
        <App />
    </FirestoreProvider>, document.getElementById('root'));
registerServiceWorker();
