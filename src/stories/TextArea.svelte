<script lang="ts">
  /**A textarea to that allows to set the text from the outside with setText
   * *@param {label}{string} the label in front of the textarea
   * *@param {text}{string} the text in the textarea
   * *@fires change{string} when the text in the textarea changes (with the new text)
   * *@slot - to put elements on the same line, after the textarea
  */
  import { createEventDispatcher } from "svelte";

  export let label: string = "____";
  export let text: string = "";

  const dispatch = createEventDispatcher();
  function handleInput(event: Event) {
    dispatch("change", (event.target as HTMLInputElement).value);
  }
  export function setText(t: string) {
    text = t;
  }
</script>

<div class="input-container">
  <label class="label" for="inputField">{label}</label>
  <textarea
    class="input-field"
    id="inputField"
    on:input={(e) => handleInput(e)}
    value={text}
  />
  <slot />
</div>

<style>
  @import "variables.css";
  div {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    width: 100%;
  }
  textarea {
    border: 2px solid var(--neutral-color);
    transition: var(--transition-duration) border-bottom;
    flex-grow: 1;
    padding: 0.5rem;
    border-radius: 4px;
  }
  textarea:focus {
    border: 3px solid var(--accent-color);
    outline: none;
  }
  textarea:hover {
    border: 1px solid var(--accent-color);
  }
  label {
    margin-right: 0.5rem;
  }
</style>
