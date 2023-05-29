<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function handleInput(event: Event) {
    dispatch("change", event.target.checked);
  }
  export let label: string = "close";
  </script>

<div class="switch-container">
  <input type="checkbox" id="mySwitch" on:change={e=>handleInput(e)}/>
  <label class="slider" for="mySwitch" />
  <span class="label-text">{label}</span>
</div>

<style>
  /* Switch container */
  .switch-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Switch slider */
  .slider {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
    background-color: #ccc;
    border-radius: 12px;
    cursor: pointer;
    transition: all var(--transition-duration) ease-in-out;
  }

  /* Slider before state (unchecked) */
  .slider::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }

  /* Checked state */
  input:checked + .slider::before {
    transform: translateX(24px);
  }
  input {
    display: none;
  }

  input:checked + .slider {
    background-color: var(--accent-color);
  }
  /* Label text */
  .label-text {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }
</style>
