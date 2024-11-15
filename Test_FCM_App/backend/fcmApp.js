import firebaseAdmin from 'firebase-admin';
import firebaseServiceAccount from './firebase-service-account.js';

// Initialize Firebase app
export const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount)
});

// Initialize Firebase messaging
export const messaging = firebaseApp.messaging();