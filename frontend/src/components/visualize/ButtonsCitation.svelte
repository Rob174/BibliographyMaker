<script lang="ts">
  import type { Paper } from "../../types";
  import Button from "@smui/button/src/Button.svelte";
  import Select, { Option } from '@smui/select';
  import {getCitation, getCitationCitep} from "../../citations";
  export let paper: Paper;
  
  let citations = ['citep', 'citet','cite'];
  let citationStyle = "citep";
</script>

<Button
  on:click={async () => {
    const t = await getCitation(paper);
    // Copy to clipboard
    navigator.clipboard.writeText(t);
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
  on:click={async () => {
    const t = await getCitationCitep(paper, citationStyle);
    // Copy to clipboard
    navigator.clipboard.writeText(t);
  }}
  style="width:82.5%; margin-top:2em;"
  variant="raised"
>
  Get bibtex citation
</Button>