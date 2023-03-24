<script lang="ts">
  import TextValue from "../form_elems/TextValue.svelte";
  import Snackbar, { Actions, Label } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";
  import { onMount } from "svelte";
  let title = "";
  let results: Array<{
    title: string;
    doi: string;
    abstract: string;
    authors: Array<string>;
  }> = [
  ];
  let snackbarWithClose: Snackbar;
  let selectedTitle = "";
  let timer;
  function search(title) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      console.log('searching for doi... ' + title)
      const response = await fetch(
        `https://api.crossref.org/works?query.bibliographic=${title}&rows=10`
      );
      const data = await response.json();
      results = data.message.items.map((item) => {
        return {
          title: item.title[0],
          doi: item.DOI,
          abstract: item.abstract,
          authors: item.author ? item.author.map((author) => author.family) : ["No authors found"],
        };
      });
    }, 500);
  }
  // Search for doi when variable title does not change for 500ms
  $: if (title) {
    search(title);
  }
  onMount(() => {
    // Put focus on input field
    const input = document.querySelector("input");
    if (input) {
      input.focus();
    }
  });
</script>

<div style="margin: 2em;width: 100%;height:100%;">
  <TextValue label="Title" bind:value={title}/>
  <div>
    {#if results.length === 0}
      <div style="margin: 1em;">Results will be here...</div>
    {/if}
    {#each results as result}
      <div style="margin: 1em;">
        <div class="field title">{result.title}</div>
        <div class="field author">{result.authors}</div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="field doi"
          on:click={() => {
            console.log(result.doi);
            // Put result.doi into clipboard
            navigator.clipboard.writeText(result.doi);
            selectedTitle = result.title;
            snackbarWithClose.forceOpen();
          }}
        >
          {result.doi}
        </div>
        <div class="field">{result.abstract}</div>
      </div>
    {/each}
  </div>
</div>
<Snackbar bind:this={snackbarWithClose} timeoutMs={4000} class="snack">
  <Label>DOI of <code>{selectedTitle}</code> copied into clipboard!</Label>
  <Actions>
    <IconButton
      class="material-icons"
      title="Dismiss"
      style="color: white; background-color:white;">close</IconButton
    >
  </Actions>
</Snackbar>

<style>
  .title {
    font-size: 1.2em;
    font-weight: bold;
  }
  .author {
    font-size: 0.8em;
    font-style: italic;
    font-family: "Courier New", Courier, monospace;
  }
  .doi:hover {
    cursor: pointer;
    color: var(--accent2);
  }
  code {
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
