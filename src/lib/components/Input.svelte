<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    name: string;
    value: number | string;
    label?: string;
  };

  let { name, value = $bindable(), label }: Props = $props();

  const type = $derived.by((): HTMLInputAttributes["type"] => {
    switch (typeof value) {
      case "boolean":
        return "checkbox";
      case "number":
        return "number";
      default:
        return "text";
    }
  });
  const id = $props.id();
</script>

{#snippet input()}
  <input {id} bind:value {name} {type} />
{/snippet}

{#if label}
  <div class="wrapper">
    <label for={id}>{label}</label>
    {@render input()}
  </div>
{:else}
  {@render input()}
{/if}

<style>
  .wrapper {
    display: grid;
    gap: var(--gutter);
  }

  label {
    flex-shrink: 0;
    flex-grow: 1;
  }

  input {
    padding: var(--gutter);
    background-color: var(--color-accent);
    width: 100%;
    border-radius: var(--border-radius);
    border: 2px solid var(--color-accent);

    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }
  }
</style>
