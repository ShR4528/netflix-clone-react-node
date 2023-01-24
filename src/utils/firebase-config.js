import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAcE8LcMVlbIZXgqL8ESZPXt56lRAnTJnk",
    authDomain: "netflix-react-clone-f7493.firebaseapp.com",
    projectId: "netflix-react-clone-f7493",
    storageBucket: "netflix-react-clone-f7493.appspot.com",
    messagingSenderId: "299833584882",
    appId: "1:299833584882:web:14382dfafcbf26277bb46b",
    measurementId: "G-48VFBBNF5N"
};


const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app)

