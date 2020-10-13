const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./models");

mongoose.connect(
  "mongodb+srv://unifeso:unifeso-password@unifeso.kwuxv.gcp.mongodb.net/unifeso-financial-control?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("MongoDB Connected.");
});

const dictionary = {};

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CREATE
app.post("/", async (request, response) => {
  const jsonContent = request.body;
  // User -> objeto responsável por acessar o banco de dados.
  try{
    const user = await User.create(jsonContent);
    response.status(201).send(user);
  }
  catch {
    response.status(400).json({'Erro': 'Usuário não foi cadastrado.'});
  }

});

// READ
app.get("/:id", (request, response) => {
  User.findById(request.params.id, (err, user) => {
    if(err) {
      return response.status(404).send({
        message: "Usuário com este ID não foi encontrado."
      })
    } else {
      return response.status(201).send(user);
    }
  });
});

// UPDATE
app.put("/:id", (request, response) => {
  const updatedObj = request.body;

  User.findByIdAndUpdate(request.params.id, updatedObj, (err, user) => {
    if(err) {
      return response.status(404).send({
        message: "Usuário não encontrado."
      }) 
    } else {
      return response.status(201).send({
        message: "Cadastro alterado com sucesso.",
        user: user
      })
    }
  });
});

// DELETE
app.delete("/:id", async (request, response) => {
  const { id } = request.params;

  User.findByIdAndRemove(id, (err, doc) => {
    if(!err) {
      response.status(204).end();
    } else {
      response.status(404).json({'Erro': 'Usário não foi encontrado'});
    }
  });
});

const port = 8090;
app.listen(port, () => console.log(`Rodando em localhost:${port}`));
