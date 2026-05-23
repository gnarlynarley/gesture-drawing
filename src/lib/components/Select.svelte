<script lang="ts" generics="T extends string">
  type Props = {
    items: T[];
    value: T;
    label?: string;
    description?: string;
  };

  let { value = $bindable(), items, label, description }: Props = $props();
  const id = $props.id();
</script>

{#snippet input()}
  <select {id} bind:value>
    {#each items as item}
      <option value={item}>{item}</option>
    {/each}
  </select>
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

<style lang="scss">
  .wrapper {
    display: grid;
    gap: var(--gutter);
  }

  label {
    flex-shrink: 0;
    flex-grow: 1;
  }

  .description {
    margin-top: -0.5em;
  }

  select,
  ::picker(select) {
    appearance: base-select;
  }

  select {
    padding: var(--gutter);
    background-color: var(--color-accent);
    width: 100%;
    border-radius: var(--border-radius);
    border: 2px solid var(--color-accent);

    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }

    &::picker-icon {
      color: currentColor;
    }
  }

  ::picker(select) {
    background-color: var(--color-accent);
    border: none;
    border-radius: var(--border-radius);
    overflow: visible;
  }

  option {
    display: flex;
    padding: var(--gutter);
    color: var(--color-text);

    &:checked {
      font-weight: bold;
    }

    &:first-child {
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);
    }
    &:last-child {
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    &::checkmark {
      order: 1;
      margin-left: auto;
      content: "✓";
    }

    &:hover,
    &:focus-visible {
      background-color: color-mix(
        in oklab,
        var(--color-accent),
        var(--color-text) 15%
      );
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }
</style>
