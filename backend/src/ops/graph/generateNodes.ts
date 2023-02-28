import { GeneratedNodes, IDGenerator, NodeTxtGenerator, PaperJSON, Tag, Node, TagStructure } from "../../types";
import { formatTrim } from "../utils";

export const generateNodes = (papers: PaperJSON[], tags: Tag[], uuidv4: IDGenerator, nodeGenerator: NodeTxtGenerator): GeneratedNodes => {
  let nodes = [];
  // Add main node
  nodes.push({
    id: uuidv4(),
    label: " ",
  });
  // Add papers
  const papersNodes = papers.map((paper) => {
    const v = {
      id: paper.id,
      label: nodeGenerator(formatTrim(paper.bibtex.title[0])),
      type: "paper",
    } as Node;
    return v;
  });
  nodes = nodes.concat(papersNodes);
  // Add tags
  const tagsNodes = tags.map((tag) => {
    return {
      id: tag.id,
      label: nodeGenerator(`${tag.papers.length} papers`, tag.name),
      type: "tag"
    } as Node;
  });
  nodes = nodes.concat(tagsNodes);
  return {nodes:nodes, rootNode: nodes[0], papersNodes:papersNodes, tagsNodes:tagsNodes};
};