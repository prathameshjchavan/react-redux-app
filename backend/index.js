const express = require("express");
const bugs = require("./bugs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/bugs", bugs);

app.listen(9001, () => console.log("Node server started on port 9001."));
