const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const titleFilter = title
    ? repositories.find(repository => repository.title.toUpperCase().includes(title.toUpperCase()))
    : repositories;

  return response.json(titleFilter);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ err: "Repository not found." });
  }

  repository.techs = techs;
  repository.title = title;
  repository.url = url;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryExist = repositories.findIndex(repository => repository.id === id);

  if (repositoryExist < 0) {
    return response.status(400).json({ err: "Repository not found." });
  }

  repositories.splice(repositoryExist, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ err: "Repository not found." });
  }

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
