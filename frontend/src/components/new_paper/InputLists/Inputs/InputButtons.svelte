<script lang="ts">
  import TextValue from "../../../form_elems/TextValue.svelte";
  import IconButton from "@smui/icon-button/src/IconButton.svelte";
  import { createEventDispatcher } from "svelte";
  import Tooltip, { Wrapper } from '@smui/tooltip';
  const dispatch = createEventDispatcher();
  export let label = "";
  export let text = "";
  export let index = 0;
  export let className = "";
  export let buttons = ["format", "add", "delete", "switch"];
  export let tootipFormat = "Format";
  export let tooltipAdd = "Add";
  export let tooltipDelete = "Delete";
  export let tooltipSwitch = "Switch";
</script>

<div>
  <TextValue {label} {className} style="width: 100%;" bind:value={text} />
  {#if buttons.includes("format")}
    <Wrapper>
      <IconButton
        style="width: 1em; margin-left: 1em;"
        on:click={() => {
          dispatch("format", { index });
        }}
      >
        <i class="material-icons">cleaning_services</i>
      </IconButton>
      <Tooltip>{tootipFormat}</Tooltip>
    </Wrapper>
  {/if}
  {#if buttons.includes("switch")}
    <Wrapper>
      <IconButton
        style="width: 1em; margin-left: 1em;"
        on:click={() => {
          dispatch("switch", { index });
        }}
      >
        <i class="material-icons">swap_horiz</i>
      </IconButton>
      <Tooltip>{tooltipSwitch}</Tooltip>
    </Wrapper>
  {/if}
  {#if buttons.includes("add")}
    <Wrapper>
      <IconButton
        style="width: 1em; margin-left: 1em;"
        on:click={() => {
          dispatch("add", { index });
        }}
      >
        <i class="material-icons">add</i>
      </IconButton>
      <Tooltip>{tooltipAdd}</Tooltip>
    </Wrapper>
  {/if}
  {#if buttons.includes("delete")}
    <Wrapper>
      <IconButton
        style="width: 1em; margin-left: 1em;"
        on:click={() => {
          dispatch("delete", { index });
        }}
      >
        <i class="material-icons">delete</i>
      </IconButton>
      <Tooltip>{tooltipDelete}</Tooltip>
    </Wrapper>
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    color: white;
  }
</style>
