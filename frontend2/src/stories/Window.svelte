<script lang="ts">
  import { fade } from "svelte/transition";
  import PapersList from "./PapersList.svelte";
  import DOIPaper from "./DOIPaper.svelte";
  import NonDOIPaper from "./NonDOIPaper.svelte";
  import { genericPaperToDOIPaper, genericPaperToNonDOIPaper } from "./libs";
  import { paperStore } from "../data";
  import { onMount } from "svelte";
  type VisibleWindowsType = "papersList" | "paperDOI" | "paperNonDOI" | "graph";
  let visibleWindow = "papersList";
  let paperdoi;
  let papernondoi;
  const tabs = ["papersList", "paperDOI", "paperNonDOI"];
  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "&") {
      const currIdx = tabs.indexOf(visibleWindow);
      visibleWindow = tabs[(currIdx + 1) % tabs.length];
    console.log("keydown", visibleWindow);
    }
  }
  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<div>
  <!-- Tabs available -->
  <div id="tabs">
    <button
      class={visibleWindow === "papersList" ? "selected" : ""}
      on:click={() => {
        visibleWindow = "papersList";
      }}
      transition:fade
    >
      Papers list
    </button>
    <button
      class={visibleWindow === "paperDOI" ? "selected" : ""}
      on:click={() => {
        visibleWindow = "paperDOI";
      }}
      transition:fade
    >
      Paper with DOI
    </button>
    <button
      class={visibleWindow === "paperNonDOI" ? "selected" : ""}
      on:click={() => {
        visibleWindow = "paperNonDOI";
      }}
      transition:fade
    >
      Paper without DOI
    </button>
    <button
      class={visibleWindow === "graph" ? "selected" : ""}
      on:click={() => {
        visibleWindow = "graph";
      }}
      transition:fade
    >
      Graph
    </button>
  </div>

  <!-- Conditionnaly show the correct tab -->
  {#if visibleWindow === "papersList"}
    <PapersList
      on:edit={(e) => {
        if (e.detail.type == "doi") visibleWindow = "paperDOI";
        if (e.detail.type == "nondoi") visibleWindow = "paperNonDOI";
        setTimeout(() => {
          if (e.detail.type == "doi")
            paperdoi.set(genericPaperToDOIPaper(e.detail));
          if (e.detail.type == "nondoi")
            papernondoi.set(genericPaperToNonDOIPaper(e.detail));
        }, 100);
      }}
      on:delete={(e) => {
        paperStore.update((p) => {
          p.splice(
            p.findIndex((x) => x.id == e.detail.id),
            1
          );
          return p;
        });
      }}
    />
  {:else if visibleWindow === "paperDOI"}
    <DOIPaper bind:this={paperdoi} />
  {:else if visibleWindow === "paperNonDOI"}
    <NonDOIPaper bind:this={papernondoi} />
  {/if}
</div>

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
  :root {
    font-family: Open Sans, sans-serif;
  }
</style>
