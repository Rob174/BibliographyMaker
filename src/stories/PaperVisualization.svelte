<script lang="ts">
  /** Visualize the details of one paper
   * *@param {paper}{GenericPaper} the paper to visualize
   */
  import { createEventDispatcher } from "svelte";
  import { tagsPossibilities, type GenericPaper } from "../data";
  import { renderLaTeX } from "./latexRender";
  import TagButton from "./TagButton.svelte";
  import { copyToClipboard } from "./utils";
  const dispatch = createEventDispatcher();

  export let paper: GenericPaper = null;

  let tags = [];
  tagsPossibilities.subscribe((x) => {
    // Filter in x the tags that are in paper.tags (text field)
    if (paper !== null) {
      const tagsInPaper = new Set();
      paper.tags.forEach((x) => tagsInPaper.add(x.text));
      tags = x.filter((x) => tagsInPaper.has(x.text));
    }
  });
  console.log(paper)
</script>

<div id="root">
  {#if paper !== null}
    <h1>{paper.title}</h1>
    <p>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    {#if paper.citations.length > 1 || (paper.citations.length && (paper.citations[0].text.trim() !== "" || paper.citations[0].files.length > 0))}
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
    {:else}
      No citations found
    {/if}
    <h2>Analysis</h2>
    <div>
      {#if paper.analysis.trim() === ""}
        No analysis available.
      {:else}
        <iframe
          sandbox="allow-same-origin allow-scripts"
          seamless
          style="width:100%; height: 100%; border: none;"
          srcdoc={renderLaTeX(paper.analysis, " font-size: 3em;")}
          title="latex-content"
        />
      {/if}
    </div>
    <button
      class="full-size-button"
      on:click={() => {
        console.log(paper);
        copyToClipboard(JSON.stringify(paper, null, 2));
      }}>Get Data</button
    >
  {/if}
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
  img {
    width: 100%;
  }
</style>
