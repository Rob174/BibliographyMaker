import { spawn } from "child_process";
import { deterministicUuid, formatTrim } from "../utils";
import * as model from "../../model";
import { cleanSVGGenerated, makeNode } from "./utils";
import { generateNodes } from "./generateNodes";
import {
  Edge,
  Graph,
  NodeTxtGenerator,
  PaperJSON,
  Tag,
  TagStructure,
} from "../../types";
import fs from "fs";
import {
  generateNodesEdgesHierarchical,
  generateEdgesSimple,
} from "./generateEdges";
// import package to copy to clipboard
const copy = require("copy-to-clipboard");

export const buildJSONGraph = (
  papers: PaperJSON[],
  tags: Tag[],
  nodeGenerator: NodeTxtGenerator,
  structure?: TagStructure,
  includeOthers = false
) => {
  // Build the JSON
  let edges,
    tagsEdges,
    papersEdges,
    mapPapers,
    nodes,
    papersNodes,
    tagsNodes,
    rootNode;
  rootNode = makeNode(Array(33).fill("b").join(""), " ", "root");
  if (structure === undefined) {
    const res = generateNodes(rootNode, papers, tags, nodeGenerator);
    nodes = res.nodes;
    papersNodes = res.papersNodes;
    tagsNodes = res.tagsNodes;
    rootNode = res.rootNode;
    // console.log("Simple structure");
    const result = generateEdgesSimple(rootNode, tags);
    edges = result.edges;
    tagsEdges = result.tagsEdges;
    papersEdges = result.papersEdges;
    mapPapers = result.mapPapers;
  } else {
    // console.log("Hierarchical structure");
    const result = generateNodesEdgesHierarchical(
      rootNode,
      tags,
      papers,
      structure,
      nodeGenerator,
      includeOthers
    );
    edges = result.edges;
    tagsEdges = result.tagsEdges;
    papersEdges = result.papersEdges;
    mapPapers = result.mapPapers;
    nodes = result.nodes;
    papersNodes = result.papersNodes;
    tagsNodes = result.tagsNodes;
  }
  const graph: Graph = {
    nodes: nodes,
    edges: edges,
  };
  return {
    graph: graph,
    paperNode: rootNode,
    tagsNodes: tagsNodes,
    papersNodes: papersNodes,
    tagsEdges: tagsEdges,
    papersEdges: papersEdges,
  };
};
export const getJSONGraphRequest = (req, res) => {
  return getJSONGraph(req.body, res, true);
};
export const getJSONGraph = (args, res, send = false) => {
  const { shape = "record", structure, includeOthers = false } = args;
  let nodeGenerator = (txt1, txt2) => {
    if (txt2 === undefined) return txt1;
    return `{${txt1}|${txt2}}`;
  };
  if (shape !== "record") {
    nodeGenerator = (txt1, txt2) => {
      if (txt2 === undefined) return txt1;
      return `${txt1}\\n${txt2}`;
    };
  }
  // console.log("getGraph");
  // Build the JSON: Paper as main node, tags as subnodes and papers.bitex.title[0] as final nodes
  const tags = [];
  // availableTags is a set that maps the tag name to the tag object {name: string, id: string}
  const availableTags = new Map();
  model.getTags().forEach((tag) => {
    availableTags.set(tag.name, tag);
  });
  const papers = model.getPapers().map((paper: PaperJSON) => {
    var paperCpy = { ...paper };
    paperCpy.tags.forEach((tag: string) => {
      const tagObj = availableTags.get(tag);
      let posTag = tags.map((tag) => tag.name).indexOf(tag);
      if (!tags.map((tag) => tag.id).includes(tagObj.id)) {
        tags.push({ ...tagObj, papers: [] });
        posTag = tags.length - 1;
      }
      tags[posTag].papers.push(paperCpy.id);
    });
    return paperCpy;
  });
  const result = buildJSONGraph(
    papers,
    tags,
    nodeGenerator,
    structure,
    includeOthers
  );
  // const dot = makeDot(result.graph,result.papersNodes,shape)
  // Write the dot file
  // fs.writeFileSync("graph.dot", dot);
  // console.log("Graph generated "+JSON.stringify(result.graph));
  if (send) res.status(200).send(result);
  return result;
};

export const nodeToDot = (node) =>
  `"${node.id}" [label="${node.label}" id="${node.id}"]`;
export const firstNodeToDot = (node) =>
  `"${node.id}" [label="" id="${node.id}" shape="circle"]`;
export const edgeToDot = (edge) =>
  `"${edge.from}":w -> "${edge.to}" [dir="forward" tailport="e" headport="w" id="${edge.id}"]`;
