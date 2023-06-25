<script lang="ts">
  /** The "template" for the paper common fields between paper with/without doi
   * *@param {id_paper}{string} the id of the paper (uuidv4)
   * *@param {citations}{TextType[]} citations for the paper added by the user
   * *@param {tags}{TagType[]} tags specified for the paper
   * *@param {analysis}{string} analysis for the paper
   * *@slot {header} the header of the paper
   * *@slot {fields} the fields of the paper
  */
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher } from "svelte";
  import Analysis from "./Analysis.svelte";
  import References from "./References.svelte";
  import Tags from "./Tags.svelte";
  import TextLine from "./TextLine.svelte";
  import { emptyTag } from "./libs";
  import type { TagType } from "../data";

  export let id_paper = uuidv4();
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
