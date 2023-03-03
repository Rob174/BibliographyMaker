<script lang="ts">
  import IconButtonText from "../form_elems/IconButtonText.svelte";
  import { fade } from "svelte/transition";
  import { getGraphSVG, getGraphDOT } from "../../api/graph";
  import { structureStore } from "../../data";
  import OtherButton from "./OtherButton.svelte";
  export let open = false;
  async function copyBlobToClipboard(blob) {
    try {
      // Convert blob to text
      const text = await blob.text();

      // Copy text to clipboard
      await navigator.clipboard.writeText(text);

      console.log("Blob copied to clipboard:", text);
    } catch (error) {
      console.error("Error copying blob to clipboard:", error);
    }
  }
</script>

<div id="main" style={open ? "left:75vw;" : "left:calc(100vw - 2em);"}>
  <div id="icons">
    <IconButtonText
      text="Provide structure"
      icon="account_tree"
      on:click={() => {
        console.log("Download SVG");
        // Open a file dialog to select a json file
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        // And put the content of the file in the structureStore value
        input.onchange = (e) => {
          if (!(e.target instanceof HTMLInputElement)) {
            return;
          }
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target.result;
            if (typeof text !== "string") {
              return;
            }
            structureStore.set(JSON.parse(text));
          };
          reader.readAsText(file);
        };
        input.click();
        // And remove the element from the DOM after the file has been selected
        input.remove();
      }}
    />
    <OtherButton />
    <IconButtonText
      text="Remove structure"
      icon="delete"
      on:click={() => {
        // Reset the structureStore value to undefined
        structureStore.set(undefined);
      }}
    />
    <IconButtonText
      text="Download SVG"
      icon="download"
      on:click={() => {
        console.log("Download SVG");
        
        getGraphSVG($structureStore).then((blob) => {
          const svgURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = svgURL;
          a.download = "graph.svg";
          a.click();
          // Remove the element from the DOM
          a.remove();
        });
      }}
    />
    <IconButtonText
      text="Download DOT"
      icon="download"
      on:click={() => {
        console.log("Download SVG");
        getGraphDOT($structureStore).then((blob) => {
          const dotURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = dotURL;
          a.download = "graph.dot";
          a.click();
          // Remove the element from the DOM
          a.remove();
        });
      }}
    />
    <IconButtonText
      text="Copy SVG"
      icon="content_copy"
      on:click={() => {
        console.log("Download SVG");
        getGraphSVG($structureStore).then(async (blob) => {
          await copyBlobToClipboard(blob);
        });
      }}
    />
    <IconButtonText
      text="Copy DOT"
      icon="content_copy"
      on:click={($structureStore) => {
        console.log("Download SVG");
        getGraphDOT().then(async (blob) => {
          await copyBlobToClipboard(blob);
        });
      }}
    />
  </div>
  <div
    id="openClose"
    on:click={() => {
      open = !open;
      return;
    }}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        open = !open;
        return;
      }
    }}
  >
    {#if open}
      <span transition:fade={{ duration: 500 }}> &#9654; </span>
    {:else}
      <span transition:fade={{ duration: 500 }}> &#9664; </span>
    {/if}
  </div>
</div>

<style>
  #main {
    width: 25vw;

    padding-top: 2em;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: black;
    z-index: 100;
    /* CSS animation when left property changes */
    transition: left 0.5s;
    border-left: 4px solid var(--color-graph);
    border-top: 4px solid var(--color-graph);
  }
  #icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: calc("25vw");
    height: fit-content;
    margin: 1em;
    margin-left: 3em;
  }
  #openClose {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1em;
    height: 100%;
    background-color: black;
    color: white;
    font-size: 1em;
    cursor: pointer;
    margin: 0;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  #openClose span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  #openClose:hover {
    background-color: hsl(0, 0%, 25%);
  }
</style>
