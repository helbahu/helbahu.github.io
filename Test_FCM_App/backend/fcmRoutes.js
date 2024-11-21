import express from 'express';

const router = new express.Router();

import { messaging } from './fcmApp.js';

router.post("/subscribe-to-topic", async (req, res) => {
  try {
    const token = req.body.token || req.query.token || req.headers["x-fcm-token"];
    const genre = req.body.genre || all;
    console.log("TOKEN IS",token);
    console.log("GENRE IS",genre);

    // Subscribe to the "all" topic
    await messaging.subscribeToTopic(token,genre).then(() => {
      console.log("Subscribed To Topic Successfully");
      res.status(200).json({
        message: "Subscribed To Topic Successfully",
        topic:genre
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


router.post("/send-messages", async (req, res) => {
  try {
    const messages = JSON.parse(req.body.messages);
    console.log("MESSAGES LIST   :   ",messages);
    if(messages?.length){
      const sentMessages = [];
      for(const msg of messages){
        const {title,body,icon,genre} = msg;
  
        const message = {
          // token, // token is required
          topic: genre || "all",
          data: {
            ...msg,
            title: title || "AfroWatch Notification",
            body: body,
            icon: icon || "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png"
    
          }
        };

        // Send the message
        sentMessages.push(messaging.send(message));

      }
  
      await Promise.all(sentMessages).then(()=>{
        res.status(200).json({
          message: "All Notifications sent successfully",
        });
      });
    
    }else{
      res.status(200).json({
        message: "No messages were in the given list."
      });
  
    }

  } catch (error) {
    res.status(error?.status || 500).json({
      status: "error",
      message: error?.message || "Something went wrong",
      error

    });
  }
});


export default router;