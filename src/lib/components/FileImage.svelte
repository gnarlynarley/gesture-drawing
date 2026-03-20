<script lang="ts">
  import type { ImageFileHandle } from "$lib/models";

  type Props = {
    file: File;
    cover?: boolean;
    fit?: boolean;
  };

  const { file, cover, fit }: Props = $props();

  let src = $state<string | null>(null);

  $effect(() => {
    src = URL.createObjectURL(file);

    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  });
</script>

{#if src}
  <img class="image" class:cover class:fit {src} alt={file.name} />
{:else}
  <span>loading...</span>
{/if}

<style>
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    flex-shrink: 1;
    animation: fade-in 1s forwards;

    &.cover {
      position: absolute;
      object-fit: scale-down;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &.fit {
      object-fit: scale-down;
    }
  }
</style>
