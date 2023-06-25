<script lang="ts">
  import { onMount } from "svelte";
  import { restoreFromLocalStorage } from "./data";
  import Window from "./stories/Window.svelte";
  // Load from localStorage
  onMount(() => {
    restoreFromLocalStorage();
  });
</script>

<Window />

<style>
</style>
