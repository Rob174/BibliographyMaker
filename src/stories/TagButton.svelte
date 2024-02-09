
<script lang="ts">
  /** A tag element text that can be clicked as a button
   * *@param {tag_name}{string} the text to display inside the button
   * *@param {color}{string} the color of the button
   * *@fires click by event forwarding
  */
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
  button:active {
    background-color: white;
    color: black;
    border-color: black;
  }
</style>
