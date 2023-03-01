<script lang="ts">
  import MultilineFormatDel from "./Inputs/MultilineButtons.svelte";
  import { v4 as uuidv4 } from "uuid";
  export let texts: string[] = [""];
  export let label: string = "";
  export let className = "a"+uuidv4().replace(/-/g, "").slice(0, 10);
  let update = 0;
  function delayedFocus(i: number) {
    setTimeout(() => {
      const input = document.querySelectorAll(`.${className} textarea`)[i];
      if (input instanceof HTMLTextAreaElement) input.focus();
    }, 100);
  }
  export let formatAction = (text: string) => {
    return text;
  };
</script>

<div class={className}>
  {#key update}
    {#each texts as { }, i (i)}
      <MultilineFormatDel
        bind:text={texts[i]}
        {label}
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
        on:change={() => {
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
