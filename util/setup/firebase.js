var { initializeApp } = require("firebase/app");
var { getDatabase } = require("firebase/database");
const firebaseConfig = {
  apiKey: process.env.FIREBASE_WEB_API_KEY,
  authDomain: process.env.FIREBASE_WEB_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_WEB_DATABASE_URL,
  projectId: process.env.FIREBASE_WEB_PROJECT_ID,
  storageBucket: process.env.FIREBASE_WEB_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_WEB_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_WEB_APP_ID,
  measurementId: process.env.FIREBASE_WEB_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const db = getDatabase();

module.exports = {
  FIREBASE_DATABASE: db,
};
