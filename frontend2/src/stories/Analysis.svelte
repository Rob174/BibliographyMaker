<script lang="ts">
  /** Component to enter an analysis of the paper that we are entering in the form
   * @type {import("svelte").SvelteComponent}
   * @param {analysis}{string}
   * @param {change}{function} Function to call when the analysis is changed
  */
  import TextArea from "./TextArea.svelte";
  import IconButton from "./IconButton.svelte";
  import { createEventDispatcher } from "svelte";
  import { parse, HtmlGenerator } from "latex.js";

  const dispatch = createEventDispatcher();

  export let analysis = "";

  let renderedValue = "";
  
  function renderLaTeX(latex) {
    let generator = new HtmlGenerator({ hyphenate: false });
    let doc = parse(latex, { generator: generator }).htmlDocument();
    renderedValue = `
      <html>
        <head>
          <link rel="stylesheet" href="https://latex.js.org/css/katex.css" type="text/css" />
          <link rel="stylesheet" href="https://latex.js.org/css/article.css" type="text/css"/>
          <style>body{background-color: white; color: black;}</style>
        </head>
        <body>
          ${doc.documentElement.outerHTML}
        </body>
      </html>
    `;
  }
</script>

<TextArea
  label="Analysis"
  text={analysis}
  on:change={(e) => {
    analysis = e.detail;
    dispatch("change", analysis);
  }}
>
  <IconButton
    iconName="iframe"
    on:change={(e) => {
      renderLaTeX(analysis);
    }}
  />
</TextArea>

{#if renderedValue !== ""}
  <!-- Render in a iframe the latex result -->
  <iframe
    sandbox="allow-same-origin allow-scripts"
    seamless
    style="width:100%; height: 100%;"
    srcdoc={renderedValue}
    title="latex-content"
  />
{/if}
