import * as d3 from "d3";
import { writable } from "svelte/store";
export let selectedNode = writable({ selectedNode: null, id: 0 });
export let updateSvgActive = writable({ status: false, id: null });
import { getGraph } from "../../api/graph";
import { serverRunning } from "../../api/get";
import {
  othersShownStore,
  nodesMetadata,
  structureStore,
  tagsStore,
  clickedSnackStore,
} from "../../data";
import { tagsPoss } from "../../types";

class Transform {
  translateX: number;
  translateY: number;
  scale: number;
  constructor(matrix) {
    this.translateX = matrix.e;
    this.translateY = matrix.f;
    this.scale = matrix.a;
  }
  movePosition(x, y) {
    this.translateX += x;
    this.translateY += y;
    return this;
  }
  getString() {
    return `scale(${this.scale}) translate(${this.translateX}, ${this.translateY})`;
  }
}
export var zoom;
function updateSVGWindow() {
  const svg = document.querySelector(".graph svg");
  // Set the size of the svg
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  // Add drag and zoom with id graph0 for the main group containing everything
  var graph0 = d3.select("#graph0");
  var bbox = graph0.node().getBBox();
  // Set the initial zoom transform to center the #graph0 element
  var initialTransform = d3.zoomIdentity
    .translate(
      0,
      bbox.height
    )
    .scale(1);
  zoom = d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", function (event) {
      graph0.attr(
          "transform",
          " translate(" +
            event.transform.x +
            " " +
            event.transform.y +
            ")" +
            "scale(" +
            event.transform.k +
            ")"
        );
    })
  zoom
    .transform(d3.select(svg), initialTransform);
  let nodesMetadataMap;
  nodesMetadata.subscribe((value) => {
    nodesMetadataMap = value;
  });
  // Set all .node and .edge to class neutral
  if (nodesMetadataMap.size > 0) {
    d3.select(".graph svg")
      .selectAll(".node")
      .attr("class", function () {
        const id = d3.select(this).attr("id");
        if (!nodesMetadataMap.has(id)) return "node neutral";
        const paper = nodesMetadataMap.get(id);
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
function tagsClickCopy(tags) {
  tags.forEach((tag) => {
    const id = tag.id;
    const node = document.querySelector(`#${id}`);
    d3.select(node).style("cursor", "text");
    // Add click event listener to the node
    node.addEventListener("click", () => {
      console.log(node.textContent.split(" "));
      const text = node.textContent.split(" ").at(-1).trim().split("\n").at(-1);
      navigator.clipboard.writeText(text);
      clickedSnackStore.update((value) => {
        return "Tag name <code>" + text + "</code> copied into clipboard!";
      });
    });
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
    d3.select(node).style("cursor", "pointer");
    // Add click event listener to the node
    node.addEventListener("mouseover", () => {
      nodeHoverElem(node, true);
    });
    node.addEventListener("mouseout", () => {
      nodeHoverElem(node, false);
    });
  });
}
export function updateSVGClasses() {
  let nodesMetadataMap;
  nodesMetadata.subscribe((value) => {
    nodesMetadataMap = value;
  });
  d3.selectAll(".node")
    .nodes()
    .forEach((e) => {
      const element = d3.select(e);
      // Get the id of the paper
      const id = element.attr("id");
      // Get the paper metadata
      if (!nodesMetadataMap.has(id)) return;
      const tags = nodesMetadataMap.get(id).tags;
      // Add the tags to the node class
      const currClass = element
        .attr("class")
        .split(" ")
        .filter((value) => !tagsPoss.includes(value));
      const newAttrClass = [...currClass, ...tags].join(" ");
      element.attr("class", newAttrClass);
    });

  d3.select(".graph svg")
    .selectAll(".edge")
    .attr("class", () => {
      return "edge neutral";
    });
}
export function updateSVG(papers, papersData, tags) {
  let nodesMetadataMap;
  nodesMetadata.subscribe((value) => {
    nodesMetadataMap = value;
  });
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
    // console.log("svg not ready");
    setTimeout(() => {
      updateSVG(papers, papersData, tags);
    }, 100);
    return;
  }
  // console.log("updateSVG");
  updateSVGWindow();
  tagsClickCopy(tags);
  nodeClick(papers, papersData);
  nodeHover(papers, tags);
  // Make the pointer be a hand when hovering over the svg
  d3.select("svg").style("cursor", "grab");
  updateSVGClasses();
  // console.log("updateSVG done");
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
  return await getGraph(structure, showOthers);
}
