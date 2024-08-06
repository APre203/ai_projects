import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB3E2Q2ZYkMZTI3IEEhZv4Hew4q-Ol6OPA",
    authDomain: "ai-projects-35650.firebaseapp.com",
    projectId: "ai-projects-35650",
    storageBucket: "ai-projects-35650.appspot.com",
    messagingSenderId: "240442172964",
    appId: "1:240442172964:web:7a533346803e5842e79ab1",
    measurementId: "G-WQM1G63Y3F"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };