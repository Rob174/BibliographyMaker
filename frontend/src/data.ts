import { derived, writable, type Readable, type Writable } from "svelte/store";
import type {
  Node,
  Edge,
  Graph,
  Paper,
  PaperWithDOIFields,
  PaperWithoutDOIFields,
  Tag,
  TagStructure,
  ID,
} from "./types";

export const PORT = 3000;
export const API_URL = `http://localhost:${PORT}`;
export const checkField = (fields: any) => {
  const regexTag = /^[a-zA-Z0-9_-]+$/;
  const { doi, relevant_text, tags } = fields;
  if (doi == "" || doi == null) {
    return { error: true, message: "DOI is required" };
  }
  // Check if tags are not empty
  const sentTags = tags.filter((tag) => tag != "");
  if (sentTags.length == 0) {
    return { error: true, message: "At least one non empty tag is required" };
  }
  // Check that each tag contains only letters, numbers and underscores or -
  for (let tag of sentTags) {
    if (!regexTag.test(tag)) {
      return {
        error: true,
        message:
          "Each tag must contain only letters, numbers and underscores or -",
      };
    }
  }
  return { error: false, message: "" };
};
type GraphData = {
  svg: string;
  graph: Graph;
  paperNode: Node;
  tagsNodes: Node[];
  papersNodes: Node[];
  paperTagsEdges: Edge[];
  tagsPapersEdges: Edge[];
};
export const graphStore: Writable<GraphData> = writable({
  svg: "",
  graph: { nodes: [], edges: [] },
  paperNode: { id: "", label: "", type: "paper" },
  tagsNodes: [],
  papersNodes: [],
  paperTagsEdges: [],
  tagsPapersEdges: [],
});
export const nodesMetadata: Writable<Map<ID, { id: ID; tags: string[] }>> =
  writable(new Map());
export const papersStore: Writable<Paper[]> = writable([]);
export const tagsStore: Writable<Tag[]> = writable([]);
export const clickedSnackStore: Writable<string> = writable("");
export function updatePaperMetadata() {
  graphStore.subscribe((graphStore) => {
    // For each paperNode if it is not yet in papersMetadata, add it with default tags todo and neutral
    nodesMetadata.update((papersMetadata) => {
      console.log("Updating papersMetadata");
      const nodes = graphStore.papersNodes.concat(graphStore.tagsNodes);
      nodes.forEach((paperNode) => {
        if (!papersMetadata.has(paperNode.id)) {
          papersMetadata.set(paperNode.id, {
            id: paperNode.id,
            tags: ["todo", "neutral"],
          });
        }
      });
      return papersMetadata;
    });
  });
}
export const structureStore: Writable<TagStructure | undefined> =
  writable(undefined);
  export const tabPossibilities = [
    "Add paper by doi",
    "Add paper manually",
    "Search DOI",
    "Visualize",
  ];
  export const activeTabStore: Writable<string> =
    writable("Add paper by doi");
export const othersShownStore: Writable<boolean> = writable(true);
export const defaultPaperWithDOIStore: () => PaperWithDOIFields = () => {
  return {
    doi: "",
    relevant_text: [""],
    tags: [""],
    analysis: "",
  };
};
export const paperWithDOIStore: Writable<PaperWithDOIFields> = writable(
  defaultPaperWithDOIStore()
);
export const defaultPaperWithoutDOIStore: () => PaperWithoutDOIFields = () => {
  return {
    title: "",
    authors: [""],
    year: "",
    url: "",
    relevant_text: [""],
    tags: [""],
    analysis: "",
  };
};
export const paperWithoutDOIStore: Writable<PaperWithoutDOIFields> = writable(
  defaultPaperWithoutDOIStore()
);
export const edit = (paper: any) => {
  if (!paper.bibtex.DOI && paper.bibtex.DOI !== "") {
    // Update the paperWithDOIStore
    paperWithDOIStore.update((paperWithDOIStore) => {
      
      paperWithDOIStore.doi = paper.bibtex.DOI;
      paperWithDOIStore.relevant_text = paper.relevant_text;
      paperWithDOIStore.tags = paper.tags;
      paperWithDOIStore.analysis = paper.analysis;
      paperWithDOIStore.id_in_db = paper.id;
      return paperWithDOIStore;
    });
    return "Add paper with DOI"
  } else {
    // Update the paperWithoutDOIStore
    paperWithoutDOIStore.update((paperWithoutDOIStore) => {
      paperWithoutDOIStore.title = paper.bibtex.title[0];
      paperWithoutDOIStore.authors = paper.bibtex.author.map((author) => {
        return author.family + " " + author.given;
      });
      paperWithoutDOIStore.year = paper.bibtex.created["date-parts"][0][0];
      paperWithoutDOIStore.url = paper.bibtex.URL;
      paperWithoutDOIStore.relevant_text = paper.relevant_text;
      paperWithoutDOIStore.tags = paper.tags;
      paperWithoutDOIStore.analysis = paper.analysis;
      paperWithoutDOIStore.id_in_db = paper.id;
      return paperWithoutDOIStore;
    });
    return "Add paper manually"
  }
}