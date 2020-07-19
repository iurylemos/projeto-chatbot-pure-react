import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkMSFbdu6s9leKXQuSBXW6s2cAPZIZCcc",
  authDomain: "projeto-react-42f79.firebaseapp.com",
  databaseURL: "https://projeto-react-42f79.firebaseio.com",
  projectId: "projeto-react-42f79",
  storageBucket: "projeto-react-42f79.appspot.com",
  messagingSenderId: "873997791329",
  appId: "1:873997791329:web:0e49e38738f3a70528fa20"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();