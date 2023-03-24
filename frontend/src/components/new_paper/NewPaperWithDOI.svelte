<script lang="ts">
  import NewPaper from "./NewPaper.svelte";
  import TextValue from "../form_elems/TextValue.svelte";
  import { postPaperWithDOI } from "../../api/post";
  import { paperWithDOIStore, defaultPaperWithDOIStore } from "../../data";
  let doi: string = "";
  let relevantTexts: string[] = [""];
  let tags: string[] = [""];
  let analysisText: string = "";
  let id_in_db: string = "";
  let url: string = "";
  paperWithDOIStore.subscribe((paper) => {
    doi = paper.doi;
    relevantTexts = paper.relevant_text
    tags = paper.tags;
    analysisText = paper.analysis;
    id_in_db = paper.id_in_db || "";
    url = paper.url || "";
  });
  $: {
    // Update the store when any of the fields change
    paperWithDOIStore.set({
      doi,
      url,
      relevant_text: relevantTexts,
      tags,
      analysis: analysisText,
      id_in_db
    });
  }


  let newPaper;
  async function save() {
    const resultMsg: string = await postPaperWithDOI(
      doi,
      url,
      relevantTexts,
      tags,
      analysisText,
      id_in_db
    );
    newPaper.setErrorMsg(resultMsg);
  }
</script>

<NewPaper
  bind:relevantTexts
  bind:tags
  bind:analysisText
  bind:this={newPaper}
  bind:id_in_db
  on:save={save}
  on:clearFields={() => {
    paperWithDOIStore.set(defaultPaperWithDOIStore());
  }}
>
  <TextValue label="DOI" style="width: 100%;" bind:value={doi} focused={true} />
  <TextValue label="(optional) URL" style="width: 100%;" bind:value={url} />
</NewPaper>
