import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBFJ5VetnAOx0D_BFt6_AID0qW6ImIO5Uo",
    authDomain: "book-manager-95941.firebaseapp.com",
    databaseURL: "https://book-manager-95941.firebaseio.com",
    projectId: "book-manager-95941",
    storageBucket: "book-manager-95941.appspot.com",
    messagingSenderId: "187966460292"
};
firebase.initializeApp(config);

export default firebase;