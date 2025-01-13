import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectMongo } from "./db/db.config";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hey From EventSphere Backend");
});

// connecting the database
async function connectDB() {
  await connectMongo(process.env.MONGO_URI as string);
}
connectDB();

// connecting routes
app.use("/api", routes);

app.listen(5050, () => {
  console.log("Server Running on Port 5050");
});
