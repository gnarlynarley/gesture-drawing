<script lang="ts">
  import addKeybind from "../../utils/svelte/addKeybind";
  import Button from "./Button.svelte";
  import IconClose from "./IconClose.svelte";

  export let onClose: () => void;
  export let full: boolean = false;

  addKeybind("esc", onClose);
</script>

<div class="container" class:is-full={full}>
  <div class="modal">
    <div class="modal__close-button">
      <Button icon onClick={onClose}>
        <IconClose />
      </Button>
    </div>
    <slot />
  </div>
</div>

<style lang="scss">
  .container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: var(--spacing);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    background: color-mix(in srgb, var(--color-background), transparent 5%);
    backdrop-filter: blur(2px);
  }

  .modal {
    position: relative;
    z-index: 0;
    width: 100%;
    max-height: 100%;
    max-width: 30em;

    .is-full & {
      max-width: none;
      height: 100%;
    }

    &__close-button {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
    }
  }
</style>
