import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
require("dotenv").config();


const firebaseConfig = {
    apiKey: process.env.fireapiKey,
    authDomain: process.env.fireauthDomain,
    projectId: process.env.fireprojectId,
    storageBucket: process.env.firestorageBucket,
    messagingSenderId: process.env.firemessagingSenderId,
    appId: process.env.fireappId,
    measurementId: process.env.firemeasurementId
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };