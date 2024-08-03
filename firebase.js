// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOAnXYGas87GQs4VqRlVM8P4DFPZmeJSc",
  authDomain: "hspantryapp-b080a.firebaseapp.com",
  projectId: "hspantryapp-b080a",
  storageBucket: "hspantryapp-b080a.appspot.com",
  messagingSenderId: "787165012857",
  appId: "1:787165012857:web:4ee87280a75b5c3aab45a8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { app, firestore };
