<script lang="ts">
  /** UI element to enter a paper with a DOI
   * *@param {id}{string} the id of the paper (uuidv4)
   * *@param {doi}{string} the doi of the paper
   * *@param {url}{string} the url of the paper
   * *@param {citations}{TextType[]} citations for the paper added by the user
   * *@param {tags}{TagType[]} tags specified for the paper
   * *@param {analysis}{string} analysis for the paper
   * *@fires change { doi, url, tags, citations, analysis } when the user change the values
   * *@fires done { id, doi, url, tags, citations, analysis }
   * *@stores doiPaperStore { id, doi, url, tags, citations, analysis } to store the data of the paper beeing entered. Allows to not loose the entered information when switching tab
   * @type {SvelteComponent}
   */
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    doiPaperStore,
    paperStore,
    type DOIPaper,
    type TagType,
  } from "../data";
  import { emptyTag, insertDOIPaper } from "./libs";
  import Paper from "./Paper.svelte";
  import TextLine from "./TextLine.svelte";
  import Button from "./Button.svelte";

  export let id_paper: string = uuidv4();
  export let doi = "";
  export let url = "";
  export let citations = [emptyText()];
  export let tags: TagType[] = [emptyTag()];
  export let analysis = "";

  const dispatch = createEventDispatcher();
  let id = 0;

  export function emptyText() {
    return {
      id: uuidv4(),
      text: "",
      tags: [],
      files: [],
    };
  }
  export function set(paper: DOIPaper) {
    id_paper = paper.id;
    doi = paper.doi;
    url = paper.url;
    tags = paper.tags;
    citations = paper.citations;
    analysis = paper.analysis;
    id++;
  }
  function reset() {
    doi = "";
    url = "";
    tags = [emptyTag()];
    citations = [emptyText()];
    analysis = "";
    id_paper = uuidv4();
  }
  onMount(() => {
    let v;
    doiPaperStore.subscribe((p) => {
      v = p;
    });
    if (v !== undefined) {
      set(v);
    }
  });
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
      insertDOIPaper({ id: id_paper, doi, url, tags, citations, analysis });
      dispatch("done", { id: id_paper, doi, url, tags, citations, analysis });
      reset();
      id++;
      // Set focus to first input
      setTimeout(() => {
        document.querySelectorAll("input")[0].focus();
      }, 100);
    }}
  />
</div>
