import {
  Tag,
  Node,
  GeneratedEdges,
  Edge,
  TagStructure,
  TagStructureElement,
  ID,
  PaperJSON,
  GeneratedNodesEdges,
  NodeTxtGenerator,
} from "../../types";
import { deterministicUuid, formatTrim } from "../utils";
import { makeEdge, makeNode } from "./utils";
export const generateEdgesSimple = (
  rootNode: Node,
  tags: Tag[]
): GeneratedEdges => {
  const papersEdges: Edge[] = [];
  let mapPapers = new Map();
  tags.forEach((tag) => {
    tag.papers.forEach((paperId) => {
      papersEdges.push(makeEdge(tag.id, paperId));
      if (mapPapers.has(tag.name)) {
        mapPapers.set(tag.name, mapPapers.get(tag.name).concat(paperId));
      } else {
        mapPapers.set(tag.name, [paperId]);
      }
    });
  });
  const tagsEdges = tags.map((tag) => {
    return makeEdge(rootNode.id, tag.id);
  });
  let edges = tagsEdges.concat(papersEdges);
  return { edges, tagsEdges, papersEdges, mapPapers };
};
export const generateNodesEdgesHierarchical = (
  rootNode: Node,
  tags: Tag[],
  papers: PaperJSON[],
  structure: TagStructure,
  nodeGenerator: NodeTxtGenerator,
  includeOthers: boolean = false
): GeneratedNodesEdges => {
  /**
   * Reminder: structure is of the form:
   * [
   * {
   *  tag: "tag1",
   * children: [
   * {
   * tag: "tag1.1",
   * children: []
   * },
   * {
   * tag: "tag1.2",
   * children: []
   * }
   * ]
   */
  // DFS to generate edges, Map to store the tag conjonctions (stringified list of names) and after add as value the papers
  const tagsEdges: Edge[] = [];
  const papersEdges: Edge[] = [];
  let tagsNodes: Node[] = [];
  let papersNodes: Node[] = [];
  const mapPapers = new Map();
  const detUuid = deterministicUuid();
  const dfs = (
    nodes: TagStructureElement[],
    parentID: ID,
    tags_conjonction: string[],
    papersRemaining: PaperJSON[]
  ) => {
    let seen_papers = new Set();
    nodes.forEach((node) => {
      // Add tag
      const tag = tags.find((tag) => tag.name === node.tag);
      if (tag) {
        tagsEdges.push(makeEdge(parentID, tag.id));
        // Add papers
        const papers = papersRemaining.filter((paper) => {
          return paper.tags.includes(node.tag);
        });
        tagsNodes.push(makeNode(tag.id, nodeGenerator(tag.name), "tag"));
        papers.forEach((paper) => {
          seen_papers.add(paper.id);
        });
        // Add papers to map
        mapPapers.set(
          tags_conjonction.concat(node.tag).join(" "),
          papers.map((paper) => paper.id)
        );
        // If there are no children, add papers
        if (node.children.length === 0) {
          papers.forEach((paper) => {
            papersEdges.push(makeEdge(tag.id, paper.id));
          });
          papersNodes = papersNodes.concat(
            papers.map((paper) => (makeNode(paper.id, nodeGenerator(formatTrim(paper.bibtex.title[0])), "paper")))
          );
        }
        // Recurse
        dfs(node.children, tag.id, tags_conjonction.concat(node.tag), papers);
      }
    });
    if (!includeOthers) return;
    // Add papers that are not in any tag under the artificial tag "Others"
    const others = papersRemaining.filter((paper) => {
      return !seen_papers.has(paper.id);
    });
    if (others.length === 0 || nodes.length === 0) return;
    papersNodes = papersNodes.concat(
      others.map((paper) => (makeNode(paper.id, nodeGenerator(formatTrim(paper.bibtex.title[0])), "paper")))
    );
    // Add papers to map
    mapPapers.set(
      tags_conjonction.concat("Others").join(" "),
      others.map((paper) => paper.id)
    );
    const otherNode: Node = makeNode(detUuid(), nodeGenerator(`${others.length} papers`, "Others"), "tag");
    others.forEach((paper) => {
      papersEdges.push(makeEdge(otherNode.id, paper.id));
    });
    tagsNodes.push(otherNode);
    // Make edge to parent
    tagsEdges.push(makeEdge(parentID, otherNode.id));
  };

  dfs(structure, rootNode.id, [], papers);

  let edges = tagsEdges.concat(papersEdges);
  // nodes: rootNode, tags, papers
  let nodes = Array.from([rootNode]).concat(tagsNodes).concat(papersNodes);
  return {
    edges,
    nodes,
    rootNode,
    tagsEdges,
    papersEdges,
    mapPapers,
    papersNodes,
    tagsNodes,
  };
};
