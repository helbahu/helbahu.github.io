const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");

let msg1Id;
let msg2Id;

describe("Messages Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    let u1 = await User.register({
      username: "user1",
      password: "password",
      first_name: "User1",
      last_name: "Userson1",
      phone: "+14155550000",
    });

    let u2 = await User.register({
        username: "user2",
        password: "password123",
        first_name: "User2",
        last_name: "Userson2",
        phone: "+13334442222",
    });

    let u3 = await User.register({
        username: "user3",
        password: "password123",
        first_name: "User3",
        last_name: "Userson3",
        phone: "+18884446666",
    });
    
    let msg1 = await Message.create({
        from_username: "user1", 
        to_username: "user2", 
        body: "Text for message from user1 to user2"
    })
    msg1Id = msg1.id;

    
    let msg2 = await Message.create({
        from_username: "user2", 
        to_username: "user1", 
        body: "Text for message from user2 to user1"
    })
    msg2Id = msg2.id;

  });


  //  GET /messages/:id - get detail of message.
  describe("GET /messages/:id",()=>{
    test("Get details of a message. Not signed in.", async ()=>{
        let msg = await request(app).get(`/messages/${msg1Id}`);
        expect(msg.status).toEqual(401);
    }) 

    test("Get details of a message. Signed in and is the from_user.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;
        let msg = await request(app).get(`/messages/${msg1Id}?_token=${token}`);
        expect(msg.status).toEqual(200);
        expect(msg.body.message.from_user.username).toEqual("user1");
    }) 

    test("Get details of a message. Signed in and is the to_user.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;
        let msg = await request(app).get(`/messages/${msg2Id}?_token=${token}`);
        expect(msg.status).toEqual(200);
        expect(msg.body.message.to_user.username).toEqual("user1");
    }) 

    test("Get details of a message. Signed in but unauthorized.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user3", password: "password123" });

        let token = response.body.token;
        let msg = await request(app).get(`/messages/${msg1Id}?_token=${token}`);
        expect(msg.status).toEqual(400);
    })     

  })


// POST /messages - post message.
describe("POST /messages",()=>{
    test("Post a message. Not signed in.", async ()=>{
        let msg = await request(app).post(`/messages`).send({
            to_username: 'user3',
            body: 'Text for this message'
        });
        expect(msg.status).toEqual(401);
    }) 
    test("Post a message. Signed in.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;
        let msg = await request(app).post(`/messages`).send({
            _token: token,
            to_username: 'user3',
            body: 'Text for this message'
        });
        expect(msg.status).toEqual(200);
        expect(msg.body.message.from_username).toEqual("user1");
    }) 
  })

//  POST /message/:id/read - mark message as read
describe("POST /messages/:id/read",()=>{
    test("Mark a message as read. Not signed in.", async ()=>{
        let msg = await request(app).post(`/messages/${msg1Id}/read`).send({});
        expect(msg.status).toEqual(401);
    }) 

    test("Mark a message as read by intended recipient. Signed in.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;
        let msg = await request(app).post(`/messages/${msg2Id}/read`).send({
            _token: token
        });
        expect(msg.status).toEqual(200);
    }) 

    test("Mark a message as read not by intended recipient. Signed in.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;
        let msg = await request(app).post(`/messages/${msg1Id}/read`).send({
            _token: token
        });
        expect(msg.status).toEqual(400);
    }) 

  })

});

afterAll(async function () {
  await db.end();
});
