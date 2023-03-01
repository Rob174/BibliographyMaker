import express from "express";
import cors from "cors";
import { getGraph, getJSONGraphRequest } from "./ops/graph/graph";
import { postPaperWithDOI, postPaperWithoutDOI } from "./ops/post";
import { getPapers, getPapersWithTitle, getTags } from "./ops/get";
import { clean } from "./ops/graph/utils";

const app = express();
const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors(corsOptions));

// Define routes
app.get("/", (req, res) => {
  console.log("GET /");
  res.send("Hello, world!");
});
app.post("/papers/doi", postPaperWithDOI);
app.post("/papers/withoutDoi", postPaperWithoutDOI);
app.get("/papers", getPapers);
app.get("/papersWith/:title", getPapersWithTitle);
app.get("/tags", getTags);
app.delete("/clean", clean);
app.post("/graph", getGraph);
app.post("/json_graph", getJSONGraphRequest);
// Export default the app for use in other modules typescript with import app from "./app";
export default app;
