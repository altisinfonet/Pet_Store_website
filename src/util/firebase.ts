// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAXEpbeZsiEYvXthTbHxCOAX300bOhvyn4",
    authDomain: "mignonne-pink-paws.firebaseapp.com",
    projectId: "mignonne-pink-paws",
    storageBucket: "mignonne-pink-paws.firebasestorage.app",
    messagingSenderId: "543597676887",
    appId: "1:543597676887:web:a00f75399dba7d50ccd612",
    measurementId: "G-BYW070J97W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export let messaging: any;

// Check if browser supports Firebase Messaging
if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
    messaging = getMessaging(app);
} else {
    console.warn("Push messaging is not supported in this browser.");
}



export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission, "notification permission");

    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BLurJvhpLGiIONwZegB34Ekjmh9nT6FCtv020SSgnp528SKX9T_l827AKIU0Y3eNKTaC60jf2Wsc9SuyDb-ZA0w"
        });

        return token;
    }
}


export const onForegroundMessage = (callback: any) => {
    if (messaging !== undefined) {
        return onMessage(messaging, (payload) => {
            console.log("[FCM Foreground] Notification received:", payload);
            callback(payload);
        });
    }
};