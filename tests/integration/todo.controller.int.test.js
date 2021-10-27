const request = require("supertest");
const app = require("../../app");
const { connect, disconnect } = require("../../mongodb/mongodb.connect");
const newTodo = require("../mock-data/new-todo.json");

const endPointUrl = "/todos/";

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

describe(endPointUrl, () => {
  let firstTodo, newTodoId;
  const testData = { title: "Make integrate test for PUT", done: true };

  it("POST " + endPointUrl, async () => {
    const response = await request(app).post(endPointUrl).send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);

    newTodoId = response.body._id;
  });

  it(
    "should return error 500 on malformed data with POST " + endPointUrl,
    async () => {
      const response = await request(app)
        .post(endPointUrl)
        .send({ title: "Missing done property" });
  
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "Todo validation failed: done: Path `done` is required.",
      });
    }
  );
  
  it("GET " + endPointUrl, async () => {
    const response = await request(app).get(endPointUrl);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();

    firstTodo = response.body[0];
  });

  it("GET BY ID " + endPointUrl + ":todoId", async () => {
    const response = await request(app).get(endPointUrl + firstTodo._id);
  
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  
  it("GET BY ID doesn't exist " + endPointUrl + ":todoId", async () => {
    const response = await request(app).get(endPointUrl + "617836cdbd664cb998cb4941");
    expect(response.statusCode).toBe(404);
  });

  it("PUT " + endPointUrl, async () => {
    const response = await request(app)
      .put(endPointUrl + newTodoId)
      .send(testData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });

  it("PUT ID doesn't exist " + endPointUrl + ":todoId", async () => {
    const response = await request(app).put(endPointUrl + "617836cdbd664cb998cb4941");
    expect(response.statusCode).toBe(404);
  });

  it("DELETE " + endPointUrl, async () => {
    const response = await request(app)
      .delete(endPointUrl + newTodoId)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
  });

  it("DELETE ID doesn't exist " + endPointUrl + ":todoId", async () => {
    const response = await request(app).delete(endPointUrl + newTodoId);
    expect(response.statusCode).toBe(404);
  });
});

