<script lang="ts">
  import NewPaper from "./NewPaper.svelte";
  import TextValue from "../form_elems/TextValue.svelte";
  import { postPaperWithDOI } from "../../api/post";

  export let doi: string = "";
  export let relevantTexts: string[] = [""];
  export let tags: string[] = [""];
  export let analysisText: string = "";
  let newPaper;
  async function save() {
    console.log("save");
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
>
  <TextValue label="DOI" style="width: 100%;" bind:value={doi} focused={true} />
</NewPaper>
