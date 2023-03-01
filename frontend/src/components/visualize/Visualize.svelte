<script lang="ts">
  import { onMount } from "svelte";
  import DialogDetail from "./DialogDetail.svelte";
  import CircularProgress from "@smui/circular-progress";
  import {
    updateSVG,
    requests,
    selectedNode,
    updateSvgActive,
  } from "./svgUpdate";
  import * as d3 from "d3";
  import { onDestroy } from "svelte";
  import { papersMetadata, tagsPoss } from "./papersData";
  import type { PaperTag } from "./papersData";
  // Make a fetch request to backend to get the papersVisu every 5 seconds
  let interval = 5000;
  let graphHtml;
  let selNode;
  selectedNode.subscribe((value) => (selNode = value));
  let papersVisu;
  type UpdateStatus = "updating" | "idle" | "error";
  let status: UpdateStatus = "idle";
  updateSvgActive.update((value) => ({ status: true, id: value.id }));
  let active = { status: true, id: 0 };
  updateSvgActive.subscribe((value) => (active = value));
  let errorMsg = "";
  let metadata;
  papersMetadata.subscribe(async (value) => {
    metadata = value;
    // Update the node class
    d3.selectAll(".node")
      .nodes()
      .forEach((e) => {
        const element = d3.select(e);
        // Get the id of the paper
        const id = element.attr("id");
        // Get the paper metadata
        if (!metadata.has(id)) return;
        const tags = metadata.get(id).tags;
        // Add the tags to the node class
        const currClass = element
          .attr("class")
          .split(" ")
          .filter((value) => !tagsPoss.includes(value));
        const newAttrClass = [...currClass, ...tags].join(" ");
        element.attr("class", newAttrClass);
      });
  });
  async function update() {
    if (!active.status) return;
    status = "updating";
    try {
      const res = await requests();
      const {
        svg,
        graph,
        papers,
        paperNode,
        tagsNodes,
        papersNodes,
        paperTagsEdges,
        tagsPapersEdges,
      } = res;
      if (metadata.size === 0) {
        papersMetadata.update((value) => {
          return new Map(
            papersNodes.map((paper) => [
              paper.id,
              { id: paper.id, tags: ["todo"] },
            ])
          );
        });
      }

      papersVisu = papers;
      graphHtml = svg;
      updateSVG(papersNodes, papers, tagsNodes);
      status = "idle";
    } catch (e) {
      status = "error";
      console.error(e);
    }
  }
  onMount(async () => {
    selectedNode.update((value) => {
      return { selectedNode: null, id: value.id };
    });
    await update();
    // Set the timer id
    const id = setInterval(update, interval);
    updateSvgActive.update((value) => ({ status: true, id: id }));
  });
  onDestroy(() => {
    // Clear the timer
    clearInterval(active.id);
    updateSvgActive.update((value) => ({ status: false, id: null }));
  });
</script>

<div class="container-visu">
  <div class="graph">
    {#if graphHtml}
      {@html graphHtml}
    {/if}
  </div>
</div>
{#if selNode.selectedNode}
  {#key selNode.id}
    <DialogDetail
      element={selNode.selectedNode}
      on:close={() =>
        selectedNode.update((value) => {
          return { selectedNode: null, id: value.id };
        })}
      open={true}
    />
  {/key}
{/if}
{#if status !== "idle"}
  <div
    style="display: flex; justify-content: center; position: absolute; top: 4em; right: 0em; transform: translate(-100%,0%);"
  >
    {#if status === "updating"}
      <CircularProgress style="height: 50px; width: 50px;" indeterminate />
    {:else if status === "error"}
      <!-- Add a tooltip to show the error message -->
      <span class="material-symbols-outlined" title={errorMsg}>error</span>
    {/if}
  </div>
{/if}

<style>
  /* Make it so the graph takes all the remaining space of the container */
  .container-visu {
    display: flex;
    flex-direction: column;
    height: 94vh;
    width: 99.5vw;
    margin: 0;
  }
  .graph {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 4px solid var(--color-graph);
  }
  :global(.graph svg .neutral :is(line, circle, path, rect, polyline, ellipse)) {
    stroke: var(--color-graph);
    stroke-width: 1px;
    fill: transparent;
  }
  :global(.node polygon, ellipse) {
    stroke: var(--color-graph);
    fill: black;
  }
  :global(.graph svg text) {
    fill: var(--color-graph);
  }
  :global(svg .edge polygon, ellipse) {
    fill: var(--color-graph);
    stroke-width: 1px;
  }
  :root {
    --color-graph: hsl(0, 0%, 55%);
    --accent3: #0087ff;
  }
  .material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
    font-size: 3em;
    color: var(--accent2);
  }
  :global(.hover > :is(polygon, polyline, path, ellipse)) {
    stroke: var(--accent2);
    stroke-width: 5px;
    fill: transparent;
  }
  :global(.edge.hover > :is(polygon, ellipse)) {
    stroke: var(--accent2);
    fill: var(--accent2);
  }
  :global(.edge.neutral > :is(polygon, ellipse)) {
    stroke: var(--color-graph);
    stroke-width: 1px;
  }
  :global(.node.hover > text) {
    fill: var(--accent2);
  }

  :global(.node.neutral > text) {
    fill: var(--color-graph);
  }
  :global(.node.done.neutral > :is(polygon, ellipse, polyline, path)) {
    stroke: var(--accent3);
  }
  :global(.node.done.neutral > :is(text)) {
    fill: var(--accent3);
  }
</style>
