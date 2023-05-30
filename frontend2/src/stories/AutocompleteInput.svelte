<script lang="ts">
  import { onMount } from "svelte";
  import TextLine from "./TextLine.svelte";
  import { clickOutside } from "./clickOutside";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let label: string = "";
  export let possibilities: string[] = [];
  // Matching possibilities will
  let matchingPossibilities = [...possibilities];
  let id = 0;
  // Function to update matchingPossibilities based on the input text
  function updateMatchingPossibilities(text: string) {
    if (text.length === 0) {
      matchingPossibilities = [...possibilities];
    } else {
      matchingPossibilities = possibilities.filter((p) => p.includes(text));
    }
    id++;
    dispatch("change", text ? text : "");
  }

  onMount(() => {
    // Initialize matchingPossibilities on mount
    matchingPossibilities = [...possibilities];
  });
  let focused = false;
  function clickPoss(poss) {
    text = poss;
    id++;
    const e = document.querySelector("#autocomplete input");
    e.focus();

    updateMatchingPossibilities(poss);
  }
  let selectedPossId = -1;
  function setClass(selected) {
    selectedPossId = selected;
    const poss = document.querySelectorAll(".possibility");
    poss.forEach((element, i) => {
      if (i != selected) element.classList.remove("selected-poss");
    });
    document.getElementById(`poss-${selected}`).classList.add("selected-poss");
  }
  function circularId(id, length) {
    if (id < 0) return id + length;
    if (id >= length) return id - length;
    return id;
  }
  export function setFocus(focus) {
    focused = focus;
  }
  export let text: string = "";
  dispatch("outOfFocus", {
    on: () => {
      console.log("1");
      focused = false;
    },
  });
</script>

<div
  id="autocomplete"
  use:clickOutside
  on:click_outside={(e) => {
    focused = false;
  }}
  on:blur={(e) => {
    focused = false;
  }}
>
  <div
    on:keydown={(e) => {
      // If down arrow increase selectedPossId, else decrease it. Modulo number of matchingPossibilities
      // If down arrow increase selectedPossId
      if (e.key === "ArrowDown") {
        selectedPossId = circularId(
          selectedPossId + 1,
          matchingPossibilities.length
        );
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        selectedPossId = circularId(
          selectedPossId - 1,
          matchingPossibilities.length
        );
        e.preventDefault();
      }
      if (Array.from(["ArrowDown", "ArrowUp"]).includes(e.key)) {
        setClass(selectedPossId);
      }
    }}
  >
    <TextLine
      {label}
      {text}
      on:change={(text) => {
        updateMatchingPossibilities(text.detail);
      }}
      on:focusInput={(e) => (focused = true)}
    >
      <slot name="after" />
    </TextLine>
  </div>
  {#if focused}
    <div id="container">
      {#key id}
        {#each matchingPossibilities as possibility, i}
          {#if i < matchingPossibilities.length - 1}
            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
            <button
              class="possibility"
              id={`poss-${i}`}
              on:click={() => clickPoss(possibility)}
              on:keypress={(e) => {
                if (e.key === "Enter") clickPoss(possibility);
              }}
              tabindex="-1"
              on:mouseenter={(e) => {
                setClass(i);
              }}>{possibility}</button
            >
          {:else}
            <button
              class="possibility"
              id={`poss-${i}`}
              on:click={() => clickPoss(possibility)}
              on:keypress={(e) => {
                if (e.key === "Enter") clickPoss(possibility);
              }}
              tabindex="-1"
              on:mouseenter={(e) => {
                setClass(i);
              }}
              on:blur={(e) => (focused = false)}>{possibility}</button
            >
          {/if}
        {/each}
      {/key}
    </div>
  {/if}
</div>

<style>
  button {
    appearance: none;
    width: 100%;
    border: none;
    padding: 0.5em;
    margin: 0;
    text-align: left;
  }
  :global(.selected-poss) {
    background: var(--neutral-color);
    color: var(--accent-color);
  }
  #container {
    border: 1px solid var(--neutral-color);
    border-radius: 0em 0em 1em 1em;
    overflow: hidden;
  }
</style>
