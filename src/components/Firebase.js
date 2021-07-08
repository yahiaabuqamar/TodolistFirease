import firebase from "firebase/app";
require("firebase/firestore")
var firebaseConfig = {
    apiKey: "AIzaSyB_LSuDxqrrNOIfZ_L_5gSyN8wQal6RQ8o",
    authDomain: "todolist-a61e9.firebaseapp.com",
    projectId: "todolist-a61e9",
    storageBucket: "todolist-a61e9.appspot.com",
    messagingSenderId: "29728615035",
    appId: "1:29728615035:web:7fc7a5d9a8978bef9190de",
    measurementId: "G-BSBR9Z11PC"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore()
  export {firebase, db as default}