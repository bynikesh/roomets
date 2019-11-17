const express = require("express");
const connectDB = require("./config/dbconnection");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
// connect the app to DataBase
// Monogo
connectDB();

// Initialize middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("helloworld");
});

// Define the API Routes
// @ routes/api/
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/rooms", require("./routes/api/rooms"));

app.listen(PORT);
console.log("Open http://localhost:5000/ in Browser to start");
