const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  verifyIdToken,
} = require("@firebase/auth");
const admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: "AIzaSyA3oVpqxIhuCu6gh29nrj5h_1RwKUL8MZE",
  authDomain: "zoneio.firebaseapp.com",
  projectId: "zoneio",
  storageBucket: "zoneio.appspot.com",
  messagingSenderId: "175968673721",
  appId: "1:175968673721:web:53517a6ace65d4426ca068",
  measurementId: "G-103842MD1R"
};

initializeApp(firebaseConfig);

const auth = getAuth();

// You need to replace the path with your new service account key file path
admin.initializeApp({
  credential: admin.credential.cert(
    "./key/zoneio-firebase-adminsdk-rhllu-c5e9ae7bbf.json",
  ),
});

const adminAuth = admin.auth();

module.exports = {
  firebaseConfig,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  verifyIdToken,
  adminAuth,
};
