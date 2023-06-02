<script lang="ts">
  import Analysis from "./Analysis.svelte";
  import References from "./References.svelte";
  import Tags from "./Tags.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher } from "svelte";
  import TextLine from "./TextLine.svelte";
  import { emptyTag } from "./libs";
  import type { TagType } from "../data";
  const dispatch = createEventDispatcher();
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
  export let id_paper = uuidv4();
  let id = 0;
  function change() {
    dispatch("change", { id_paper, citations, tags, analysis });
  }
</script>

<slot name="header" />
<TextLine
  label="ID"
  text={id_paper}
  on:change={(e) => {
    id_paper = e.detail;
    change()
  }}
/>
<slot name="fields" />
{#key id}
  <References
    tags={tags.map(x=>x.text)}
    data={citations}
    on:change={(e) => {
      citations = e.detail;
      change()
    }}
  />
{/key}
<Tags
  data={tags}
  on:change={(e) => {
    tags = e.detail;
    id++;
    change()
  }}
/>
<Analysis
  {analysis}
  on:change={(e) => {
    analysis = e.detail;
    change()
  }}
/>
