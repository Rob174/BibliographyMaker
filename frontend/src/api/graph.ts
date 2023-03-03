import { API_URL } from "../data";
import type { TagStructure } from "../types";
import { getPapers } from "./get";
export const getGraph = async (structure?: TagStructure, showOthers: boolean = true) => {
  try {
    // Get tags with fetch request
    const papers = await getPapers();
    const args = {
      shape: "box",
      style: "rounded",
      splineType: "polyline",
      structure: structure,
      includeOthers: showOthers,
    };
    const resp = await fetch(`${API_URL}/graph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    const data = await resp.json();
    return {
      svg: data.svg,
      graph: data.svg,
      papers: papers,
      paperNode: data.paperNode,
      tagsNodes: data.tagsNodes,
      papersNodes: data.papersNodes,
      paperTagsEdges: data.paperTagsEdges,
      tagsPapersEdges: data.tagsPapersEdges,
    };
  } catch (error) {
    console.error("Error visualize:", error);
    return null;
  }
};
export const getGraphSVG = async (structure?: TagStructure): Promise<Blob> => {
  try {
    // Get tags with fetch request
    const args = {
      shape: "box",
      style: "rounded",
      splineType: "polyline",
      structure: structure,
    };
    const resp = await fetch(`${API_URL}/graph/svg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    const blob = await resp.blob();
    return blob;
  } catch (error) {
    console.error("Error visualize:", error);
    return null;
  }
};
export const getGraphDOT = async (structure?: TagStructure): Promise<Blob> => {
  try {
    // Get tags with fetch request
    const args = {
      shape: "box",
      style: "rounded",
      splineType: "polyline",
      structure: structure,
    };
    const resp = await fetch(`${API_URL}/graph/dot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    const blob = await resp.blob();
    return blob;
  } catch (error) {
    console.error("Error visualize:", error);
    return null;
  }
};
