<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import * as FlatColors  from "flat-colors";
  import tinycolor from 'tinycolor2';
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
  $: {
    if (!possibleValues) {
      possibleValues = [];
    }
  }
  export let colors = [];
  $: {
    colors = [];
    for (let i = 0; i < texts.length; i++) {
      const hueId = i;
      const hue = (hueId * 360) / texts.length;
      const color = tinycolor({h: hue, s: 75, l: 50}).toHexString();
      const flatColor = FlatColors(color)
      colors.push(`rgb(${flatColor[0]}, ${flatColor[1]}, ${flatColor[2]})`);
    }
  }
</script>

<div class={className}>
  {#key update}
    {#each texts as { }, i (i)}
      <div class="elem">
        <div class="id-complete" style={`background-color: ${colors[i]};`}>
          <span class="number">{i + 1}</span>
        </div>
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
          on:enter={() => {
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
      </div>
    {/each}
  {/key}
</div>

<style>
  div {
    width: 100%;
  }
  .id-complete {
    display: inline-block;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    text-align: center;
    color: white;
    margin-right: 2em;
    transform: translateY(1em);
  }

  .number {
    line-height: 2em;
    font-size: 1.5em;
  }
  .elem {
    display: flex;
    align-items: top;
    margin-bottom: 1em;
  }
</style>
