<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & {
    primary?: boolean;
  };

  const { primary, children, type = "button", ...props }: Props = $props();
</script>

<button {type} class="u-focus" class:primary {...props}>
  {@render children?.()}
</button>

<style lang="scss">
  button {
    --color: var(--color-accent);
    padding: var(--gutter);
    background-color: var(--color);
    text-align: center;
    border-radius: var(--border-radius);
    flex-shrink: 0;

    :global(svg) {
      display: block;
    }

    &.primary {
      --color: var(--color-primary);
      color: var(--color-background);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &:hover {
      background-color: color-mix(in oklab, var(--color), white 15%);
    }

    &[disabled] {
      opacity: 0.6;
      background-color: var(--color-accent);
      cursor: not-allowed;
    }
  }
</style>
