<script lang="ts">
  import { nodesMetadata } from "../../data";
  import DialogDetail from "./DialogDetail.svelte";
  import { selectedNode } from "./svgUpdate";
  let selNode = { selectedNode: null, id: -1 };
  let id = -1;
  let open = false;
  selectedNode.subscribe((value) => {
    id++;
    return (selNode = value);
  });
  let status: "todo" | "done" = "todo";
  nodesMetadata.subscribe((metadata) => {
    // id++;
    if (selNode.selectedNode === null || !metadata.has(selNode.selectedNode.id))
      return metadata;
    status = metadata
      .get(selNode.selectedNode.id)
      .tags.filter((tag) => Array.from(["todo", "done"]).includes(tag))
      .filter((tag) => tag !== "todo")[0] as "todo" | "done";
  });
  $: open = selNode.selectedNode !== null;
</script>

{#if selNode.selectedNode !== null}
  {#key id}
    <DialogDetail
      element={selNode.selectedNode}
      on:close={() =>
        selectedNode.update((value) => {
          open = false;
          return { selectedNode: null, id: value.id };
        })}
      {status}
      bind:open
    />
  {/key}
{/if}
