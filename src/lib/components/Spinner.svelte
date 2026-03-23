<script lang="ts">
  import { Loader } from "@lucide/svelte";
</script>

<div class="spinner">
  <Loader size={24 * 2} />
</div>

<style>
  .spinner {
    animation: 2s spin forwards linear infinite;

    :global(svg) {
      display: block;
    }
  }

  @keyframes spin {
    from {
      rotate: 0deg;
    }
    to {
      rotate: 360deg;
    }
  }
</style>
