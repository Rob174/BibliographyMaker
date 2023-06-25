<script lang="ts">
  /**
   * A button with a text inside that takes all of the width
   * @param {label}{string} the text to display on the button
   * @fires click
  */
  import { createEventDispatcher } from "svelte";
  export let label: string = "click me!";
  const dispatch = createEventDispatcher();
</script>

<button on:click={(e) => dispatch("click")} on:keydown>
  {label}
</button>

<style>
  button {
    width: 100%;
    appearance: none;
    border: 1px solid var(--neutral-color);
    border-radius: 0.5em;
    background-color: transparent;
    transition: all var(--transition-duration) ease-in-out;
    padding: 0.5em;
    color: var(--neutral-color);
    cursor: pointer;
    margin-top: 1em;
  }
  button:hover {
    border: 2px solid var(--accent-color);
    /* Put in bold*/
    font-weight: 700;
    color: var(--accent-color)
  }
  button:active, button:focus {
    border: 2px solid var(--neutral-color);
    background-color: var(--accent-color);
    color: white;
  }
</style>
