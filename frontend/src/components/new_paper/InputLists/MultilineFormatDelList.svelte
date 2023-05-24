<script lang="ts">
  import MultilineFormatDel from "./Inputs/MultilineButtons.svelte";
  import { v4 as uuidv4 } from "uuid";
  import TagsPossibilities from "./TagsPossibilities.svelte";
  const getEmptyText = () => {
    return { text: "", tags: [] };
  };
  export let textsObj: {
    text: string;
    tags: string[];
  }[] = [getEmptyText()];
  export let label: string = "";
  export let className = "a" + uuidv4().replace(/-/g, "").slice(0, 10);
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
  export let tooltipFormat = "Format";
  export let tooltipAdd = "Add";
  export let tooltipDelete = "Delete";
  export let possibleTags: string[];
</script>

<div class={className}>
  {#key update}
    {#each textsObj as { }, i (i)}
      <TagsPossibilities
        bind:possibilities={possibleTags}
        bind:selected={textsObj[i].tags.filter((e) => e.length > 0)}
      />
      <MultilineFormatDel
        bind:text={textsObj[i].text}
        {label}
        on:format={() => {
          textsObj[i].text = formatAction(textsObj[i].text);
          delayedFocus(i);
          update++;
        }}
        tootipFormat={tooltipFormat}
        on:add={() => {
          // Insert a new text after the current one
          textsObj = [
            ...textsObj.slice(0, i + 1),
            getEmptyText(),
            ...textsObj.slice(i + 1),
          ];
          delayedFocus(i + 1);
          update++;
        }}
        {tooltipAdd}
        on:change={() => {
          // Insert a new text after the current one
          textsObj = [
            ...textsObj.slice(0, i + 1),
            getEmptyText(),
            ...textsObj.slice(i + 1),
          ];
          delayedFocus(i + 1);
          update++;
        }}
        on:delete={() => {
          textsObj.splice(i, 1);
          if (textsObj.length === 0) {
            textsObj.push(getEmptyText());
          }
          update++;
          delayedFocus(textsObj.length - 1);
          update++;
        }}
        {tooltipDelete}
      />
    {/each}
  {/key}
</div>

<style>
  div {
    width: 100%;
  }
</style>
