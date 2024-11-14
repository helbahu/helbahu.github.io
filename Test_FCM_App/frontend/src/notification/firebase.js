// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, isSupported} from "firebase/messaging";
import firebaseConfig from "./fcmCredentials";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const getMessagingObj = async () => {
	const supported = await isSupported();
	if (supported){
    return getMessaging(app);
  }
  return null;
};

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
  console.log("1111111111111111111111")
  const swRegistration = await navigator.serviceWorker.register("./firebase-messaging-sw.js");
  console.log("22222222222222222222222")
  
  let token;
  let messagingObj;

  try {
    console.log("333333333333333333")
    messagingObj = await getMessagingObj();

    if(messagingObj){
      token = await getToken(messagingObj, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
        serviceWorkerRegistration:swRegistration
      });
      
      console.log("4444444444444444444")

      localStorage.setItem("fcmToken", JSON.stringify(token));
      console.log("55555555555555555555555555")

      console.info("Got FCM token:", token);
      console.log("666666666666666666666")
      return {token,messaging:messagingObj};
    }

  } catch (err) {
    console.log("EEEEEEEEEEEEEEEEEEEEEE")

    console.error("Unable to get FCM token.", err);
  }
  return {};

};

export const initializeFCM = async () => {
  await requestNotificationPermission();
  const res = await getFCMToken();

  if(res.token){
    return res.messaging;
  }
    return null;

};