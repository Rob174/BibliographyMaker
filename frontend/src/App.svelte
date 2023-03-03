<script lang="ts">
  import TabBar from "@smui/tab-bar";
  import Tab, { Label } from "@smui/tab";
  import NewPaperWithDOI from "./components/new_paper/NewPaperWithDOI.svelte";
  import NewPaperWithoutDOI from "./components/new_paper/NewPaperWithoutDOI.svelte";
  import Visualize from "./components/visualize/Visualize.svelte";
  import SearchDoi from "./components/search_doi/SearchDoi.svelte";
  import Headers from "./Headers.svelte";
  import DialogDetailUpdate from "./components/visualize/DialogDetailUpdate.svelte";
  import { nodesMetadata } from "./data";
  const tabPossibilities = [
    "Add paper by doi",
    "Add paper manually",
    "Search DOI",
    "Visualize",
  ];
  let active = "Add paper by doi";
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
  let selectedDoneUpdate = false;
  nodesMetadata.subscribe((value) => {
    selectedDoneUpdate = !selectedDoneUpdate;
  });
</script>

<Headers />
<main>
  <TabBar tabs={tabPossibilities} let:tab bind:active style="position:fixed;">
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  <div
    style="position: fixed; width: 100%; height: 100%; margin-top: 3em; overflow-y: scroll;"
  >
    {#if active === "Add paper by doi"}
      <NewPaperWithDOI />
    {:else if active === "Add paper manually"}
      <NewPaperWithoutDOI />
    {:else if active === "Visualize"}
        <Visualize />
    {:else if active === "Search DOI"}
      <SearchDoi />
    {/if}
  </div>
  <DialogDetailUpdate />
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
