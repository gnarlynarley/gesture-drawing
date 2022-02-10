<div class="container">
  <slot />
</div>

<style lang="scss">
  .container > :global(* + *) {
    margin-top: var(--spacing);
  }
</style>
