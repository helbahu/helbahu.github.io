"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureUserIsAdmin,
  ensureUserIsAdminOrCorrectUser
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");


describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
     //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe("ensureUserIsAdmin", function () {
  test("works", async () => {
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    await ensureUserIsAdmin(req, res, next);
  });

  test("unauth if not admin", async () => {
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureUserIsAdmin(req, res, next);
  });
});

describe("ensureUserIsAdminOrCorrectUser", function () {
  test("works if admin", async () => {
    const req = {params: {username: "otheruser"}};
    const res = { locals: { user: { username: "test", is_admin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    await ensureUserIsAdminOrCorrectUser(req, res, next);
  });

  test("works if correct user but not admin", async () => {
    const req = {params: {username: "test"}};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    await ensureUserIsAdminOrCorrectUser(req, res, next);
  });

  test("unauth if not admin or correct user", async () => {
    const req = {params: {username: "otheruser"}};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err.status).toBe(401);
    };
    await ensureUserIsAdminOrCorrectUser(req, res, next);
  });

});
