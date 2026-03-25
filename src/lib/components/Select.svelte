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
  <select bind:value>
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

<style>
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
  }
</style>
