process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let itemsDb = require("./fakeDb");

let mayo = { "name": "Mayo", "price": 5.50};

beforeEach(function() {
    itemsDb.push(mayo);
});

afterEach(function() {
    itemsDb.length = 0;
});

describe("GET /items", () => {

    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual([mayo]);
    });

    test("Get one item", async () => {
        const res = await request(app).get("/items/Mayo");
        
        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual(mayo);
    });

    test("Nonexisting an item", async () => {
        const res = await request(app).get("/items/milk");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Not Found"})
    });

});

describe("Post /items", () => {
    test("Post a new item", async () => {
        const newItem = {"name": "bacon", "price": 3.49};
        const res = await request(app).post("/items").send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": newItem})
    });
    test("Adding an item with missing info", async () => {
        const badItem = {"name": undefined, "price": 2.50};
        const res = await request(app).post("/items").send(badItem);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "Name and price are required."})
    })
});

describe("Change an exiting item", () => {
    test("Patch an existing item", async () => {

        const res = await request(app).patch(`/items/${mayo.name}`).send({name: "egg"});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": {"answer": {"name": "egg", "price": 5.50}}})
    });

    test("Patching a nonexisting item", async () => {
        const resp = await request(app).patch(`/items/item`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("Delete an item for the list", () => {
    test("deleting an item", async () => {
        const res = await request(app).delete(`/items/${mayo.name}`)

        expect(res.body).toEqual({message: "Deleted"});
    });

    test("Deleting a nonexisting item", async () => {
        const resp = await request(app).delete(`/items/item`);
        expect(resp.statusCode).toBe(404);
    });
});