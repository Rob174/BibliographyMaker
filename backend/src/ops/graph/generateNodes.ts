import { GeneratedNodes, NodeTxtGenerator, PaperJSON, Tag, Node } from "../../types";
import { formatTrim } from "../utils";
import { makeNode } from "./utils";

export const generateNodes = (rootNode: Node,papers: PaperJSON[], tags: Tag[], nodeGenerator: NodeTxtGenerator): GeneratedNodes => {
  let nodes = [];
  // Add main node
  nodes.push(rootNode);
  // Add papers
  const papersNodes = papers.map((paper) => {
    return makeNode(paper.id, nodeGenerator(formatTrim(paper.bibtex.title[0])), "paper");
  });
  nodes = nodes.concat(papersNodes);
  // Add tags
  const tagsNodes = tags.map((tag) => {
    return makeNode(tag.id, nodeGenerator(`${tag.papers.length} papers`, tag.name), "tag");
  });
  nodes = nodes.concat(tagsNodes);
  return {nodes:nodes, rootNode: nodes[0], papersNodes:papersNodes, tagsNodes:tagsNodes};
};