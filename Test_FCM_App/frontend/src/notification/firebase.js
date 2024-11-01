// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken} from "firebase/messaging";
import firebaseConfig from "./fcmCredentials";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);


export const requestNotificationPermission = async () => {
  try {
    // requesting notification permission
    const permission = await Notification.requestPermission();

    if (permission) {
      console.info("Notification permission granted.");
    }
  } catch (err) {
    console.error("Unable to get permission to notify.", err);
  }
  
};


export const getFCMToken = async () => {
  const registration  = await navigator.serviceWorker.register("./firebase-messaging-sw.js");
  
  let token;

  try {
    token = await getToken(messaging, {vapidKey: process.env.REACT_APP_VAPID_KEY});

    localStorage.setItem("fcmToken", JSON.stringify(token));

    console.info("Got FCM token:", token);
  } catch (err) {
    console.error("Unable to get FCM token.", err);
  }

  return token;
};

export const initializeFCM = async () => {
  await Promise.all([requestNotificationPermission(), getFCMToken()]);
};