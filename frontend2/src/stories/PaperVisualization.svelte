<script lang="ts">
  import { tagsPossibilities, type GenericPaper } from "../data";
  import TagButton from "./TagButton.svelte";
  import { copyToClipboard } from "./utils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let paper: GenericPaper;

  let tags = [];
  tagsPossibilities.subscribe((x) => {
    // Filter in x the tags that are in paper.tags (text field)
    const tagsInPaper = new Set();
    paper.tags.forEach((x) => tagsInPaper.add(x.text));
    tags = x.filter((x) => tagsInPaper.has(x.text));
  });
</script>

<div id="root">
  <h1>{paper.title}</h1>
  <button
    id="back-button"
    on:click={() => {
      dispatch("back-to-table");
    }}
    on:keydown={(e) => {
      if (e.key == "Enter") dispatch("back-to-table");
    }}><span class="material-symbols-outlined">table_chart </span></button
  >
  <p>
    {paper.year} ; DOI: "<i
      class="clickable"
      on:click={() => {
        copyToClipboard(paper.doi);
      }}>{paper.doi}</i
    >"" ; ID : "<i
      class="clickable"
      on:click={() => {
        copyToClipboard(paper.id);
      }}>{paper.id}</i
    >"
  </p>
  <p />
  <p>
    <a
      href={paper.url}
      on:click={() => {
        copyToClipboard(paper.url);
      }}>{paper.url}</a
    >
  </p>
  <p>
    {paper.authors.map((x) => x.family + " " + x.given).join(" & ")}
  </p>
  <h2>Tags</h2>
  <div>
    {#each tags as t}
      <TagButton tag_name={t.text} color={t.color} />
    {/each}
  </div>
  <h2>Relevant texts</h2>
  {#each paper.citations as c}
    <div>
      <div>
        {#each c.tags as t1}
          <TagButton
            tag_name={t1}
            color={tags.filter((x) => x.text == t1)[0].color}
          />
        {/each}
      </div>
      <div class="citation">
        <p>{c.text}</p>
        {#each c.files as f}
          <!-- Render the image  -->
          <img src={f} alt="" />
        {/each}
      </div>
    </div>
  {/each}
  <h2>Analysis</h2>
  <div>
    {paper.analysis.trim() === "" ? "No analysis available." : paper.analysis}
  </div>
  <button
    class="full-size-button"
    on:click={() => {
      console.log(paper);
      copyToClipboard(JSON.stringify(paper, null, 2));
    }}>Get Data</button
  >
</div>

<style>
  .clickable:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  a:visited {
    color: black;
  }
  .citation {
    border-radius: 1em;
    border: 2px solid var(--neutral-color);
    padding: 1em;
    margin: 1em;
  }
  #back-button {
    appearance: none;
    background-color: transparent;
    border: 1px solid var(--neutral-color);
    color: var(--neutral-color);
    transition: all var(--transition-duration) ease-in-out;
    cursor: pointer;
    border-radius: 1em;
    padding: 0.4em;
    position: absolute;
    top: 1em;
    right: 1em;
  }
  #back-button:hover {
    border: 1px solid var(--accent-color);
    color: var(--accent-color);
  }
  #root {
    position: relative;
  }
  .full-size-button {
    appearance: none;
    margin: 0;
    padding: 1em;
    background-color: transparent;
    border: 1px solid var(--neutral-color);
    width: 100%;
    border-radius: 1em;
    transition: all var(--transition-duration) ease-in-out;
    cursor: pointer;
    margin-top: 2em;
    margin-bottom: 2em;
  }
  .full-size-button:hover {
    border: 1px solid var(--accent-color);
    background-color: var(--accent-color);
  }
</style>
