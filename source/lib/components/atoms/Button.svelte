<script lang="ts">
  export let onClick: (() => void) | undefined = undefined;
  export let icon: boolean = false;
  export let disabled: boolean = false;
  export let variant: "primary" | "success" | "default" = "default";
  export let title: string | undefined = undefined;
</script>

<button
  on:click={onClick}
  type="button"
  class="button"
  class:has-icon={icon}
  class:primary={variant === "primary"}
  {title}
  {disabled}
>
  <slot />
</button>

<style lang="scss">
  $spacing: 0.2em;
  .button {
    --color: var(--color-accent-500);
    --text: currentColor;
    background: var(--color);
    border: var(--border-width) solid var(--color);
    color: var(--text);
    text-align: center;
    font-size: 1em;
    font-family: inherit;
    padding: $spacing 0.8em;
    border-radius: var(--border-radius);
    font-weight: normal;

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
    }

    &[disabled] {
      opacity: 0.5;
    }
  }
</style>
