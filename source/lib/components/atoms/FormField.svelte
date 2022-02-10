<script lang="ts">
  export let label: string;
</script>

<div class="container">
  <div class="label">{label}</div>
  <slot />
</div>

<style>
  .container {
    margin-bottom: 2rem;
  }

  .label {
    font-size: var(--font-size-heading);
    margin-bottom: var(--spacing);
  }
</style>
