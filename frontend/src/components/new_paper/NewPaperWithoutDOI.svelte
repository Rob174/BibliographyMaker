<script lang="ts">
  import NewPaper from "./NewPaper.svelte";
  import TextValue from "../form_elems/TextValue.svelte";
  import InputFormatDelList from "./InputLists/InputFormatDelList.svelte";
  import { postPaperWithoutDOI } from "../../api/post";
  export let title: string = "";
  export let authors: string[] = [""];
  export let year: string = "";
  export let url: string = "";
  export let relevantTexts: string[] = [""];
  export let tags: string[] = [""];
  export let analysisText: string = "";

  const update = (text: string) => {
    // Split on comma and remove spaces
    const split = text.split(",").map((s) => s.trim());
    // If multiple authors, modify author list (insert the elements at the position of the current element)
    // ex: if authors = ["a", "b, c, d", "e"] and the current element is "b, c, d", then authors = ["a", "b", "c", "d", "e"]
    if (split.length > 1) {
      const i = authors.indexOf(text);
      authors[i] = split[0];
      authors.splice(i, 1, ...split);
    }
    return split[0];
  };
  let newPaper;
  async function save() {
    console.log("save");
    const resultMsg: string = await postPaperWithoutDOI(
      title,
      authors,
      year,
      url,
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
  <TextValue
    label="Title"
    style="width: 100%;"
    bind:value={title}
    focused={true}
  />
  <InputFormatDelList
    label="Author"
    bind:texts={authors}
    formatAction={update}
  />
  <TextValue
    label="Year"
    style="width: 100%;"
    bind:value={year}
    checker={(event) => {
      const keyPressed = event.key;
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Control",
        "Tab",
        "Home",
        "End",
        "ArrowUp",
        "ArrowDown",
      ];
      if (allowedKeys.includes(keyPressed)) return true;
      // Allow ctrl+c and ctrl+v, ctrl+a ...
      if (event.ctrlKey || event.metaKey) return true;
      // Case number: return true
      if (!isNaN(parseInt(keyPressed))) return true;
      return false;
    }}
  />
  <TextValue label="URL" style="width: 100%;" bind:value={url} />
</NewPaper>
