<script lang="ts">
  export let value: number;
  export let limit: number;

  $: percentage = Math.min(value / limit, 1);
</script>

<div class="container">
  <span class="bar" style={`transform: scale(${percentage}, 1);`} />
</div>

<style lang="scss">
  .container {
    height: 0.2em;
    width: 100%;
    position: relative;
    background: var(--color-accent-300);
  }

  .bar {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-primary);
    transform-origin: left center;
  }
</style>
