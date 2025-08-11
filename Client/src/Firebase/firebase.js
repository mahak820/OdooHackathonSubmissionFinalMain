import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsa20f3qePMFR8ZLQHq4XBGzzl8m6az2A",
  authDomain: "template-1-c05ce.firebaseapp.com",
  projectId: "template-1-c05ce",
  storageBucket: "template-1-c05ce.firebasestorage.app",
  messagingSenderId: "931350039794",
  appId: "1:931350039794:web:b4d492e0ae5e5b0d15d46b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}