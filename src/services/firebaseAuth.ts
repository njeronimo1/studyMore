// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmQU7_hqsckdAbMgMSa4NrYiAeeUA6v9E",
  authDomain: "dashnj-cf540.firebaseapp.com",
  projectId: "dashnj-cf540",
  storageBucket: "dashnj-cf540.appspot.com",
  messagingSenderId: "896386438074",
  appId: "1:896386438074:web:4eed2fedaccd4628d24383",
  measurementId: "G-HZ4Y9102K4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);