import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hey From EventSphere Backend");
});

app.listen(5050, () => {
  console.log("Server Running on Port 5000");
});
