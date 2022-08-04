<div class="container">
  <slot />
</div>

<style lang="scss">
  .container {
    display: flex;
    align-items: center;

    > :global(* + *) {
      margin-left: var(--spacing);
      flex-shrink: 0;
    }
  }
</style>
