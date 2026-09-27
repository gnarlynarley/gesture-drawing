<script lang="ts">
  import Button from "./Button.svelte";

  type Props = {
    message: string;
    onConfirm: () => void;
    onClose: () => void;
  };

  const { message, onConfirm, onClose }: Props = $props();
  let dialog = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    dialog?.showModal();
  });
</script>

<dialog bind:this={dialog} onclose={onClose}>
  <p>{message}</p>
  <div class="buttons">
    <Button onclick={onClose}>Cancel</Button>
    <Button
      primary
      onclick={() => {
        onConfirm();
        onClose();
      }}>Okay</Button
    >
  </div>
</dialog>

<style>
  dialog {
    border: none;
    background-color: var(--color-accent);
    color: var(--color-text);
    border-radius: var(--border-radius);
    box-shadow: 0 1px 8px rgba(0 0 0 / 0.1);
    gap: var(--gutter);
    padding: var(--gutter);
    padding-top: var(--spacing);

    &:open {
      display: grid;
    }

    &::backdrop {
      background: color-mix(in srgb, var(--color-background), transparent 10%);
      backdrop-filter: blur(5px);
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
