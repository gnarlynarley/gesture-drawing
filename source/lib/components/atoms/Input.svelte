<script lang="ts">
  export let value: string | number;
  export let disabled: boolean = false;
  export let label: string | null = null;

  const id = Math.random().toString();
</script>

<div>
  {#if label !== null}
    <label for={id}>
      {label}
    </label>
  {/if}
  {#if typeof value === "number"}
    <input {id} type="number" bind:value {disabled} />
  {:else}
    <input {id} type="text" bind:value {disabled} />
  {/if}
</div>

<style lang="scss">
  input {
    --color: var(--color-accent-200);
    border: var(--border-width) solid var(--color);
    background: var(--color-background);
    color: var(--color-text);
    padding: var(--spacing);
    width: 100%;

    &[disabled] {
      opacity: 0.5;
    }
  }
</style>
