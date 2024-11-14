// Here I am using Firebase version 10.12.3, 
// you can use Firebase version 10.12.3 and above, 
// because the Firebase legacy API has been turned off as of July 20 2024,
// see https://firebase.google.com/docs/cloud- messaging/migrate-v1

importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-app-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-messaging-compat.min.js");

firebase.initializeApp({
  "apiKey": 'AIzaSyCaU32s0LFWhtJES2IvltZ1LvC4AEcHDqc',
  "authDomain": 'fir-test-project1-29b77.firebaseapp.com',
  "projectId": 'fir-test-project1-29b77',
  "storageBucket": 'fir-test-project1-29b77.appspot.com',
  "messagingSenderId": '1075656025401',
  "appId": '1:1075656025401:web:05c434f90f617e7fba34e8',
  "measurementId": 'G-EGXWEGE1CV'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (message) => {
  console.log("firebase-messaging-sw.js: Received background message ", message);

  self?.registration?.showNotification(message?.data?.title || "Notification Title", {
    icon: message?.data?.icon,
    badge: message?.data?.badge,
    body: message?.data?.body
  })
})