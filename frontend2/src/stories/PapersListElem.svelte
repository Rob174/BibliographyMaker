<script lang="ts">
  /**A line of the table to display papers: this component represents one paper
   * *@param {paper}{GenericPaper} A paper of the database that contains the data to display
   * *@param {idx}{number} The id of the line to display for numerotation purposes (line 1, line 2, etc)
  */
  import { tagsPossibilities, type GenericPaper } from "../data";
  import TagButton from "./TagButton.svelte";
  import { shortString } from "./libs";
  import { copyToClipboard } from "./utils";
  import { createEventDispatcher } from "svelte";

  export let paper: GenericPaper;
  export let idx: number = 0;

  const dispatch = createEventDispatcher();
  let tags = [];

  tagsPossibilities.subscribe((x) => {
    // Filter in x the tags that are in paper.tags (text field)
    const tagsInPaper = new Set();
    paper.tags.forEach((x) => tagsInPaper.add(x.text));
    tags = x.filter((x) => tagsInPaper.has(x.text));
  });
</script>

<tr class="tr">
  <td>
    {idx}
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      dispatch("visualize", paper);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        dispatch("visualize", paper);
      }
    }}
  >
    <span class="material-symbols-outlined">preview </span>
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      copyToClipboard(paper.id);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        copyToClipboard(paper.id);
      }
    }}
  >
    {shortString(paper.id)}
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      copyToClipboard(paper.title);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        copyToClipboard(paper.title);
      }
    }}
  >
    {shortString(paper.title, 50)}
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      copyToClipboard(paper.year);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        copyToClipboard(paper.year);
      }
    }}
  >
    {paper.year}
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      copyToClipboard(paper.url);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        copyToClipboard(paper.url);
      }
    }}
  >
    <span class="material-symbols-outlined">
      <a id="link" href={paper.url} target="_blank">link</a>
    </span>
  </td>
  <td id="tags">
    {#each tags as t}
      <TagButton tag_name={shortString(t.text, 10)} color={t.color} />
    {/each}
  </td>
  <td
    id="analysis"
    on:click={(e) => {
      copyToClipboard(paper.url);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        copyToClipboard(paper.url);
      }
    }}
  >
    {paper.analysis}
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      dispatch("edit", paper);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        dispatch("edit", paper);
      }
    }}
  >
    <span class="material-symbols-outlined">edit </span>
  </td>
  <td
    class="clickable"
    on:click={(e) => {
      dispatch("delete", paper);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") {
        dispatch("delete", paper);
      }
    }}
  >
    <span class="material-symbols-outlined">delete </span>
  </td>
</tr>

<style>
  @import "./variables.css";
  .tr {
    width: 100%;
    transition: all var(--transition-duration) ease-in-out;
    overflow: hidden;
  }
  td {
    padding: 1em;
    text-align: center;
    /* Align vertically inside the div */
    vertical-align: middle;
    display: table-cell;
    border: 1px solid var(--neutral-color);
  }
  tr:hover {
    background-color: var(--light-neutral-color);
  }
  .clickable:hover {
    cursor: pointer;
  }
  #link {
    text-decoration: none;
  }
  #analysis {
    width: 25%;
    text-align: left;
  }
  #tags {
    width: 25%;
  }
</style>
