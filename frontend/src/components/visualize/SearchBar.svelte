<script lang="ts">
  import * as d3 from "d3";
  import { papersStore } from "../../data";
  import AutocompleteSearch from "./AutocompleteSearch.svelte";
  import { zoom } from "./svgUpdate";
  let possibleValues = [];
  let papers = [];
  papersStore.subscribe((value) => {
    // possibleValues is either the citation or the title
    possibleValues = [];
    value.forEach((paper) => {
      possibleValues.push(paper.citation);
      possibleValues.push(paper.bibtex.title[0]);
    });
    papers = value;
  });
  let visible = false;
  document.addEventListener("keydown", (event) => {
    // Listen for key press Ctrl + F
    if (event.ctrlKey && event.key === "f") {
      visible = !visible;
      setTimeout(() => {
        const input = document.querySelector("#search-bar input");
        if (input instanceof HTMLInputElement) {
          input.focus();
        }
      }, 100);
      event.preventDefault();
    }
  });
</script>

{#if visible}
  <div id="search-bar">
    <AutocompleteSearch
      {possibleValues}
      on:enter={(event) => {
        const value = event.detail.content;
        console.log("Enter pressed on ", value);
        // Search for the paper with the citation or title
        // Search for the paper with the citation
        let paper = papers.find((paper) => {
          return paper.citation === value;
        });
        if (!paper) {
          // Search for the paper with the title
          paper = papers.find((paper) => {
            return paper.bibtex.title[0] === value;
          });
        }
        console.log("Paper ", paper, event.detail.index);
        // Get id
        const id = paper.id;
        // Get the translate under transform of the text element under the id
        const text = document.getElementById(id).querySelector("text");
        console.log(text);
        const x = parseFloat(text.getAttribute("x"));
        const y = parseFloat(text.getAttribute("y"));

        // Translate the svg to the center of the paper
        const svg = document.querySelector(".graph svg");
        const graph = document.querySelector("#graph0");
        // Get viewbox of svg
        const svgWidth = parseFloat(svg.getAttribute("viewBox").split(" ")[2]);
        const svgHeight = parseFloat(svg.getAttribute("viewBox").split(" ")[3]);
        console.log("Paper ", id, " is at ", x, ", ", y);
        let scale;
        let scaleMatch = graph
          .getAttribute("transform")
          .match(/scale\((\d+\.?\d*)\)/);
        if (scaleMatch) {
          scale = parseFloat(scaleMatch[1]);
        }
        // Try to match scale(1 1)
        scaleMatch = graph
          .getAttribute("transform")
          .match(/scale\((\d+\.?\d*) (\d+\.?\d*)\)/);
        if (scaleMatch) {
          scale = parseFloat(scaleMatch[1]);
        }
        // Try to match matrix(1, 0, 0, 1, 4, 8106) get first number
        scaleMatch = graph
          .getAttribute("transform")
          .match(/matrix\((\d+\.?\d*),/);
        if (scaleMatch) {
          scale = parseFloat(scaleMatch[1]);
        }
        if (!scale) {
          scale = 1;
        }
        // Get container-visu size in svg coords
        const container = document.querySelector(".container-visu");
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        // Apply the matrix to the coords
        let matrix;
        if (graph instanceof SVGGraphicsElement) matrix = graph.getCTM();
        else return;
        const width = containerWidth / matrix.a;
        const height = containerHeight / matrix.d;
        // Recap of the grid coords
        //....... -->
        //.
        //.
        //.
        //|
        //v
        // A base translate of viewbow height is needed to move the svg into the viewbox
        // To center it in x +width/2 is needed and in y -height/2 is needed
        // Get size of the group by getting the size of the viewbox of the svg
        const gWidth = svgWidth * scale;
        const gHeight = svgHeight * scale;
        // const newX = -x * scale + (svgWidth-width) / 2;
        // const newY = -y * scale + (svgHeight-height) / 2;
        // Center svg
        console.log("svgWidth: ", svgWidth, " svgHeight: ", svgHeight);
        console.log("gWidth: ", gWidth, " gHeight: ", gHeight);
        // initialTranslateX and initialTranslateY are the initial translate of the svg top left corner of the #graph0
        // Move 0,0 to the center of the svg
        let newX = width / 2 - x;
        let newY = -y + height / 2;
        console.log("x: ", x, " y: ", y);
        console.log("newX: ", newX, " newY: ", newY);
        // Set #graph0 transform to translate(newX, newY) and scale(scale)
        var initialTransform = d3.zoomIdentity
          .scale(scale)
          .translate(newX, newY);
        zoom.transform(d3.select(svg), initialTransform);
        // Temporary change the color of the paper g texts to red
        const texts = document.querySelectorAll(`#${id} text`);
        texts.forEach((text) => {
          if (text instanceof SVGTextElement) text.style.fill = "white";
        });
        const path = document.querySelector(`#${id} path`);
        if (path instanceof SVGPathElement) path.style.fill = "red";
        console.log(texts);
        setTimeout(() => {
          texts.forEach((text) => {
            if (text instanceof SVGTextElement) text.style.fill = "";
          });
          if (path instanceof SVGPathElement) path.style.fill = "";
        }, 1000);
      }}
    />
  </div>
{/if}

<style>
  div {
    height: fit-content;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(47, 47, 47);
    z-index: 1005;
  }
</style>
