<script lang="ts">
  import { othersShownStore } from "../../data";
  import IconButtonText from "../form_elems/IconButtonText.svelte";

  let othersShown = false;
  othersShownStore.subscribe((value) => {
    othersShown = value;
  });
</script>

{#if othersShown}
  <IconButtonText
    text="Hide others&nbsp;&nbsp;"
    icon="visibility_off"
    on:click={() => {
      othersShownStore.set(false);
    }}
  />
{:else}
  <IconButtonText
    text="Show others"
    icon="visibility"
    on:click={() => {
      othersShownStore.set(true);
    }}
  />
{/if}