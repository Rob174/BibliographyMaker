<script lang="ts">
  import TabBar from "@smui/tab-bar";
  import Tab, { Label } from "@smui/tab";
  import NewPaperWithDOI from "./components/new_paper/NewPaperWithDOI.svelte";
  import NewPaperWithoutDOI from "./components/new_paper/NewPaperWithoutDOI.svelte";
  import Visualize from "./components/visualize/Visualize.svelte";
  import SearchDoi from "./components/search_doi/SearchDoi.svelte";
  import Headers from "./Headers.svelte";
  import DialogDetailUpdate from "./components/visualize/DialogDetailUpdate.svelte";
  import { activeTabStore, clickedSnackStore, nodesMetadata } from "./data";
  import Snackbar, { Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";
  import {tabPossibilities} from "./data";
  let active = "Add paper by doi";
  activeTabStore.subscribe((value) => {
    active = value;
  });
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
  let snackbarWithClose: Snackbar;
  let htmlContent = "";
  let refreshSnack = false;
  clickedSnackStore.subscribe((value) => {
    htmlContent = value;
    refreshSnack = !refreshSnack;
    if (!snackbarWithClose) return;
    if(htmlContent === "") return;
    snackbarWithClose.forceOpen();
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
<div style="z-index:10000; height: fit-content;">
  <Snackbar bind:this={snackbarWithClose} timeoutMs={4000} class="snack">
    <Label>{@html htmlContent}</Label>
    <Actions>
      <IconButton
        class="material-icons"
        title="Dismiss"
        style="color: white; background-color:white;">close</IconButton
      >
    </Actions>
  </Snackbar>
</div>

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
  :global(code) {
    font-family: "Courier New", Courier, monospace;
    background-color: hsl(0, 0%, 0%);
    padding: 0.2em 0.6em;
    color: var(--accent2);
    border-radius: 0.2em;
  }
  :global(.snack div) {
    background-color: hsl(0, 0%, 15%);
    color: white;
  }
  :global(.snack span) {
    color: white;
  }
</style>
