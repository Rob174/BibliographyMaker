<script lang="ts">
  /** Component to enter an analysis of the paper that we are entering in the form
   * @type {import("svelte").SvelteComponent}
   * @param {analysis}{string}
   * @param {change}{function} Function to call when the analysis is changed
  */
  import { createEventDispatcher } from "svelte";
  import TextArea from "./TextArea.svelte";
  import IconButton from "./IconButton.svelte";
  import {renderLaTeX} from "./latexRender"

  const dispatch = createEventDispatcher();

  export let analysis = "";

  let renderedValue = "";
  
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
      renderedValue = renderLaTeX(analysis);
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
