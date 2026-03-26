<script lang="ts">
  type Props = {
    path: string;
  };

  const { path }: Props = $props();
  const parts = $derived(path.split("/"));
</script>

<div class="wrapper">
  {#each parts as part, index}
    {#if index !== 0}
      <span class="slash">/</span>
    {/if}
    <div class="part">{part}</div>
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
    align-items: center;
  }

  .part {
    padding: 0.3em 0.5em;
    border-radius: var(--border-radius);
    background-color: var(--color-accent);
    text-wrap: nowrap;
  }

  .slash {
    opacity: 0.3;
  }
</style>
