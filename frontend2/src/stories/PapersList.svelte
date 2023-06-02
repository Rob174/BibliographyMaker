<script lang="ts">
  import { paperStore, type GenericPaper, tagsPossibilities } from "../data";
  import Button from "./Button.svelte";
  import PaperVisualization from "./PaperVisualization.svelte";
  import PapersListElem from "./PapersListElem.svelte";
  import TagButton from "./TagButton.svelte";

  let papers: GenericPaper[];
  paperStore.subscribe((e) => {
    papers = e;
  });
  let tags = [];
  tagsPossibilities.subscribe((t) => {
    tags = t;
  });
  function handleFileInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
      const parsedContent = JSON.parse(content);
      paperStore.set(parsedContent);
    };

    reader.readAsText(file);
  }
  let view: "table" | "detail" = "table";
  let selectedPaper = null;
</script>

<Button
  label="Load data"
  on:click={() => {
    // Open a dialog to select a json file and load it inside paperStore
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.addEventListener("change", handleFileInput);

    input.click();
  }}
/>
<Button
  label="Download data"
  on:click={() => {
    // Convert in text the json papers into string and then create a file download it and copy it inside the clipboard
    const jsonString = JSON.stringify(papers, null, 2);
    // Create a Blob object from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary anchor element
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "papers.json";

    // Trigger the download programmatically
    anchor.click();

    // Copy the JSON string to the clipboard
    navigator.clipboard.writeText(jsonString);
  }}
/>
<div id="tags">
  {#each tags as t}
    <TagButton tag_name={t.text} color={t.color} />
  {/each}
</div>
{#if view == "table"}
  <table>
    <thead>
      <tr>
        <th>Detail</th>
        <th>ID</th>
        <th>Title</th>
        <th>Year</th>
        <th>Link</th>
        <th>Tags</th>
        <th>Analysis</th>
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      {#each papers as paper}
        <PapersListElem
          {paper}
          on:edit
          on:delete
          on:visualize={(e) => {
            selectedPaper = e.detail;
            view = "detail";
          }}
        />
      {/each}
    </tbody>
  </table>
{:else if view == "detail"}
  <PaperVisualization
    paper={selectedPaper}
    on:back-to-table={() => {
      view = "table";
    }}
  />
{/if}

<style>
  table {
    border: 1px solid var(--neutral-color);
    margin-top: 2em;
    margin-bottom: 2em;
    border-collapse: collapse;
    border-radius: 2em;
    width: 100%;
    height: 100%;
  }
  th {
    border: 1px solid var(--neutral-color);
    padding: 1em;
  }
  thead {
    position: sticky;
    background-color: var(--neutral-color);
    top: 0;
  }
  tbody {
    overflow-y: scroll;
    max-height: 50vh;
  }
  thead,
  tbody {
    table-layout: fixed;
  }
  #tags {
    margin-top: 2em;
    margin-bottom: 2em;
  }
</style>
