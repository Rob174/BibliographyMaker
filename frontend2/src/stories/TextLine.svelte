<script lang="ts">
  /**An input field that can be used to enter text.
   * @param {label}{string} the text in front of the input
   * @param {text}{string} the text that is written inside the input
   * @fires change - when the text in the input is changed (with the text of the input)
   * 
  */
  import { createEventDispatcher } from "svelte";

  export let label: string = "____";
  export let text: string = "";

  const dispatch = createEventDispatcher();

  function handleInput(event: Event) {
    dispatch("change", (event.target as HTMLInputElement).value);
  }
  export function setText(text: string) {
    const inputField = document.getElementById(
      "inputField"
    ) as HTMLInputElement;
    inputField.value = text;
    inputField.focus();
    dispatch("change", text);
  }
</script>

<div class="input-container">
  <label class="label" for="inputField">{label}</label>
  <input
    class="input-field"
    type="text"
    id="inputField"
    on:input={(e) => handleInput(e)}
    on:focus={(e) => dispatch("focusInput")}
    on:blur={(e) => dispatch("blurInput")}
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
  input {
    border: none;
    border-bottom: 2px solid var(--neutral-color);
    transition: var(--transition-duration) border-bottom;
    flex-grow: 1;
    padding: 0.5rem;
  }
  input:focus {
    border-bottom: 3px solid var(--accent-color);
    outline: none;
  }
  input:hover {
    border: 1px solid var(--accent-color);
  }
  label {
    margin-right: 0.5rem;
  }
</style>
