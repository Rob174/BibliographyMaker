<script lang="ts">
  /** The reference text area with the dropdown to choose tags to attach to
   * *@param {string[]} {options} - the possible tags to choose from 
   * *@param {string} {text} - the text inside the text area
   * *@param {string[]} {attachedElements} - the tags to display above the text area
   * *@param {string} {label} - the label to display before the text area
   * *@fires {change} - when the text or the attached elements (tags) change
  */
  import TagButton from "./TagButton.svelte";
  import TextArea from "./TextArea.svelte";
  import { createEventDispatcher } from "svelte";

  export let options: string[] = ["test1", "test2"];
  export let text = "";
  export let attachedElements = [];
  export let label = "___";

  const dispatch = createEventDispatcher();
  let id = 0;
  let idSelect = 0;
  let textarea;
  let optionsList = ["..."];
  options.forEach((o) => optionsList.push(o));
  optionsList.sort();
  export function setText(t: string) {
    textarea.setText(t);
  }
</script>

<div id="tags">
  <div id="tags">
    {#key id}
      {#each attachedElements as element, i}
        <TagButton
          tag_name={element}
          on:click={(e) => {
            attachedElements = attachedElements.filter((e) => e != element);
            optionsList.push(element);
            optionsList.sort();
            idSelect++;
            id++;
            dispatch("change", { text, attached: attachedElements });
          }}
        />
      {/each}
    {/key}
  </div>
  <TextArea
    {text}
    {label}
    bind:this={textarea}
    on:change={(e) => {
      text = e.detail;
      dispatch("change", { text, attached: attachedElements });
    }}
  >
    {#key idSelect}
      <select
        on:change={(e) => {
          // IF not the first element
          if (!e.target.value.includes(".")) {
            attachedElements.push(e.target.value);
            attachedElements.sort();
            optionsList = optionsList.filter((o) => o !== e.target.value);
            // select the first option back
            document.querySelector("#tags select").selectedIndex = 0;
            id++;
            dispatch("change", { text, attached: attachedElements });
          }
        }}
      >
        {#each optionsList as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    {/key}
    <slot />
  </TextArea>
</div>

<style>
  /* Styling the select element */
  select {
    appearance: none; /* Remove default styling */
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    width: auto;
    margin-left: 1em;
    margin-right: 1em;
  }

  /* Styling the dropdown arrow */
  select::-ms-expand {
    display: none; /* Remove IE arrow */
  }

  select::after {
    content: "\25BE"; /* Unicode character for down arrow */
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none; /* Prevent click events on the arrow */
  }

  /* Styling the dropdown options */
  select option {
    padding: 8px;
  }
  select:focus {
    outline: none;
    border: 4px solid var(--accent-color);
  }
</style>
