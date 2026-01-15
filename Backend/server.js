const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const donorRoutes = require("./routes/donorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/lifelink")
  .then(() => console.log("MongoDB Connected (Local)"))
  .catch(err => console.error(err));
app.use("/api/donors", donorRoutes);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
