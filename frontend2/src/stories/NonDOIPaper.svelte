<script lang="ts">
  /** This component allows to enter paper for which no doi is provided or if the doi is not recognized
   * *@param {id_paper}{string} the id of the paper (uuidv4)
   * *@param {title}{string} the title of the paper
   * *@param {url}{string} the url of the paper
   * *@param {year}{string} the year of the paper
   * *@param {authors}{AuthorType[]} the authors of the paper of the paper
   * *@param {citations}{TextType[]} citations for the paper added by the user
   * *@param {tags}{TagType[]} tags specified for the paper
   * *@param {analysis}{string} analysis for the paper
   * *@fires change { doi, url, tags, citations, analysis } when the user change the values
   * *@fires done { id, doi, url, tags, citations, analysis }
   * *@stores nonDoiPaperStore { id, title, authors, year, url, citations, tags, analysis} to store the data of the paper beeing entered. Allows to not loose the entered information when switching tab
  */
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import Paper from "./Paper.svelte";
  import TextLine from "./TextLine.svelte";
  import Button from "./Button.svelte";
  import IconButton from "./IconButton.svelte";
  import {
    type AuthorType,
    nonDoiPaperStore,
    type TagType,
    type NonDOIPaper,
  } from "../data";
  import {
    emptyAuthor,
    emptyTag,
    emptyText,
    insertNonDOIPaper,
    processAuthor,
  } from "./libs";

  export let id_paper: string = uuidv4();
  export let title = "";
  export let url = "";
  export let year = "";
  export let authors: AuthorType[] = [emptyAuthor()];
  export let citations = [emptyText()];
  export let tags: TagType[] = [emptyTag()];
  export let analysis = "";
  
  const dispatch = createEventDispatcher();
  let id = 0;

  onMount(() => {
    let v;
    nonDoiPaperStore.subscribe((p) => {
      v = p;
    });
    if (v!== undefined) {
      set(v);
    }
  });

  export function set(paper: NonDOIPaper) {
    console.log("set", paper);
    id_paper = paper.id;
    title = paper.title;
    authors = paper.authors;
    year = paper.year;
    url = paper.url;
    citations = paper.citations;
    tags = paper.tags;
    analysis = paper.analysis;
    id++;
  }
  function reset() {
    tags = [emptyTag()];
    citations = [emptyText()];
    analysis = "";
    year = "";
    authors = [];
    title = "";
    url = "";
    id_paper = uuidv4();
  }
  function refreshStore(event = "change") {
    const vals = {
      id: id_paper,
      title,
      authors,
      year,
      url,
      citations,
      tags,
      analysis,
    };
    nonDoiPaperStore.set(vals);
    dispatch(event, vals);
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
        <h1>Paper without DOI</h1>
      </svelte:fragment>
      <svelte:fragment slot="fields">
        <TextLine
          label="Title"
          text={title}
          on:change={(e) => {
            if (e.detail !== null && e.detail !== undefined) title = e.detail;
            refreshStore();
          }}
        />
        <TextLine
          label="URL"
          text={url}
          on:change={(e) => {
            if (e.detail !== null && e.detail !== undefined) url = e.detail;
            refreshStore();
          }}
        />
        <TextLine
          label="Year"
          text={year}
          on:change={(e) => {
            if (e.detail !== null && e.detail !== undefined) year = e.detail;
            refreshStore();
          }}
        />
        {#each authors as a, i}
          <div class="author">
            <TextLine
              label={`Author ${i + 1}`}
              text={a.raw}
              on:change={(e) => {
                if (e.detail !== undefined && e.detail !== null) {
                  let author = emptyAuthor();
                  author.raw = e.detail;
                  const authorsProc = processAuthor(author);
                  console.log("processed", authorsProc);
                  authors[i] = authorsProc[0];
                  console.log("curr", authors[i]);
                  if (authorsProc.length > 1) {
                    authorsProc.forEach((aut, id_auth) => {
                      if (id_auth > 0) {
                        authors.push(aut);
                      }
                    });
                    id++;
                  }
                  console.log("authors1", authors);
                  setTimeout(() => {
                    const a = document.querySelectorAll(".author input");
                    a[a.length - 1].focus();
                  }, 100);
                }
                console.log("authors", authors);
                refreshStore();
              }}
            >
              <IconButton
                iconName="add"
                on:change={() => {
                  authors.push(emptyAuthor());
                  id++;
                }}
              />
              <IconButton
                iconName="delete"
                on:change={() => {
                  // delete only the element at position i from the list
                  authors.splice(i, 1);
                  id++;
                }}
              />
            </TextLine>
          </div>
        {/each}
      </svelte:fragment>
    </Paper>
  {/key}
  <Button
    label="SAVE"
    on:click={(e) => {
      insertNonDOIPaper({
        id: id_paper,
        title,
        authors,
        year,
        url,
        citations,
        tags,
        analysis,
      });
      refreshStore("done");
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
      reset();
      refreshStore("change");
      // Set focus to first input
      id++;
      setTimeout(() => {
        document.querySelectorAll("input")[0].focus();
      }, 100);
    }}
    on:keydown={(e) => {
      if (e.key == "Enter" || e.key == "Tab") {
        document.querySelectorAll("#container-paper input")[0].focus();
        e.preventDefault();
      }
    }}
  />
</div>
