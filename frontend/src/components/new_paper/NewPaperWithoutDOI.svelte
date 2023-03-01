<script lang="ts">
  import NewPaper from "./NewPaper.svelte";
  import TextValue from "../form_elems/TextValue.svelte";
  import InputFormatDelList from "./InputLists/InputFormatDelList.svelte";
  export let title: string = "";
  export let authors: string[] = [""];
  export let year: string = "";
  export let url: string = "";
</script>

<NewPaper>
  <TextValue
    label="Title"
    style="width: 100%;"
    bind:value={title}
    focused={true}
  />
  <InputFormatDelList
    label="Author"
    bind:texts={authors}
  />
  <TextValue label="Year" style="width: 100%;" bind:value={year} />
  <TextValue label="URL" style="width: 100%;" bind:value={url} />
</NewPaper>
