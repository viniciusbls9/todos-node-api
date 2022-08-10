const request = require('supertest');
const { validate } = require('uuid');

const app = require('../');

describe('Todos', () => {
  it("should be able to list all user's todo", async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user1'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .get('/todos')
      .set('username', userResponse.body.username);

    expect(response.body).toEqual(
      expect.arrayContaining([
        todoResponse.body
      ]),
    )
  });

  it('should be able to create a new todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user2'
      });

    const todoDate = new Date();

    const response = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'test todo',
      deadline: todoDate.toISOString(),
      done: false
    });
    expect(validate(response.body.id)).toBe(true);
    expect(response.body.created_at).toBeTruthy();
  });
});
