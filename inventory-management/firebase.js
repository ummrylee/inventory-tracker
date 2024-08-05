// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy9pSMSnsj_wqcT9Wqvkw95rvJkeJ6TLg",
  authDomain: "inventory-management-eca81.firebaseapp.com",
  projectId: "inventory-management-eca81",
  storageBucket: "inventory-management-eca81.appspot.com",
  messagingSenderId: "579473486999",
  appId: "1:579473486999:web:43fbd8549b1f4fe71de5d2",
  measurementId: "G-VBSNTVNMEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };