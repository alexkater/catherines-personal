// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUPthCi89adBG2sCjE6Me4R5xBtknLJ7E",
  authDomain: "catherinereact-4f5ff.firebaseapp.com",
  projectId: "catherinereact-4f5ff",
  storageBucket: "catherinereact-4f5ff.firebasestorage.app",
  messagingSenderId: "265181855819",
  appId: "1:265181855819:web:f8a7ddb142f5f9dfae4dce",
  measurementId: "G-GEMBK5BHRJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
