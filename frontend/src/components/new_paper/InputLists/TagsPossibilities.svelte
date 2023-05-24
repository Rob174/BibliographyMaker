<script lang="ts">
  import Chip, { Set, Text } from "@smui/chips";
  import type { Writable } from "svelte/store";
  export let possibilitiesStore: Writable<string[]>;
  export let selectedStore: Writable<string[]>;
  let possibilities = []
  let selected = []
  possibilitiesStore.subscribe((e)=>(possibilities=e))
  selectedStore.subscribe((e)=>(selected=e))
</script>

<div>
  {#if possibilities.filter(e=>e.length>0).length > 0}
    <Set chips={possibilities} let:chip filter bind:selected>
      <Chip {chip} touch>
        <Text>{chip}</Text>
      </Chip>
    </Set>
  {/if}
</div>

<style>
</style>
