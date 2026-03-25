<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    name: string;
    value: number | string;
    label?: string;
    description?: string;
    disabled?: boolean;
  };

  let {
    name,
    value = $bindable(),
    label,
    description,
    disabled,
  }: Props = $props();

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
  <input {disabled} {id} bind:value {name} {type} />
{/snippet}

{#if label}
  <div class="wrapper">
    <label for={id}>{label}</label>
    {#if description}
      <p class="description">
        <small>{description}</small>
      </p>
    {/if}
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
    .wrapper:has(input[disabled]) & {
      opacity: 0.5;
    }
  }

  .description {
    margin-top: -0.5em;
    .wrapper:has(input[disabled]) & {
      opacity: 0.5;
    }
  }

  input {
    padding: var(--gutter);
    background-color: var(--color-accent);
    width: 100%;
    border-radius: var(--border-radius);
    border: 2px solid var(--color-accent);

    &[disabled] {
      background-color: color-mix(
        in oklab,
        var(--color-accent),
        var(--color-background) 50%
      );
      color: var(--color-accent);
      cursor: not-allowed;
    }

    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }
  }
</style>
