import express from "express";
import cors from "cors";
import { emitGraphData, getGraph, getGraphDOT, getGraphSVG, getJSONGraphRequest } from "./ops/graph/graph";
import { postPaperWithDOI, postPaperWithoutDOI } from "./ops/post";
import { emitPapersTags, getPapers, getPapersWithTitle, getTags } from "./ops/get";
import { clean } from "./ops/graph/utils";
import http from 'http';
import { Server } from 'socket.io';
import { getJSON, loadJSON, updateJSON } from "./model";


const app = express();
const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Websocket
const server = http.createServer(app);
const io = new Server(server);

// Add middleware
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors(corsOptions));

// Define routes for REST API
app.get("/", (req, res) => {
  console.log("GET /");
  res.send("Hello World!");
});
app.post("/papers/doi", postPaperWithDOI);
app.post("/papers/withoutDoi", postPaperWithoutDOI);
app.get("/papers", getPapers);
app.get("/papersWith/:title", getPapersWithTitle);
app.post("/graph/svg", getGraphSVG)
app.post("/graph/dot", getGraphDOT)
app.get("/tags", getTags);
app.delete("/clean", clean);
app.post("/graph", getGraph);
app.post("/json_graph", getJSONGraphRequest);
app.get("/data/", getJSON);
app.post("/data/replace/", loadJSON);
app.post("/data/update/", updateJSON);

// Define routes for websocket
io.on('connection', (socket) => {
  console.log('a user connected');
  // Emit papers, tags and graph
  emitGraphData(socket);
  emitPapersTags(socket);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// Export default the app for use in other modules typescript with import app from "./app";
export default app;
