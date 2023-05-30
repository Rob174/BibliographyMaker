<script lang="ts">
  import Analysis from "./Analysis.svelte";
  import References from "./References.svelte";
  import Tags from "./Tags.svelte";
  import { v4 as uuidv4 } from "uuid";
  function emptyText() {
    return {
      id: uuidv4(),
      text: "",
      tags: [],
      obj: null,
    };
  }
  let tags: string[] = [""];
  let citations = [emptyText()];
  let analysis = "";
  let id = 0;
</script>

{#key id}
  <References
    {tags}
    data={citations}
    on:change={(e) => {
      citations = e.detail;
      // id++;
    }}
  />
{/key}
<Tags
  on:change={(e) => {
    tags = e.detail.map((x) => x.text);
    id++;
  }}
/>
<Analysis {analysis} on:change={(e) => (analysis = e.detail)} />
