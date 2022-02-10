<script lang="ts">
  import Flex from "./Flex.svelte";
  import IconRadioChecked from "./IconRadioChecked.svelte";
  import IconRadioUnchecked from "./IconRadioUnchecked.svelte";

  export let label: string;
  export let group: string;
  export let value: string;
</script>

<Flex>
  <label class="container">
    <input class="input" type="radio" bind:group {value} />
    <span class="icon-checked">
      <IconRadioChecked />
    </span>
    <span class="icon-unchecked">
      <IconRadioUnchecked />
    </span>
    <span class="label">{label}</span>
  </label>
  <slot />
</Flex>

<style lang="scss">
  .input {
    display: none;
    visibility: hidden;
  }

  .icon-checked {
    color: var(--color-primary);
  }

  .input:checked ~ .icon-unchecked {
    display: none;
    visibility: hidden;
  }
  .input:not(:checked) ~ .icon-checked {
    display: none;
    visibility: hidden;
  }

  .container {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .label {
    margin-left: var(--spacing);
  }
</style>
