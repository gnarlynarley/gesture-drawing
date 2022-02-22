<script lang="ts">
  import addKeybind from "../../utils/svelte/addKeybind";

  import Button from "./Button.svelte";
  import IconClose from "./IconClose.svelte";

  export let onClose: () => void;
  export let onAccept: (() => void) | undefined = undefined;
  export let onAcceptLabel = "Ok";
  export let onCancelLabel = "Cancel";

  addKeybind("esc", onClose);
</script>

<div class="container">
  <div class="modal">
    <div class="modal__close-button">
      <Button icon onClick={onClose}>
        <IconClose />
      </Button>
    </div>
    <slot />
    <div class="modal__button-bar">
      <Button variant="transparent" onClick={onClose}>
        {onCancelLabel}
      </Button>
      <Button variant="primary" onClick={onAccept}>
        {onAcceptLabel}
      </Button>
    </div>
  </div>
  <div class="background" on:click={onClose} role="presentation" />
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
  }

  .modal {
    position: relative;
    z-index: 0;
    overflow: auto;
    width: 100%;
    max-height: 100%;
    background: var(--color-background);
    box-shadow: var(--shadow);
    border: 1px solid var(--color-accent-100);
    padding: var(--spacing);
    padding-top: 2em;
    border-radius: var(--border-radius);
    max-width: 30em;

    &__close-button {
      position: absolute;
      right: 0;
      top: 0;
    }

    &__button-bar {
      display: flex;
      justify-content: space-between;
      padding-top: calc(var(--spacing) * 2);
    }
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: var(--color-background);
    opacity: 0.9;
  }
</style>
