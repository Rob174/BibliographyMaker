<script lang="ts">
  import TabBar from "@smui/tab-bar";
  import Tab, { Label } from "@smui/tab";
  import NewPaper from "./components/new_paper/NewPaper.svelte";
  import Visualize from "./components/visualize/Visualize.svelte";
  import SearchDoi from "./components/search_doi/SearchDoi.svelte";
  import { onMount } from "svelte";
  const tabPossibilities = ["New paper", "Search DOI", "Visualize"];
  let active = "New paper";
  // Add listener so that ctrl + & switches tabs
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "&") {
      event.preventDefault();
      const index = tabPossibilities.indexOf(active);
      if (event.shiftKey) {
        active =
          tabPossibilities[
            (index - 1 + tabPossibilities.length) % tabPossibilities.length
          ];
      } else {
        active = tabPossibilities[(index + 1) % tabPossibilities.length];
      }
    }
  });
</script>

<head>
  <link
    rel="stylesheet"
    href="../build/smui.css"
    media="(prefers-color-scheme: light)"
  />
  <link
    rel="stylesheet"
    href="../build/smui-dark.css"
    media="screen and (prefers-color-scheme: dark)"
  />
  <!-- Material Icons -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
  <!-- Roboto -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />
  <!-- Roboto Mono -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto+Mono"
  />
</head>
<main>
  <TabBar tabs={tabPossibilities} let:tab bind:active>
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  {#if active === "New paper"}
    <NewPaper />
  {:else if active === "Visualize"}
    <Visualize />
  {:else if active === "Search DOI"}
    <SearchDoi />
  {/if}
</main>

<style>
  main {
    height: 100vh;
    width: 100vw;
  }
  :global(.mdc-tab-bar) {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: black;
  }
</style>
