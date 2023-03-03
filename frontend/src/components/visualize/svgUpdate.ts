import * as d3 from "d3";
import { writable } from "svelte/store";
export let selectedNode = writable({ selectedNode: null, id: 0 });
export let updateSvgActive = writable({ status: false, id: null });
import { papersMetadata, type ID } from "./papersData";
import { getGraph } from "../../api/graph";
import { serverRunning } from "../../api/get";
import { othersShownStore, structureStore } from "../../data";
var metadata;

function updateSVGWindow() {
  papersMetadata.subscribe((value) => {
    metadata = value;
  });
  const svg = document.querySelector(".graph svg");
  // Set the size of the svg
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  // Add drag and zoom with id graph0 for the main group containing everything
  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", function (event) {
      svg
        .querySelector("#graph0")
        .setAttribute("transform", event.transform.toString());
    });
  // Set all .node and .edge to class neutral
  if (metadata.size > 0) {
    papersMetadata.update((value) => {
      Array.from(value.keys()).forEach((key) => {
        value.set(key, {
          id: value.get(key).id,
          tags: [
            ...value
              .get(key)
              .tags.filter(
                (tag) => !Array.from(["neutral", "hover"]).includes(tag)
              ),
            "neutral",
          ],
        });
      });
      metadata = value;
      return value;
    });
    d3.select(".graph svg")
      .selectAll(".node")
      .attr("class", function () {
        const id = d3.select(this).attr("id");
        if (!metadata.has(id)) return "node neutral";
        const paper = metadata.get(id);
        return `node ${paper.tags.join(" ")}`;
      });
  }
  d3.select(".graph svg")
    .selectAll(".edge")
    .attr("class", () => {
      return "edge neutral";
    });

  d3.select(svg).call(zoom);
}
function nodeClick(papers, papersData) {
  papers.forEach((paper) => {
    const id = paper.id;
    const node = document.querySelector(`#${id}`);
    // Find data for paper using doi
    const paperData = papersData.find((p) => p.id === paper.id);
    // Add click event listener to the node
    node.addEventListener("click", () => {
      selectedNode.update((selectedNodeObj) => {
        paperData.id = id;
        return { selectedNode: paperData, id: selectedNodeObj.id + 1 };
      });
    });
    // @ts-ignore
    node.style.cursor = "pointer";
  });
}
function nodeHoverElem(node, enters) {
  const possibleClasses = ["hover", "neutral"];
  let className = "neutral";
  if (enters) {
    className = "hover";
  }
  const nodeTitle = node.querySelector("title").textContent;

  d3.select(".graph svg")
    .selectAll(`.edge title`)
    .nodes()
    .forEach((t) => {
      const txt = t.textContent.split("->").map((t) => {
        if (t.slice(-2) === ":w" || t.slice(-2) === ":e") {
          return t.slice(0, -2);
        }
      });
      if (txt.includes(nodeTitle)) {
        const edge = d3.select(t).select(function () {
          return this.parentNode;
        });
        const classes = edge
          .attr("class")
          .split(" ")
          .filter((c) => !possibleClasses.includes(c));
        // Add class to the edge
        classes.push(className);
        edge.attr("class", classes.join(" "));
        txt.forEach((t) => {
          const n = d3.select(`#${t}`);
          const classes = n
            .attr("class")
            .split(" ")
            .filter((c) => !possibleClasses.includes(c));
          // Add class to the node
          classes.push(className);
          n.attr("class", classes.join(" "));
        });
        // put the edge on top of the other edges
        d3.select(t)
          .select(function () {
            return this.parentNode;
          })
          .raise();
      }
    });
}
function nodeHover(papers, tags) {
  papers.forEach((paper) => {
    const id = paper.id;
    const node = document.querySelector(`#${id}`);
    // Add click event listener to the node
    node.addEventListener("mouseover", () => {
      nodeHoverElem(node, true);
    });
    node.addEventListener("mouseout", () => {
      nodeHoverElem(node, false);
    });
  });
  tags.forEach((tag) => {
    const id = tag.id;
    const node = document.querySelector(`#${id}`);
    // Add click event listener to the node
    node.addEventListener("mouseover", () => {
      nodeHoverElem(node, true);
    });
    node.addEventListener("mouseout", () => {
      nodeHoverElem(node, false);
    });
  });
}

export function updateSVG(papers, papersData, tags) {
  let updateAutorized = { status: false, id: null };
  updateSvgActive.subscribe((value) => {
    updateAutorized = value;
  });
  if (!updateAutorized.status) {
    return;
  }
  const svg = document.querySelector(".graph svg");
  // Check if svg exists, if not wait for it to exist
  if (!svg || !papers) {
    setTimeout(() => {
      updateSVG(papers, papersData, tags);
    }, 100);
    return;
  }
  updateSVGWindow();
  nodeClick(papers, papersData);
  nodeHover(papers, tags);
  // Make the pointer be a hand when hovering over the svg
  d3.select("svg").style("cursor", "grab");
}
export async function requests() {
  let updateAutorized = { status: false, id: null };
  updateSvgActive.subscribe((value) => {
    updateAutorized = value;
  });
  if (!updateAutorized.status) {
    return;
  }
  // Check that server is running with small timeout
  const serverStatus = await serverRunning();
  if (!serverStatus) {
    return;
  }
  let structure = undefined;
  structureStore.subscribe((value) => {
    structure = value;
  });
  let showOthers = false;
  othersShownStore.subscribe((value) => {
    showOthers = value;
  });
  return await getGraph(structure,showOthers);
}
