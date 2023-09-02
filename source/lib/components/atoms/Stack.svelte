<script lang="ts">
  export let horizontal: boolean = false;
</script>

<div class="container" class:is-horizontal={horizontal}>
  <slot />
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
    justify-content: flex-start;
    align-items: flex-start;

    &.is-horizontal {
      flex-direction: row;
    }
  }
</style>
