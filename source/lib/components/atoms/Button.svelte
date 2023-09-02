<script lang="ts">
  export let onClick: (() => void) | undefined = undefined;
  export let icon: boolean = false;
  export let disabled: boolean = false;
  export let variant: "primary" | "success" | "default" | "transparent" =
    "default";
  export let title: string | undefined = undefined;
  export let displayOnly: boolean = false;
</script>

{#if displayOnly}
  <span
    class="button"
    class:has-icon={icon}
    class:primary={variant === "primary"}
    class:transparent={variant === "transparent"}
  >
    <slot />
  </span>
{:else}
  <button
    on:click={onClick}
    type="button"
    class="button"
    class:has-icon={icon}
    class:primary={variant === "primary"}
    class:transparent={variant === "transparent"}
    {title}
    {disabled}
  >
    <span><slot /></span>
  </button>
{/if}

<style lang="scss">
  .button {
    --color: var(--color-accent-100);
    --text: currentColor;
    font-size: 1rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: var(--color);
    border: var(--border-width) solid var(--color);
    color: var(--text);
    text-align: center;
    font-family: inherit;
    font-weight: normal;
    padding: var(--spacing);
    border-radius: var(--border-radius);
    font-size: 0.9em;
    line-height: 1;
    white-space: nowrap;

    &:hover {
      --color: var(--color-accent-200);
    }

    &.has-icon {
      padding: var(--spacing);
      background: transparent;
      border-color: transparent;
      &.primary {
        color: var(--color-primary);
      }
    }

    &.primary {
      --color: var(--color-primary);
      --text: var(--color-background);

      &:hover {
        --color: var(--color-primary-500);
      }
    }

    &[disabled] {
      --color: var(--color-primary-500);
    }
  }
</style>
