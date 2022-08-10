const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const userExists = users.find(user => user.username === username)

  if (!userExists) {
    return response.status(400).json({ error: 'User not found' })
  }

  return next()
}

function getUserInfos(username) {
  const getUserInfos = users.find(user => user.username === username)

  if (getUserInfos) return getUserInfos

  return false
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userAlreadyExists = getUserInfos(username)

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists!' })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return response.status(201).json({ users })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers

  const getUserTodos = getUserInfos(username)

  return response.json(getUserTodos.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { username } = request.headers

  const getUser = getUserInfos(username)

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  getUser.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { id } = request.query
  const { username } = request.headers

  const getUserTodos = getUserInfos(username)

  const getTodoById = getUserTodos.todos.find(todo => todo.id === id)

  getTodoById.title = title
  getTodoById.deadline = deadline

  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { username } = request.headers

  const getUserTodos = getUserInfos(username)

  const getTodoById = getUserTodos.todos.find(todo => todo.id === id)

  getTodoById.done = true

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
