<script lang="ts">
  import Textfield from "@smui/textfield";
  import IconButton from "@smui/icon-button";
  import { createEventDispatcher } from "svelte";
  export let text: string = "";
  export let className = "";
  const dispatch = createEventDispatcher();
  export let index: number;
  export let label = "Relevant text";
  export let style="";
  function cleaning() {
    // Remove back to line
    text = text.replace("\n", " ");
    // Remove duplicate spaces
    text = text.replace(/\s+/g, " ");  
    
  }
</script>

<div style={"width: 100%;"+style} class={className+" div-relevant"}>
  <!-- Make textfield adapt to text number of lines -->
  <Textfield
    textarea
    bind:value={text}
    label={label}
    style={"width: 100%; margin-bottom: 2em;"}
    
  />
  <div class="icons">
    <IconButton
      class="material-icons"
      on:click={cleaning}>cleaning_services</IconButton
    >
  <IconButton
    class="material-icons"
    on:click={() => dispatch("remove", { index })}>delete</IconButton
  >
</div>
</div>

<style>
  .div-relevant {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .div-relevant > .icons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
