<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & {
    primary?: boolean;
    bordered?: boolean;
  };

  const {
    primary,
    bordered,
    children,
    type = "button",
    ...props
  }: Props = $props();
</script>

<button {type} class="u-focus" class:primary class:bordered {...props}>
  {@render children?.()}
</button>

<style lang="scss">
  button {
    --button-color: var(--color-accent);
    --color: var(--button-color);
    padding: var(--gutter);
    background-color: var(--color);
    text-align: center;
    border-radius: var(--border-radius);
    flex-shrink: 0;
    border: 2px solid var(--color);
    color: var(--color-text);

    :global(svg) {
      display: block;
    }

    &.primary {
      --button-color: var(--color-primary);
      color: var(--color-primary-text);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &:hover {
      --color: color-mix(in oklab, var(--button-color), white 15%);
    }

    &[disabled] {
      --button-color: color-mix(
        in oklab,
        var(--color-accent),
        var(--color-background) 50%
      );
      color: var(--color-accent);
      cursor: not-allowed;
    }

    &.bordered {
      border-color: var(--color);
      background-color: transparent;
      color: var(--color);

      &:hover {
        background-color: transparent;
      }
    }
  }
</style>
