<script lang="ts">
  import TextValue from "../form_elems/TextValue.svelte";
  import IconButton from "@smui/icon-button/src/IconButton.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let label = "";
  export let text = "";
  export let index = 0;
  export let className = "";
  export let possibleValues = [];
  let suggestions = [];
  let selectedSuggestion = -1;
  $: {
    // With current text, find all possible values that match
    if (!possibleValues) {
      possibleValues = [];
    }
    suggestions = possibleValues.filter((value) => {
      return value.toLowerCase().includes(text.toLowerCase());
    });
  }
  import { v4 as uuidv4 } from "uuid";
  let uniqClass = "a" + uuidv4().replace(/-/g, "").slice(0, 10);
  function acceptSuggestion(sugg) {
    text = sugg;
    // Put cursor at end of text
    const i = document.querySelectorAll("." + uniqClass + " input")[0];
    if (i instanceof HTMLInputElement)
      i.setSelectionRange(text.length, text.length);
  }
  function selectSuggestion(i) {
    selectedSuggestion = i;
    // Put focus on suggestion
    const sugg = document.querySelectorAll(".suggestion")[i];
    if (sugg instanceof HTMLDivElement) sugg.focus();
  }
  let focused = false;
  let suggKey = 0;
</script>

<div
  class="main"
  on:focus={() => {
    focused = true;
  }}
  on:focusout={(event) => {
    // Check if focus is on a suggestion
    const sugg = document.querySelectorAll(".suggestion");
    for (let i = 0; i < sugg.length; i++) {
      if (sugg[i] === event.relatedTarget) {
        return;
      }
    }
    focused = false;
  }}
>
  <div class="sub1">
    {#key suggKey}
      {#if focused}
        {#if suggestions.length > 0}
          <div class="sub2">
            {#each suggestions as suggestion}
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <div
                class="suggestion"
                style="{selectedSuggestion === suggestions.indexOf(suggestion)
                  ? 'background-color: lightgray'
                  : ''};"
                tabindex="0"
                on:click={() => {
                    console.log("clicking suggestion " + selectedSuggestion);
                  acceptSuggestion(suggestion);
                  selectedSuggestion = -1;
                  const i = document.querySelectorAll(
                    "." + uniqClass + " input"
                  )[0];
                  if (i instanceof HTMLInputElement) i.focus();
                }}
                on:keydown={(e) => {
                  if (e.key === "Enter") {
                    acceptSuggestion(suggestion);
                    selectedSuggestion = -1;
                    const i = document.querySelectorAll(
                      "." + uniqClass + " input"
                    )[0];
                    if (i instanceof HTMLInputElement) i.focus();
                    e.preventDefault();
                  }
                  // If tab or down key, move to next suggestion
                  else if (e.key === "ArrowDown") {
                    const i = suggestions.indexOf(suggestion);
                    if (i < suggestions.length - 1) {
                      selectSuggestion(i + 1);
                    }
                    e.preventDefault();
                  }
                  // If up key, move to previous suggestion
                  else if (e.key === "ArrowUp") {
                    const i = suggestions.indexOf(suggestion);
                    if (i > 0) {
                      selectSuggestion(i - 1);
                    }
                    // If first suggestion, move to text input
                    else {
                      selectedSuggestion = -1;
                      const i = document.querySelectorAll(
                        "." + uniqClass + " input"
                      )[0];
                      if (i instanceof HTMLInputElement) i.focus();
                    }
                    e.preventDefault();
                  }
                }}
                on:focusin={() => {
                  selectedSuggestion = suggestions.indexOf(suggestion);
                  console.log("selected suggestion " + selectedSuggestion);
                }}
              >
                {suggestion}
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    {/key}
    <div style="padding-right: 2em; padding-left: 2em; padding-bottom: 0.5em;">
      <TextValue
        {label}
        className={className + " " + uniqClass}
        style="width: 100%;"
        bind:value={text}
        on:keydown={(e) => {
          if (e.detail.key === "ArrowDown") {
            if (selectedSuggestion < suggestions.length - 1) {
              selectSuggestion(0);
              console.log("selecting suggestion " + selectedSuggestion);
            }
            e.detail.preventDefault();
          }
          if (e.detail.key === "Enter") {
            console.log("entering suggestion " + selectedSuggestion, possibleValues);
            dispatch("enter", { content: text });
          }
        }}
      />
    </div>
  </div>
</div>

<style>
  .main {
    width: 100%;
    margin-bottom: 2em;
  }
  .sub1 {
    width: 100%;
  }
  .sub2 {
    width: 100%;
    z-index: 1;
    border: 1px solid hsla(0, 0%, 100%, 0.25);
    border-top: none;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    overflow-x: hidden;
    --size: calc(3em * 3);
    min-height: 0;
    max-height: var(--size);
    overflow-y: scroll;
  }
  .suggestion {
    width: 100%;
    padding: 0.5em;
    cursor: pointer;
  }
  .suggestion:hover {
    background-color: hsla(0, 0%, 100%, 0.25);
  }
  .suggestion:last-child {
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
</style>
