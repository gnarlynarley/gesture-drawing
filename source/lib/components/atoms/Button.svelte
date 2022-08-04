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
  $spacing: 0.2em;
  .button {
    --color: var(--color-accent-100);
    --text: currentColor;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: var(--color);
    border: var(--border-width) solid var(--color);
    color: var(--text);
    text-align: center;
    font-size: 1em;
    font-family: inherit;
    padding: ($spacing * 2) 0.8em $spacing;
    border-radius: var(--border-radius);
    font-weight: normal;
    font-size: 0.9em;
    line-height: 1;
    white-space: nowrap;

    &:hover {
      --color: var(--color-accent-200);
    }

    &.has-icon {
      padding: $spacing;
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

    &.transparent {
      background: transparent;
      border-color: transparent;
    }

    &[disabled] {
      --color: var(--color-primary-500);
    }
  }
</style>
