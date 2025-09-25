const express = require("express");
const itemRoutes = require("./routes");
const itemsDb = require("./fakeDb.js")

const app = express();
const port = 3000;

app.use(express.json());
app.use('/items', itemRoutes);

module.exports = app;