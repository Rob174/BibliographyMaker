<script lang="ts">
  import NewPaper from "./NewPaper.svelte";
  import TextValue from "../form_elems/TextValue.svelte";
  import { postPaperWithDOI } from "../../api/post";
  import { paperWithDOIStore, defaultPaperWithDOIStore } from "../../data";
  let doi: string = "";
  let relevantTexts: string[] = [""];
  let tags: string[] = [""];
  let analysisText: string = "";
  paperWithDOIStore.subscribe((paper) => {
    doi = paper.doi;
    relevantTexts = paper.relevant_text
    tags = paper.tags;
    analysisText = paper.analysis;
  });
  $: {
    // Update the store when any of the fields change
    paperWithDOIStore.set({
      doi,
      relevant_text: relevantTexts,
      tags,
      analysis: analysisText,
    });
  }


  let newPaper;
  async function save() {
    const resultMsg: string = await postPaperWithDOI(
      doi,
      relevantTexts,
      tags,
      analysisText
    );
    newPaper.setErrorMsg(resultMsg);
  }
</script>

<NewPaper
  bind:relevantTexts
  bind:tags
  bind:analysisText
  bind:this={newPaper}
  on:save={save}
  on:clearFields={() => {
    paperWithDOIStore.set(defaultPaperWithDOIStore());
  }}
>
  <TextValue label="DOI" style="width: 100%;" bind:value={doi} focused={true} />
</NewPaper>
