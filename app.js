require('dotenv').config()
const express = require("express");
const app =  express()

const apiRoutes = require("./routes/apiRoutes");
const port =  3000

app.use(express.json())

app.use("/", apiRoutes)

app.listen(port, () => {
    console.log(`app is running on port ${port}.`);
  });