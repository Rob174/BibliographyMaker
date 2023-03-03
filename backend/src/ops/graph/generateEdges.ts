import {
  IDGenerator,
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
import { formatTrim } from "../utils";
import { nodeToDot, edgeToDot } from "./graph";
export const generateEdgesSimple = (
  rootNode: Node,
  tags: Tag[],
  uuidv4: IDGenerator
): GeneratedEdges => {
  const papersEdges: Edge[] = [];
  let mapPapers = new Map();
  tags.forEach((tag) => {
    tag.papers.forEach((paperId) => {
      papersEdges.push({
        id: uuidv4(),
        from: tag.id,
        to: paperId,
      } as Edge);
      if (mapPapers.has(tag.name)) {
        mapPapers.set(tag.name, mapPapers.get(tag.name).concat(paperId));
      } else {
        mapPapers.set(tag.name, [paperId]);
      }
    });
  });
  const tagsEdges = tags.map((tag) => {
    const v = {
      id: uuidv4(),
      from: rootNode.id,
      to: tag.id,
    } as Edge;
    return v;
  });
  let edges = tagsEdges.concat(papersEdges);
  return { edges, tagsEdges, papersEdges, mapPapers };
};
export const generateNodesEdgesHierarchical = (
  rootNode: Node,
  tags: Tag[],
  papers: PaperJSON[],
  uuidv4: IDGenerator,
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
        tagsEdges.push({
          id: uuidv4(),
          from: parentID,
          to: tag.id,
        } as Edge);
        // Add papers
        const papers = papersRemaining.filter((paper) => {
          return paper.tags.includes(node.tag);
        });
        tagsNodes.push({label: nodeGenerator(`${tag.papers.length} papers`, tag.name), id: tag.id, type: "tag"});
        papers.forEach((paper) => {
          seen_papers.add(paper.id);
        });
        // Add papers to map
        mapPapers.set(tags_conjonction.concat(node.tag).join(" "), papers.map((paper) => paper.id));
        // If there are no children, add papers
        if (node.children.length === 0) {
          papers.forEach((paper) => {
            papersEdges.push({
              id: uuidv4(),
              from: tag.id,
              to: paper.id,
            } as Edge);
          });
          papersNodes = papersNodes.concat(papers.map((paper) => ({id:paper.id, label: nodeGenerator(formatTrim(paper.bibtex.title[0])), type: "paper"})));
        }
        // Recurse
        dfs(node.children, tag.id, tags_conjonction.concat(node.tag), papers);
      }
    });
    if(!includeOthers) return;
    // Add papers that are not in any tag under the artificial tag "Others"
    const others = papersRemaining.filter((paper) => {
      return !seen_papers.has(paper.id);
    });
    if(others.length === 0 || nodes.length === 0) return;
    papersNodes = papersNodes.concat(others.map((paper) => ({id:paper.id, label: nodeGenerator(formatTrim(paper.bibtex.title[0])), type: "paper"})));
    // Add papers to map
    mapPapers.set(tags_conjonction.concat("Others").join(" "), others.map((paper) => paper.id));
    const otherNode: Node = {label: nodeGenerator(`${others.length} papers`, "Others"), id: uuidv4(), type: "tag"};
    others.forEach((paper) => {
      papersEdges.push({
        id: uuidv4(),
        from: otherNode.id,
        to: paper.id,
      } as Edge);
    });
    tagsNodes.push(otherNode);
    // Make edge to parent
    tagsEdges.push({
      id: uuidv4(),
      from: parentID,
      to: otherNode.id,
    } as Edge);
  };

  dfs(structure, rootNode.id, [], papers);

  let edges = tagsEdges.concat(papersEdges);
  // nodes: rootNode, tags, papers
  let nodes = Array.from([rootNode]).concat(tagsNodes).concat(papersNodes);
  return { edges, nodes, rootNode, tagsEdges, papersEdges, mapPapers, papersNodes, tagsNodes};
};
