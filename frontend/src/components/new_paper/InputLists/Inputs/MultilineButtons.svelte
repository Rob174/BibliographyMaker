<script lang="ts">
  import IconButton from "@smui/icon-button/src/IconButton.svelte";
  import { createEventDispatcher } from "svelte";
  import Textfield from "@smui/textfield";
  const dispatch = createEventDispatcher();
  export let label = "";
  export let text = "";
  export let index = 0;
  export let buttons = ["format", "add", "delete"];
</script>

<div>
  <Textfield
    textarea
    bind:value={text}
    {label}
    style={"width: 100%; margin-bottom: 2em;"}
    on:keydown={(e) => {
      // Check if ctrl+enter is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        dispatch("change", { index });
      }
    }}
  />
  {#if buttons.includes("format")}
    <IconButton
      style="width: 1em; margin-left: 1em;"
      on:click={() => {
        dispatch("format", { index });
      }}
    >
      <i class="material-icons">cleaning_services</i>
    </IconButton>
  {/if}
  {#if buttons.includes("add")}
    <IconButton
      style="width: 1em; margin-left: 1em;"
      on:click={() => {
        dispatch("add", { index });
      }}
    >
      <i class="material-icons">add</i>
    </IconButton>
  {/if}
  {#if buttons.includes("delete")}
    <IconButton
      style="width: 1em; margin-left: 1em;"
      on:click={() => {
        dispatch("delete", { index });
      }}
    >
      <i class="material-icons">delete</i>
    </IconButton>
  {/if}
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
