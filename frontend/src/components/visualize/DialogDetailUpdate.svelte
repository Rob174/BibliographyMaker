<script lang="ts">
  import { nodesMetadata } from "../../data";
  import DialogDetail from "./DialogDetail.svelte";
  import { selectedNode } from "./svgUpdate";
  let selNode;
  selectedNode.subscribe((value) => {
    return (selNode = value);
  });
  let status: "todo"|"done" = "todo";
  nodesMetadata.subscribe((metadata) => {
    if (selNode.selectedNode === null || !metadata.has(selNode.selectedNode.id)) return metadata;
    status = metadata
      .get(selNode.selectedNode.id)
      .tags.filter((tag) => Array.from(["todo", "done"]).includes(tag))
      .filter((tag) => tag !== "todo")[0];
  });
</script>

{#if selNode.selectedNode !== null}
  {#key selNode.id}
    <DialogDetail
      element={selNode.selectedNode}
      on:close={() =>
        selectedNode.update((value) => {
          return { selectedNode: null, id: value.id };
        })}
      open={true}
      status={status}
    />
  {/key}
{/if}
