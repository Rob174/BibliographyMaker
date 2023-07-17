<script lang="ts">
  import { createEventDispatcher } from "svelte";
  /** A table to display the papers with 2 buttons to load a json or download the data. See PaperListElem for more details of the fields shown on each line
   * *@stores read/write paperStore, to have access to the papers in memory or load new papers 
   * *@stores read tagsPossibilities, to have access to the list of tags (see data for updates details)
  */
  import { paperStore, type GenericPaper, tagsPossibilities } from "../data";
  import Button from "./Button.svelte";
  import PaperVisualization from "./PaperVisualization.svelte";
  import PapersListElem from "./PapersListElem.svelte";
  import TagButton from "./TagButton.svelte";

  const dispatch = createEventDispatcher();
  let papers: GenericPaper[];
  let tags = [];
  let id = 0;
  let view: "table" | "detail" = "table";
  let selectedPaper = null;
  let sortedField = "id";
  let sortedDirections = new Map();

  paperStore.subscribe((e) => {
    papers = e;
    console.log(e)
  });
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
  sortedDirections.set("id", "desc");
  function handleThClick(field) {
    console.log(field);
    if (Array.from(["detail", "link", "tags", "analysis"]).includes(field))
      return;
    sortedField = field;
    if (sortedDirections.get(field) == "asc") {
      sortedDirections.set(field, "desc");
    } else {
      sortedDirections.set(field, "asc");
    }
    papers.sort((a, b) => {
      var nameA = a[sortedField]; // Convert name to uppercase for case-insensitive comparison
      var nameB = b[sortedField];
      if (a instanceof String || b instanceof String) {
        nameA = nameA.toUpperCase();
        nameB = nameB.toUpperCase();
      }

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    if (sortedDirections.get(field) !== "asc") {
      console.log(sortedField);
      papers.reverse();
    }
    id++;
    console.log(papers);
  }
  handleThClick("id");
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
  {#key id}
    <table id="papers">
      <thead>
        <tr>
          <th rowspan="2" />
          <th rowspan="2">Detail </th>
          <th
            class="clickable"
            rowspan="2"
            on:click={(event) =>
              handleThClick(event.target.innerText.toLowerCase())}
            >ID {sortedField === "id"
              ? `(${sortedDirections.get(sortedField)})`
              : ""}</th
          >
          <th
            class="clickable"
            rowspan="2"
            on:click={(event) =>
              handleThClick(event.target.innerText.toLowerCase())}
            >Title {sortedField === "title"
              ? `(${sortedDirections.get(sortedField)})`
              : ""}</th
          >
          <th
            class="clickable"
            rowspan="2"
            on:click={(event) =>
              handleThClick(event.target.innerText.toLowerCase())}
            >Year {sortedField === "year"
              ? `(${sortedDirections.get(sortedField)})`
              : ""}</th
          >
          <th rowspan="2">Link</th>
          <th>Tags</th>
          <th rowspan="2">Analysis</th>
          <th rowspan="2" />
          <th rowspan="2" />
        </tr>
        <tr>
          <th><input type="text" on:change={(e)=> {

          }}/></th>
        </tr>
      </thead>
      <tbody>
        {#each papers as paper, i}
          <PapersListElem
            idx={i + 1}
            {paper}
            on:edit
            on:delete
            on:visualize={(e) => {
              dispatch("visualize", e.detail);
            }}
          />
        {/each}
      </tbody>
    </table>
  {/key}

<style>
  .clickable {
    cursor: pointer;
  }

  table {
    border: 1px solid var(--neutral-color);
    margin-top: 2em;
    margin-bottom: 2em;
    border-collapse: collapse;
    border-radius: 2em;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
  }
  th {
    border: 1px solid var(--neutral-color);
    padding: 1em;
    height: 0em;
  }
  th > input {
    appearance: none;
    width: 100%;
    background-color: transparent;
    border: 1px solid white;
  }
  th > input:hover {
    text-decoration: none;
    border: 1px solid white;
    appearance: none;
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
