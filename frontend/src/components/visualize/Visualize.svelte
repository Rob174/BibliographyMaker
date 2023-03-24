<script lang="ts">
  import { onMount } from "svelte";
  import CircularProgress from "@smui/circular-progress";
  import {
    updateSVG,
    requests,
    selectedNode,
    updateSvgActive,
    updateSVGClasses,
  } from "./svgUpdate";
  import { onDestroy } from "svelte";
  import MenuPanel from "./MenuPanel.svelte";
  import {
    clickedSnackStore,
    nodesMetadata,
    graphStore,
    papersStore,
    updatePaperMetadata,
    countDoneStore,
    updateCountDone
  } from "../../data";
  import { getPapers } from "../../api/get";
  import Snackbar, { Actions, Label } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";
  import SearchBar from "./SearchBar.svelte";
  // Make a fetch request to backend to get the papersVisu every 5 seconds
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
  async function update() {
    if (!active.status) return;
    status = "updating";
    try {
      const res = await requests();
      if (res === null) return;
      graphStore.update((value) => {
        return { ...res };
      });
      const r = await getPapers();
      if (r === null) return;
      papersStore.update((value) => {
        return [...r];
      });
      updatePaperMetadata();
      updateSVG($graphStore.papersNodes, $papersStore, $graphStore.tagsNodes);
      papersVisu = graphStore;
      graphHtml = $graphStore.svg;
      status = "idle";
    } catch (e) {
      status = "error";
      console.error(e);
    }
  }
  // console.log("refresh");
  let countSelected = 0;
  countDoneStore.subscribe((value) => (countSelected = value));
  nodesMetadata.subscribe((value) => {
    // console.log("update ", value);
    updateSVGClasses();
  });
  onMount(async () => {
    setTimeout(async () => {
      selectedNode.update((value) => {
        return { selectedNode: null, id: value.id };
      });
      await update();
      updateSvgActive.update(() => ({ status: true, id: null }));
      // console.log("update ");
      updateSVGClasses();
    }, 200);
  });
  onDestroy(() => {
    updateSvgActive.update(() => ({ status: false, id: null }));
  });

</script>

<div class="container-visu">
  <div class="graph">
    {#if graphHtml}
      {@html graphHtml}
    {/if}
  </div>
</div>
<SearchBar />
<MenuPanel />
<div class="counter">{countSelected}/{$papersStore.length}</div>
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
  .counter {
    position: absolute;
    top: 1em;
    left: 1em;
    padding: 0.5em;
    background: rgba(255, 255, 255, 0.337);
    border-radius: 0.5em;
    color: white;
    font-size: 2em;
  }
  /* Make it so the graph takes all the remaining space of the container */
  .container-visu {
    display: flex;
    flex-direction: column;
    height: 94vh;
    width: 99.5vw;
    margin: 0;
    overflow: hidden;
  }
  .graph {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 4px solid var(--color-graph);
  }
  :global(
      .graph svg .neutral :is(line, circle, path, rect, polyline, ellipse)
    ) {
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
  :global(.node.done > :is(polygon, ellipse, polyline, path)) {
    stroke: var(--accent3);
  }
  :global(.node.done > :is(text)) {
    fill: var(--accent3);
  }
</style>
