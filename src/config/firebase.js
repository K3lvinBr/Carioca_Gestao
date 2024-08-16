import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const firebaseConfig = {
    apiKey: "AIzaSyC5O-aE3JGxCrG6drmCPK-xy_us9ZewXic",
    authDomain: "carioca-gestao.firebaseapp.com",
    projectId: "carioca-gestao",
    storageBucket: "carioca-gestao.appspot.com",
    messagingSenderId: "127495248788",
    appId: "1:127495248788:web:d5df5d2188950e2e28cd81",
    measurementId: "G-8PPXM1ZHZ8"
};

GoogleSignin.configure({
    webClientId: "127495248788-cpu905tefedf7i9crbdu367na4me6ler.apps.googleusercontent.com",
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db, GoogleSignin };