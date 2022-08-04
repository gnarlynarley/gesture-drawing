<div>
  <slot />
</div>

<style lang="scss">
  div {
    background: var(--color-background--transparent);
    padding: var(--spacing);
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
  }
</style>