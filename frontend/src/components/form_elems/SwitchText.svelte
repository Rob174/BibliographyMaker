<script lang="ts">
    import Switch from "@smui/switch";
    import FormField from '@smui/form-field';
  import { createEventDispatcher } from "svelte";
    export let done = false;
    export let label = "TODO";
    export let style;
    const dispatch = createEventDispatcher();
  </script>

<div {style}>
  <FormField>
    <Switch value={done} on:SMUISwitch:change={
      (e) => {
        label = e.detail.selected ? "DONE" : "TODO";
        dispatch("change", label.toLowerCase());
      }
    }/>
    <span slot="label">{label}</span>
  </FormField>
</div>
