<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let tag_name: string = "";
  export let color: string = "transparent";
</script>

<button style={`background-color: ${color}`} on:click>{tag_name}</button>

<style>
  button {
    appearance: none; /* Remove default styling */
    padding: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 1em;
    border-radius: 0.5em;
    border: 1px solid var(--neutral-color);
    background-color: transparent;
    font-family: inherit;
    font-size: 0.75em;
    cursor: pointer;
    transition: all var(--transition-duration) ease-in-out;
    outline: none;
  }
  button:hover {
    background-color: var(--accent-color);
    color: white;
    border-color: white;
  }
  button:focus {
    background-color: var(--accent-color);
    color: white;
    border-color: white;
  }
</style>
