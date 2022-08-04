<script lang="ts">
  export let label: string
</script>

<div>
  <slot />
  <span>{label}</span>
</div>

<style lang="scss">
  div {
    position: relative;
  }

  span {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -100%);
    opacity: 0;
    background: var(--color-accent-300);
    font-size: 0.6em;
    padding: 0.6em;
    border-radius: 0.4em;
    box-shadow: var(--shadow);
    pointer-events: none;
    white-space: nowrap;

    div:hover & {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
</style>