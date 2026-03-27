<script lang="ts">
  import type {
    HTMLButtonAttributes,
    MouseEventHandler,
  } from "svelte/elements";
  import Tooltip from "./Tooltip.svelte";

  type Props = HTMLButtonAttributes & {
    primary?: boolean;
    bordered?: boolean;
    tooltip?: string;
  };

  const {
    primary,
    bordered,
    children,
    type = "button",
    tooltip,
    onclick,
    ...props
  }: Props = $props();
  let pending = $state(false);

  const onclickHandler: MouseEventHandler<HTMLButtonElement> = async (ev) => {
    try {
      pending = true;
      await onclick?.(ev);
    } catch (err) {
      throw err;
    } finally {
      pending = false;
    }
  };
</script>

{#snippet button()}
  <button
    {type}
    class:pending
    class:primary
    class:bordered
    onclick={onclickHandler}
    {...props}
  >
    <span class="inner">
      {@render children?.()}
    </span>
  </button>
{/snippet}

{#if tooltip}
  <Tooltip>
    {#snippet tooltip()}
      <span>{tooltip}</span>
    {/snippet}
    {@render button()}
  </Tooltip>
{:else}
  {@render button()}
{/if}

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
    position: relative;

    &.pending {
      &::after {
        --size: 1em;
        content: "";
        display: block;
        width: 1em;
        height: 1em;
        border: 3px solid currentColor;
        border-top-color: transparent;
        position: absolute;
        top: calc(50% - (var(--size) * 0.5));
        left: calc(50% - (var(--size) * 0.5));
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .inner {
        opacity: 0;
      }
    }

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

  @keyframes spin {
    from {
      rotate: 0deg;
    }
    to {
      rotate: 360deg;
    }
  }
</style>
