<script lang="ts">
  export let value: string;
  export let disabled: boolean = false;
</script>

<input type="text" bind:value {disabled} />

<style lang="scss">
  input {
    --color: var(--color-accent-200);
    border: var(--border-width) solid var(--color);
    background: var(--color-background);
    color: var(--color-text);
    padding: 0.2em;
    width: 100%;

    &[disabled] {
      opacity: 0.5;
    }
  }
</style>
