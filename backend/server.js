import express from "express";
import cors from "cors";
import restaurant from "./api/restaurant.route.js";

const app = express();

app.use(cors()); //apply middleware cors api
app.use(express.json()) // use express json 

app.use("/api/v1/restaurant", restaurant) ;//address for server
app.use("*", (req, res) => res.status(404).json({ error: "not found"}));// if address not correct


export default app











