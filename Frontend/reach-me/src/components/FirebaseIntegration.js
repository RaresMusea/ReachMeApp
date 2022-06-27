import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/storage';

//Firebase Configuration-Conexiunea catre server-ul firebase, va permite autentificarea, cat si stocarea de date din cadrul aplicatiei intr-o platforma Cloud de la Google.
const firebaseConfig = {
    apiKey: "AIzaSyCktpPB5PnRpS5iK0Vpt6jDSjtyQ3w3BWQ",
    authDomain: "reachme-e6b0a.firebaseapp.com",
    projectId: "reachme-e6b0a",
    storageBucket: "reachme-e6b0a.appspot.com",
    messagingSenderId: "843735547881",
    appId: "1:843735547881:web:6d05ef5c5ec943cd1e9578"
};

//Initializam o aplicatie de tip firebase
const app = firebase.initializeApp(firebaseConfig);

//Componentele de autentificare si, respectiv stocare pentru aplicatia web
const authentication = firebase.auth();
const storage = firebase.storage();

//Export explicit al acestor 2 componente catre alte module Javascript din cadrul proiectului
export {storage, authentication};