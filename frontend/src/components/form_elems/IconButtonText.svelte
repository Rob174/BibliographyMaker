<script lang="ts">
  import IconButton from "@smui/icon-button";
  import { createEventDispatcher } from "svelte";
  export let text = "";
  export let icon = "search";
  const dispatch = createEventDispatcher();
  export let style = "";
</script>

<div id="main" {style}>
  <div
    class="icon-button-text"
    on:click={() => dispatch("click")}
    on:keydown={() => dispatch("click")}
  >
    <IconButton
      class="material-icons"
      size="normal">{icon}</IconButton
    >
    <div id="text">{text}</div>
  </div>
</div>

<style>
  .icon-button-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  #text {
    font-size: 0.8em;
    margin-top: 0.5em;
  }
  #main {
    width: fit-content;
    height: fit-content;
    margin: 1em;
  }
</style>
