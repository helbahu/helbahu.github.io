import express from 'express';

const router = new express.Router();

import firebaseAdmin from 'firebase-admin';
import firebaseServiceAccount from './firebase-service-account.js';

// Initialize Firebase app
const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount)
});

// Initialize Firebase messaging
const messaging = firebaseApp.messaging();

router.post("/subscribe-to-topic", async (req, res) => {
  try {
    const token = req.body.token || req.query.token || req.headers["x-fcm-token"];

    console.log("TOKEN IS",token);

    // Subscribe to the "all" topic
    await messaging.subscribeToTopic(token,"all").then(() => {
      console.log("Subscribed To Topic Successfully");
      res.status(200).json({
        message: "Subscribed To Topic Successfully"
      });
    });

  } catch (error) {
    res.status(error?.status || 500).json({
      status: "error",
      message: error?.message || "Something went wrong"
    });
  }
});


router.post("/send-message", async (req, res) => {
  try {
    // Get the token from the request body or query string
    // you can change the token getter method if you prefer
    // example: http://localhost:4000/send-message?token=123hjk12h31jk2h3k1j2h3h2jk3h1j2h3
    const {title,body,icon,other} = req.body;

    const message = {
      // token, // token is required
      topic: "all",
      data: {
        ...req.body,
        title: title || "Simple Notification",
        body: body || "This is a simple notification",
        icon: icon || "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png"

      }
    };

    // Send the message
    await messaging.send(message).then(() => {
      console.log("SENT MESSAGE SUCCESSFULLY!");
      res.status(200).json({
        message: "Notification sent successfully"
      });
    });

  } catch (error) {
    res.status(error?.status || 500).json({
      status: "error",
      message: error?.message || "Something went wrong"
    });
  }
});




export default router;