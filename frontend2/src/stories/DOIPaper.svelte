<script lang="ts">
  import Paper from "./Paper.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher, onMount } from "svelte";
  import TextLine from "./TextLine.svelte";
  import Button from "./Button.svelte";
  const dispatch = createEventDispatcher();
  import {
    doiPaperStore,
    paperStore,
    type DOIPaper,
    type TagType,
  } from "../data";
  import { emptyTag, insertDOIPaper } from "./libs";
  let id = 0;

  export function emptyText() {
    return {
      id: uuidv4(),
      text: "",
      tags: [],
      files: [],
    };
  }
  export let tags: TagType[] = [emptyTag()];
  export let citations = [emptyText()];
  export let analysis = "";
  export let doi = "";
  export let url = "";
  export let id_paper: string = uuidv4();
  onMount(() => {
    let v;
    doiPaperStore.subscribe((p) => {
      v = p;
    });
    if (v!== undefined) {
      set(v);
    }
  });
  export function set(paper: DOIPaper) {
    id_paper = paper.id;
    doi = paper.doi;
    url = paper.url;
    tags = paper.tags;
    citations = paper.citations;
    analysis = paper.analysis;
    id++;
  }
</script>

<div id="container-paper">
  {#key id}
    <Paper
      {id_paper}
      {tags}
      {citations}
      {analysis}
      on:change={(e) => {
        id_paper = e.detail.id_paper;
        tags = e.detail.tags;
        citations = e.detail.citations;
        analysis = e.detail.analysis;
      }}
    >
      <svelte:fragment slot="header">
        <h1>Paper with DOI</h1>
      </svelte:fragment>
      <svelte:fragment slot="fields">
        <TextLine
          label="DOI"
          text={doi}
          on:change={(e) => {
            console.log("DOI chaneg", e);
            if (e.detail !== null && e.detail !== undefined) doi = e.detail;
            console.log(e);
            doiPaperStore.set({
              id: id_paper,
              doi,
              url,
              tags,
              citations,
              analysis,
            });
            dispatch("change", { doi, url, tags, citations, analysis });
          }}
        />
        <TextLine
          label="URL"
          text={url}
          on:change={(e) => {
            if (e.detail !== null && e.detail !== undefined) url = e.detail;
            doiPaperStore.set({
              id: id_paper,
              doi,
              url,
              tags,
              citations,
              analysis,
            });
            dispatch("change", { doi, url, tags, citations, analysis });
          }}
        />
      </svelte:fragment>
    </Paper>
  {/key}
  <Button
    label="SAVE"
    on:click={(e) => {
      doiPaperStore.set({ id: id_paper, doi, url, tags, citations, analysis });
      console.log("insert", {
        id: id_paper,
        doi,
        url,
        tags,
        citations,
        analysis,
      });
      insertDOIPaper({ id: id_paper, doi, url, tags, citations, analysis });
      dispatch("done", { id_paper, doi, url, tags, citations, analysis });
      // Set focus to first input
      setTimeout(() => {
        const buttons = document.querySelectorAll("#container-paper button");
        console.log(buttons);
        buttons[buttons.length - 1].focus();
      }, 100);
    }}
  />
  <Button
    label="CLEAR FIELDS"
    on:click={(e) => {
      doi = "";
      url = "";
      tags = [emptyTag()];
      citations = [emptyText()];
      analysis = "";
      doiPaperStore.set({ id: id_paper, doi, url, tags, citations, analysis });
      // Set focus to first input
      id++;
      setTimeout(() => {
        document.querySelectorAll("input")[0].focus();
      }, 100);
    }}
    on:keydown={(e) => {
      console.log("eeee");
      if (e.key == "Enter" || e.key == "Tab") {
        document.querySelectorAll("#container-paper input")[0].focus();
        e.preventDefault();
      }
    }}
  />
</div>
