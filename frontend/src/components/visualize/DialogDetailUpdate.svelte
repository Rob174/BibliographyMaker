<script lang="ts">
  import DialogDetail from "./DialogDetail.svelte";
  import {
    selectedNode
  } from "./svgUpdate";
  let selNode;
  selectedNode.subscribe((value) => (selNode = value));
</script>

{#if selNode.selectedNode}
  {#key selNode.id}
    <DialogDetail
      element={selNode.selectedNode !== null ? selNode.selectedNode : null}
      on:close={() =>
        selectedNode.update((value) => {
          return { selectedNode: null, id: value.id };
        })}
      open={selNode.selectedNode !== null ? true : false}
    />
  {/key}
{/if}
