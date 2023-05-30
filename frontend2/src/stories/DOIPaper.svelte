<script lang="ts">
  import Paper from "./Paper.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher } from "svelte";
  import TextLine from "./TextLine.svelte";
  import Button from "./Button.svelte";
  const dispatch = createEventDispatcher();

  function emptyText() {
    return {
      id: uuidv4(),
      text: "",
      tags: [],
      obj: null,
    };
  }
  export let tags: string[] = [""];
  export let citations = [emptyText()];
  export let analysis = "";
  export let doi = "";
  export let url = "";
  let id = 0;
</script>

<div id="container-paper">
{#key id}
  <Paper {tags} {citations} {analysis}>
    <h1>Paper with DOI</h1>
    <TextLine
      label="DOI"
      text={doi}
      on:change={(e) => {
        if (e.detail.text) doi = e.detail.text;
        dispatch("change", { doi, url, tags, citations, analysis });
      }}
    />
    <TextLine
      label="URL"
      text={url}
      on:change={(e) => {
        if (e.detail.text) url = e.detail.text;
        dispatch("change", { doi, url, tags, citations, analysis });
      }}
    />
  </Paper>
{/key}
<Button
  label="SAVE"
  on:click={(e) => {
    dispatch("change", { doi, url, tags, citations, analysis });
    // Set focus to first input
    setTimeout(() => {
      const buttons = document.querySelectorAll("#container-paper button")
      console.log(buttons)
      buttons[buttons.length-1].focus();
    }, 100);
  }}
/>
<Button
  label="CLEAR FIELDS"
  on:click={(e) => {
    doi = "";
    url = "";
    tags = [""];
    citations = [emptyText()];
    analysis = "";
    // Set focus to first input
    id++;
    setTimeout(() => {
      document.querySelectorAll("input")[0].focus();
    }, 100);
  }}
/>
</div>