<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import AutocompleteButtons from "./Inputs/AutocompleteButtons.svelte";
  export let texts: string[] = [""];
  export let label: string = "";
  export let className = "a" + uuidv4().replace(/-/g, "").slice(0, 10);
  let update = 0;
  function delayedFocus(i: number) {
    setTimeout(() => {
      const input = document.querySelectorAll(`.${className} input`)[i];
      if (input instanceof HTMLInputElement) input.focus();
    }, 100);
  }
  export let formatAction = (text: string) => {
    return text;
  };
  export let possibleValues;
  $:{
    if(!possibleValues) {
      possibleValues = [];
    }
  }
</script>

<div class={className}>
  {#key update}
    {#each texts as { }, i (i)}
      <AutocompleteButtons
        {className}
        bind:text={texts[i]}
        {label}
        {possibleValues}
        on:format={() => {
          texts[i] = formatAction(texts[i]);
          delayedFocus(i);
          update++;
        }}
        on:add={() => {
          // Insert a new text after the current one
          texts = [...texts.slice(0, i + 1), "", ...texts.slice(i + 1)];
          delayedFocus(i + 1);
          update++;
        }}
        on:delete={() => {
          texts.splice(i, 1);
          if (texts.length === 0) {
            texts.push("");
          }
          update++;
          delayedFocus(texts.length - 1);
          update++;
        }}
      />
    {/each}
  {/key}
</div>

<style>
  div {
    width: 100%;
  }
</style>
