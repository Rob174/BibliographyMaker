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
  papers: (PaperJSON & {citationId})[],
  structure: TagStructure,
  nodeGenerator: NodeTxtGenerator,
  includeOthers: boolean = false
): GeneratedNodesEdges => {
  console.log("generateNodesEdgesHierarchical");
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
  const process_tag = (tagOrig, tags_conjonction, node, papersRemaining, parentID, seen_papers) => {
    const tag = tagOrig;
    tag.origId = tag.id;
    tag.conjonction = tags_conjonction.concat(node.tag);
    tag.id = detUuid();
    // Add papers
    const papers = papersRemaining.filter((paper) => {
      return paper.tags.includes(node.tag);
    });
    // If no papers, don't add tag
    if (papers.length === 0) {return;}
    tagsEdges.push(makeEdge(parentID, tag.id));
    tagsNodes.push(
      makeNode(
        tag.id,
        nodeGenerator(`${papers.length} papers`, tag.name),
        "tag"
      )
    );
    papers.forEach((paper) => {
      seen_papers.add(paper.id);
    });
    // Add papers to map
    mapPapers.set(
      tags_conjonction.concat(node.tag).join(" "),
      papers.map((paper) => paper.id)
    );
    // If there are no children, add papers
    if (!node.children || node.children.length === 0) {
      papers.forEach((paper) => {
        papersEdges.push(makeEdge(tag.id, paper.id));
      });
      papersNodes = papersNodes.concat(
        papers.map((paper) =>
          makeNode(
            paper.id,
            nodeGenerator(formatTrim(paper.bibtex.title[0]), paper.citationId),
            "paper"
          )
        )
      );
    } else {
      dfs(node.children, tag.id, tags_conjonction.concat(node.tag), papers);
    }
  };
  const dfs = (
    nodes: TagStructureElement[],
    parentID: ID,
    tags_conjonction: string[],
    papersRemaining: PaperJSON[]
  ) => {
    let seen_papers = new Set();
    nodes.forEach((node) => {
      // Add tag object
      const tagOrig = tags.find((tag) => tag.name === node.tag);
      if (tagOrig) {
        let usedPapersRemaining = papersRemaining;
        if(node.tag === 'others') {
          usedPapersRemaining = papersRemaining.filter((paper) => {
            return !seen_papers.has(paper.id);
          });
        }
        process_tag(tagOrig, tags_conjonction, node, usedPapersRemaining, parentID, seen_papers);
      }
    });
  };
  // Add the default tag "others" in the list of tags
  if (includeOthers) {
    tags.push({
      id: detUuid(),
      name: "others",
      papers: papers.map((paper) => paper.id),
    });
  }
  // By default add the others tag to all papers
  for(let i = 0; i < papers.length; i++) {
    try {
      papers[i].tags.push("others");
    } catch(e) {
      console.error(e);
      console.log(papers[i]);
      papers[i].tags = ["others"];
    }
  }
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
