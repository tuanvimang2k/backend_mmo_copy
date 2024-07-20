const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const dotenv = require("dotenv");
dotenv.config();
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,

    // apiKey: "AIzaSyAbCI0bYQtgCc4lD1h87D8NKh10rVut754",
    // authDomain: "my-project-260145.firebaseapp.com",
    // projectId: "my-project-260145",
    // storageBucket: "my-project-260145.appspot.com",
    // messagingSenderId: "589463831702",
    // appId: "1:589463831702:web:34a3196ae80cb08ce86eb7",
    // measurementId: "G-HCF0W6MQFZ",

    // apiKey: "AIzaSyAe9H5oyGw7O4tv3anf9P4bvFAzTX-eptM",
    // authDomain: "mmoweb3-6bd6f.firebaseapp.com",
    // projectId: "mmoweb3-6bd6f",
    // storageBucket: "mmoweb3-6bd6f.appspot.com",
    // messagingSenderId: "660261102053",
    // appId: "1:660261102053:web:20ec1fd4cc2c0ec0c38f0c",
    // measurementId: "G-WNC44N2QK4",
};

// Initialize Firebase
//console.log(process.env.STORAGE_BUCKET);
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
