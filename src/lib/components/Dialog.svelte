<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    dialog?: HTMLDialogElement;
    children?: Snippet;
  };

  let { dialog = $bindable(), children }: Props = $props();
</script>

<dialog bind:this={dialog}>
  {@render children?.()}
</dialog>
