<script lang="ts">
  import TextValue from "../../../form_elems/TextValue.svelte";
  import IconButton from "@smui/icon-button/src/IconButton.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let label = "";
  export let text = "";
  export let index = 0;
  export let className = "";
  export let buttons = ["format", "add", "delete"];
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
