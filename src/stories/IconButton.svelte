<script lang="ts">
  /**
   * @param {iconName}{string} the name of the icon to display (use material design icon names https://fonts.google.com/icons)
   * @fires change fired when we click on the button
  */
  import { createEventDispatcher } from "svelte";

  export let iconName: string = "close";

  const dispatch = createEventDispatcher();

  function handleInput(event: Event) {
    dispatch("change", (event.target as HTMLInputElement).value);
  }
</script>

<button class="input-container" on:click={(e) => handleInput(e)} on:blur={(e)=>dispatch("blur")}>
  <span class="material-symbols-outlined">
    {iconName}
  </span>
</button>

<style>
  @import "variables.css";
  @import "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
  .material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }
  .input-container {
    background: transparent;
    border: none;
    padding: 0.5em;
    margin: 0;
    border-radius: 6em;
    color: var(--neutral-color);
    transition: all var(--transition-duration) ease-in-out;
  }
  .input-container:hover {
    color: var(--accent-color);
    cursor: pointer;
  }
</style>
