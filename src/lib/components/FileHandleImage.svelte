<script lang="ts">
  type Props = {
    handle: FileSystemFileHandle;
    cover?: boolean;
  };

  const { handle, cover }: Props = $props();

  let src = $state<string | null>(null);

  $effect(() => {
    let active = true;
    let url: string | null = null;

    handle.getFile().then((file) => {
      if (!active) return false;

      url = URL.createObjectURL(file);
      src = url;
    });

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  });
</script>

{#if src}
  <img class="image" class:cover {src} alt={handle.name} />
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
  }
</style>
