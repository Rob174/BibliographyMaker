<script lang="ts">
  import Graph from "./Graph.svelte";
  import { paperStore } from "../data";
  import { fade } from "svelte/transition";
  import Button from "./Button.svelte";
  import type { Structure } from "./graph";
  let structure: Structure[] = [];
  
  let visibleWindow = "config";
  let papers = []
  paperStore.subscribe(p=>(papers = p))
  function addStructure() {
    // Make an input file field to load a json file
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        structure = data;
        console.log(structure)
      };
      reader.readAsText(file);
    };
    input.click();
  }
  function removeStructure() {
    if (structure.length > 0) {
      structure = [];
    }
  }
</script>

<div id="tabs">
  <button
    class={visibleWindow === "config" ? "selected" : ""}
    on:click={() => {
      visibleWindow = "config";
    }}
    transition:fade
  >
    Configuration
  </button>
  <button
    class={visibleWindow === "graph" ? "selected" : ""}
    on:click={() => {
      visibleWindow = "graph";
    }}
    transition:fade
  >
    View Graph
  </button>
</div>

{#if visibleWindow === "config"}
    <div>
        <Button label="Add structure" on:click={addStructure} />
        <Button label="Remove structure" on:click={removeStructure} />
    </div>
{:else if visibleWindow === "graph"}
  <Graph {structure} {papers} on:visualize/>
{/if}

<style>
    
  #tabs {
    display: flex;
    flex-direction: row;
  }
  #tabs button {
    appearance: none;
    border: none;
    padding: 10px 20px;
    margin: 0;
    border-radius: 0;
    flex: 1;
    text-align: center;
    cursor: pointer;
  }
  #tabs button:hover {
    background-color: #ddd;
  }
  #tabs button.selected {
    background-color: #ccc;
  }
</style>