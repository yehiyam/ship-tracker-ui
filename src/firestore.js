//top of the file
import firebase from 'firebase'
require('firebase/firestore')

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_TOKEN,
    authDomain: "ship-tracker-ba67c.firebaseapp.com",
    databaseURL: "https://ship-tracker-ba67c.firebaseio.com",
    projectId: "ship-tracker-ba67c",
    storageBucket: "ship-tracker-ba67c.appspot.com",
    messagingSenderId: "22141898653"
};
firebase.initializeApp(config);


//bottom of the file
export const db = firebase.firestore()