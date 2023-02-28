import { spawn } from "child_process";
import { deterministicUuid, formatTrim } from "../utils";
import * as model from "../../model";
import { cleanSVGGenerated } from "./utils";
import { generateNodes } from "./generateNodes";
import {
  Graph,
  IDGenerator,
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

export const buildJSONGraph = (
  papers: PaperJSON[],
  tags: Tag[],
  uuidv4: IDGenerator,
  nodeGenerator: NodeTxtGenerator,
  structure?: TagStructure
) => {
  // Build the JSON
  let edges, tagsEdges, papersEdges, mapPapers,nodes,papersNodes, tagsNodes,rootNode;
  if (structure === undefined) {
    const res = generateNodes(
      papers,
      tags,
      uuidv4,
      nodeGenerator
    );
    nodes = res.nodes;
    papersNodes = res.papersNodes;
    tagsNodes = res.tagsNodes;
    rootNode = res.rootNode;
    // console.log("Simple structure");
    const result = generateEdgesSimple(rootNode, tags, uuidv4);
    edges = result.edges;
    tagsEdges = result.tagsEdges;
    papersEdges = result.papersEdges;
    mapPapers = result.mapPapers;
  } else {
    // console.log("Hierarchical structure");
    rootNode = {
      id: uuidv4(),
      label: " ",
    };
    const result = generateNodesEdgesHierarchical(
      rootNode,
      tags,
      papers,
      uuidv4,
      structure,
      nodeGenerator
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
  return getJSONGraph(req, res, true);
};
export const getJSONGraph = (req, res, send = true) => {
  const { shape = "record", structure } = req.body;
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
  const uuidv4 = deterministicUuid();
  // console.log("getGraph");
  // Build the JSON: Paper as main node, tags as subnodes and papers.bitex.title[0] as final nodes
  const tags = [];
  const papers = model.getPapers().map((paper) => {
    var paperCpy = { ...paper };
    paperCpy.id = uuidv4();
    paperCpy.tags.forEach((tag) => {
      let posTag = tags.map((tag) => tag.name).indexOf(tag);
      if (!tags.map((tag) => tag.name).includes(tag)) {
        tags.push({ name: tag, id: uuidv4(), papers: [] });
        posTag = tags.length - 1;
      }
      tags[posTag].papers.push(paperCpy.id);
    });
    return paperCpy;
  });
  const result = buildJSONGraph(papers, tags, uuidv4, nodeGenerator, structure);
  // const dot = makeDot(result.graph,result.papersNodes,shape)
  // Write the dot file
  // fs.writeFileSync("graph.dot", dot);
  if (send) res.status(200).send(result);
  return result;
};

export const nodeToDot = (node) =>
`"${node.id}" [label="${node.label}" id="${node.id}"]`;
export const edgeToDot = (edge) =>
`"${edge.from}":w -> "${edge.to}" [dir="forward" tailport="e" headport="w" id="${edge.id}"]`;
export function makeDot(graph,papersNodes, shape = "record", splineType = "polyline", style = ""){
  const dotGraph = `
    digraph G {
      rankdir=LR;
      bgcolor=transparent;
      graph [splines=${splineType ? splineType : "polyline"}] 
      node [shape=${shape}, style=${style ? style : "filled"}]
      ${graph.nodes.map(nodeToDot).join("\n")}
      ${graph.edges.map(edgeToDot).join("\n")}
      {rank=same; ${papersNodes.map(x=>'"'+x.id+'"').join(" ")};}
    }
    `;
  return dotGraph;
}
export const getGraph = (req, res) => {
  const {
    shape = "record",
    splineType = "polyline",
    style = ""
  } = req.body;
  const {
    graph,
    paperNode,
    tagsNodes,
    papersNodes,
    tagsEdges,
    papersEdges,
  } = getJSONGraph(req, res, false);
  const dotGraph = makeDot(graph, papersNodes,shape,splineType,style);
  
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
    res.status(200).send({
      svg: svg,
      graph: graph,
      paperNode: paperNode,
      tagsNodes: tagsNodes,
      papersNodes: papersNodes,
      tagsEdges: tagsEdges,
      papersEdges: papersEdges,
    });
  });
};
