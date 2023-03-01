<script lang="ts">
  import NewPaper from "./NewPaper.svelte";
  import TextValue from "../form_elems/TextValue.svelte";
  export let doi: string = "";
</script>

<NewPaper>
  <TextValue label="DOI" style="width: 100%;" bind:value={doi} focused={true} />
</NewPaper>