const firebase = require("firebase-admin");

const serviceAccount = require('../../formsnow-40b50-firebase-adminsdk-lqb5e-6e765f6715.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://formsnow-40b50.firebaseio.com"
});

const firebaseDatabase = firebase.firestore();

module.exports = {firebaseDatabase};