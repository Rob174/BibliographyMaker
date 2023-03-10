<script lang="ts">
  import * as Cite from "citation-js";
  import type { Paper } from "../../types";
  import Button from "@smui/button/src/Button.svelte";
  import Select, { Option } from '@smui/select';
  export let paper: Paper;
  async function cite(): Promise<string> {
    // Make a promise to get the citation as a return value
    Cite.forceType = "@else/json";
    var options = { generateGraph: false };
    return new Promise((resolve, reject) => {
      Cite.async(JSON.stringify(paper.bibtex), options).then(function (
        result
      ) {
        const text = result.format("bibtex", { type: "text" });
        resolve(text);
      });
    });
  }
  function getCitation() {
    cite().then((text) => {
      // Copy the text to the clipboard
      navigator.clipboard.writeText(text);
    });
  }
  function getCitationCitep() {
    cite().then((text) => {
      // Get first line that is in the format @article{...
      const firstLine = text.split("\n")[0];
      // Get the key
      const key = firstLine.split("{")[1].split(",")[0];
      navigator.clipboard.writeText(`\\${citationStyle}{${key}}`);
    });
  }
  let citations = ['citep', 'citet'];
  let citationStyle = "citep";
</script>

<Button
  on:click={() => {
    getCitation();
  }}
  style="width:100%; margin-top:2em;"
  variant="raised"
>
  Get bibtex
</Button>
<Select bind:value={citationStyle} label="Citation format" style="width: 15%;margin-right: 2%; transform: translateY(20%);">
  {#each citations as c}
    <Option value={c}>{c}</Option>
  {/each}
</Select>
<Button
  on:click={() => {
    getCitationCitep();
  }}
  style="width:82.5%; margin-top:2em;"
  variant="raised"
>
  Get bibtex citation
</Button>