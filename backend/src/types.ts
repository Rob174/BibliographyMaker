export type Author = {
  given: string;
  family: string;
};
export type DOI = string;
export type URL = string;
export type Bibtex = {
  DOI: DOI;
  title: string[];
  author: Author[];
  URL: URL;
  issued: {
    "date-parts": number[][];
  };
  published: {
    "date-parts": number[][];
  };
  "published-print": {
    "date-parts": number[][];
  };
};
export type PaperJSON = {
  id: string;
  bibtex: Bibtex;
  doi: DOI;
  relevant_text: string[];
  tags: string[];
  analysis: string[];
};

export type PaperWithDOI = {
  doi: DOI;
  relevant_text: string[];
  tags: string[];
  analysis: string[];
};

export type PaperWithoutDOI = {
  relevant_text: string[];
  tags: string[];
  analysis: string[];
  title: string;
  authors: Author[];
  URL: URL;
  issued: {
    "date-parts": number[][];
  };
};
export type TagJSON = {
  id: string;
  name: string;
};
export type Tag = TagJSON & {
  papers: string[];
};
export type ID = string;
export type IDGenerator = () => ID;
export type NodeTxtGenerator = (txt1: string, txt2?: string) => string;
export type Node = {
  id: ID;
  label: string;
  type: "paper" | "tag" | "root";
};
export type Edge = {
    id: ID;
  from: ID;
  to: ID;
};
export type Graph = {
  nodes: Node[];
  edges: Edge[];
};
export type GeneratedEdges = {
  edges: Edge[];
  tagsEdges: Edge[];
  papersEdges: Edge[];
  mapPapers: Map<string, string[]>;
};
export type GeneratedNodesEdges = {
  nodes: Node[];
  edges: Edge[];
  rootNode: Node;
  papersNodes: Node[];
  tagsNodes: Node[];
  tagsEdges: Edge[];
  papersEdges: Edge[];
  mapPapers: Map<string, string[]>;
};
export type GeneratedNodes = {
  nodes: Node[];
  rootNode: Node;
  papersNodes: Node[];
  tagsNodes: Node[];
};
export type TagStructureElement = {
  tag: string;
  children: TagStructureElement[];
};
/**
 * Tag structure is a tree of tags where each parallel branch will be a choice (OR) of tags and each child will be a requirement (AND) of tags.
 */
export type TagStructure = TagStructureElement[];
