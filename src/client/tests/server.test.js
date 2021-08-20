import {describe, expect} from "@jest/globals";

const request = require("supertest");
const app = require("../../server/server");

describe("Test the root path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});


