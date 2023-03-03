<script lang="ts">
  import TextValue from "../../../form_elems/TextValue.svelte";
  export let label = "";
  export let text = "";
  export let className = "";
</script>

<div>
  <TextValue {label} {className} style="width: 100%;" bind:value={text} />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    color: white;
  }
</style>
