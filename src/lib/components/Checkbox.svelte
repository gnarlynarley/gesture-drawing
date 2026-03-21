<script lang="ts">
  type Props = {
    checked: boolean;
    name: string;
    label?: string;
    description?: string;
  };

  let { checked = $bindable(), name, label, description }: Props = $props();
  const id = $props.id();
</script>

{#snippet checkbox()}
  <div class="checkbox">
    <input {id} {name} type="checkbox" bind:checked />
  </div>
{/snippet}

{#if label}
  <label for={id} class="wrapper">
    {@render checkbox()}
    <span>{label}</span>
    {#if description}
      <small>({description})</small>
    {/if}
  </label>
{:else}
  {@render checkbox()}
{/if}

<style>
  .wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--gutter);
  }

  .checkbox {
    --offset: 2px;
    --size: 1.6em;
    --color: var(--color-accent);
    position: relative;
    width: var(--size);
    height: var(--size);
    border-radius: var(--border-radius);
    background: var(--color-background);
    border: 2px solid var(--color);

    &:has(input:focus-visible) {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    input {
      width: 0;
      height: 0;
      position: absolute;

      &:focus {
        outline: none;
      }
    }

    &:has(input:checked)::after {
      content: "";
      display: block;
      position: absolute;
      top: var(--offset);
      left: var(--offset);
      width: calc(100% - (var(--offset) * 2));
      height: calc(100% - (var(--offset) * 2));
      background: var(--color);
      border-radius: calc(var(--border-radius) - var(--offset));
    }

    &:has(input:checked) {
      --color: var(--color-primary);
    }
  }
</style>
