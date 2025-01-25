// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0hu41CcJYLIW9StIR7jIh8Vt7kXsWTVE",
  authDomain: "rapid-page-builder-b5e95.firebaseapp.com",
  projectId: "rapid-page-builder-b5e95",
  storageBucket: "rapid-page-builder-b5e95.appspot.com",
  messagingSenderId: "821060369574",
  appId: "1:821060369574:web:ac25d6d0bc98c4ed6c4867",
  measurementId: "G-ZWNGL007CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }