const request = require("supertest");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");


describe("User Routes Test", function () {

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
      
    let msg2 = await Message.create({
        from_username: "user2", 
        to_username: "user1", 
        body: "Text for message from user2 to user1"
    })

  });


  // GET /users - get list of users.
  describe("GET /users",()=>{
    test("Get list of all users", async ()=>{
        let allUsers = await request(app).get("/users");
        expect(allUsers.body.users.length).toEqual(3);
        expect(allUsers.body.users[0]).toEqual({
            username: "user1",
            first_name: "User1",
            last_name: "Userson1",
            phone: "+14155550000"
        });

    }) 
  })

  //   GET /users/:username - get detail of users.
  describe("GET /users/:username",()=>{
    test("Get details about a user. Not signed in.", async ()=>{
        let user = await request(app).get("/users/user1");
        expect(user.status).toEqual(401);
    }) 

    test("Get details about a user. Signed in.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;

        let user = await request(app).get(`/users/user1?_token=${token}`);
        expect(user.status).toEqual(200);
        expect(user.body.user).toEqual({
            username: "user1",
            first_name: "User1",
            last_name: "Userson1",
            phone: "+14155550000",
            join_at:expect.any(String),
            last_login_at:expect.any(String)
        });

    }) 

    test("Get details about a user. Signed in but invalid user.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user2", password: "password123" });

        let token = response.body.token;

        let user = await request(app).get(`/users/user1?_token=${token}`);
        expect(user.status).toEqual(401);

    }) 
    
  })

// GET /users/:username/to - get all messages that were sent to this user.
describe("GET /users/:username/to",()=>{
    test("Get all messages that were sent to this user. Not signed in.", async ()=>{
        let messages = await request(app).get("/users/user1/to");
        expect(messages.status).toEqual(401);

    }) 

    test("Get all messages that were sent to this user. Signed in.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;

        let messages = await request(app).get(`/users/user1/to?_token=${token}`);
        expect(messages.status).toEqual(200);
        expect(messages.body.messages.length).toEqual(1);
        expect(messages.body.messages[0].from_user.username).toEqual("user2");                
    }) 

    test("Get all messages that were sent to this user. Signed in but invalid user.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;

        let messages = await request(app).get(`/users/user2/to?_token=${token}`);
        expect(messages.status).toEqual(401);
    }) 
  })




// GET /users/:username/from - get all messages that were sent from this user.
describe("GET /users/:username/from",()=>{
    test("Get all messages that were sent from this user. Not signed in.", async ()=>{
        let messages = await request(app).get("/users/user1/from");
        expect(messages.status).toEqual(401);

    }) 

    test("Get all messages that were sent from this user. Signed in.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;

        let messages = await request(app).get(`/users/user1/from?_token=${token}`);
        expect(messages.status).toEqual(200);
        expect(messages.body.messages.length).toEqual(1);
        expect(messages.body.messages[0].to_user.username).toEqual("user2");                
    }) 

    test("Get all messages that were sent from this user. Signed in but invalid user.", async ()=>{
        let response = await request(app)
            .post("/auth/login")
            .send({ username: "user1", password: "password" });

        let token = response.body.token;

        let messages = await request(app).get(`/users/user2/from?_token=${token}`);
        expect(messages.status).toEqual(401);
    }) 
  })


});

afterAll(async function () {
  await db.end();
});