export function makeDot(
  graph,
  papersNodes,
  shape = "record",
  splineType = "polyline",
  style = ""
) {
  const dotGraph = `
    digraph G {
      rankdir=LR;
      bgcolor=transparent;
      graph [splines=${splineType ? splineType : "polyline"}] 
      node [shape=${shape}, style="${style ? style : ""},filled"]
      ${graph.nodes
        .map((e, i) => {
          return i === 0 ? firstNodeToDot(e) : nodeToDot(e);
        })
        .join("\n")}
      ${graph.edges.map(edgeToDot).join("\n")}
      {rank=same; ${papersNodes.map((x) => '"' + x.id + '"').join(" ")};}
    }
    `;
  // console.log(dotGraph);
  return dotGraph;
}
export const getGraph = async (req, res) => {
  const r = await getGraphFn(req.body);
  res.status(200).send(r);
};
type GraphOutput = {
  svg: string;
  graph: Graph;
  paperNode: Node;
  tagsNodes: Node[];
  papersNodes: Node[];
  tagsEdges: Edge[];
  papersEdges: Edge[];
};
export const getGraphFn = (args): Promise<GraphOutput> => {
  return new Promise((resolve, reject) => {
    const { shape = "record", splineType = "polyline", style = "" } = args;
    const { graph, paperNode, tagsNodes, papersNodes, tagsEdges, papersEdges } =
      getJSONGraph(args, undefined, false);
    const dotGraph = makeDot(graph, papersNodes, shape, splineType, style);

    // Render the graph with dot to svg
    const dotProcess = spawn("dot", ["-Tsvg"]);
    dotProcess.stdin.write(dotGraph);
    dotProcess.stdin.end();
    let svg = "";
    dotProcess.stdout.on("data", (data) => {
      svg += data;
    });
    return dotProcess.stdout.on("end", () => {
      svg = cleanSVGGenerated(svg);
      // Copy the dot to the clipboard
      // console.log("Copy to clipboard");
      // console.log(dotGraph);
      resolve({
        svg: svg,
        graph: graph,
        paperNode: paperNode,
        tagsNodes: tagsNodes,
        papersNodes: papersNodes,
        tagsEdges: tagsEdges,
        papersEdges: papersEdges,
      });
    });
  });
};
export const getGraphSVG = (req, res) => {
  const svg = getGraphSVGFFn(req.body);
  res.sendFile("graph.svg", { root: "." });
};
export const getGraphSVGFFn = (args) => {
  const { shape = "record", splineType = "polyline", style = "" } = args;
  const { graph, paperNode, tagsNodes, papersNodes, tagsEdges, papersEdges } =
    getJSONGraph(args, undefined, false);
  const dotGraph = makeDot(graph, papersNodes, shape, splineType, style);

  // Render the graph with dot to svg
  const dotProcess = spawn("dot", ["-Tsvg"]);
  dotProcess.stdin.write(dotGraph);
  dotProcess.stdin.end();
  let svg = "";
  dotProcess.stdout.on("data", (data) => {
    svg += data;
  });
  dotProcess.stdout.on("end", () => {
    svg = cleanSVGGenerated(svg);
    // Write the svg file
    fs.writeFileSync("graph.svg", svg);
    // Send the svg file name
    return "graph.svg";
  });
};
export const getGraphDOT = (req, res) => {
  const dot = getGraphDOTFn(req.body);
  res.sendFile("graph.dot", { root: "." });
};
export const getGraphDOTFn = (args) => {
  const { shape = "record", splineType = "polyline", style = "" } = args;
  const { graph, paperNode, tagsNodes, papersNodes, tagsEdges, papersEdges } =
    getJSONGraph(args, undefined, false);
  const dotGraph = makeDot(graph, papersNodes, shape, splineType, style);
  // Write the dot file
  fs.writeFileSync("graph.dot", dotGraph);
  // Return the dot file name
  return "graph.dot";
};
const readFileToSocket = (socket, filePath, fileEvent) => {
  socket.on(fileEvent, () => {
    const fileBuffer = fs.readFileSync(filePath);

    socket.emit("file"+fileEvent, { data: fileBuffer, isBinary: true });
  });
};

export const emitGraphData = (socket, args = {}) => {
  const { graph, paperNode, tagsNodes, papersNodes, tagsEdges, papersEdges } =
    getJSONGraph(args, undefined, false);
  socket.emit("graph", {
    graph: graph,
    paperNode: paperNode,
    tagsNodes: tagsNodes,
    papersNodes: papersNodes,
    tagsEdges: tagsEdges,
    papersEdges: papersEdges,
  });
  // emit graph svg and dot also
  const svg = getGraphSVGFFn(args);
  const dot = getGraphDOTFn(args);
  readFileToSocket(socket, "graph.svg", "GetGraphSVG");
  readFileToSocket(socket, "graph.dot", "GetGraphDOT");
};
