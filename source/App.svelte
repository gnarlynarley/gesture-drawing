<script lang="ts">
  import Home from "~lib/pages/Home.svelte";
  import Practice from "~lib/pages/Practice.svelte";
  import { currentPage } from "~lib/utils/navigation";
</script>

<main>
  {#if $currentPage === "home"}
    <Home />
  {:else if $currentPage === "practice"}
    <Practice />
  {/if}
</main>

<style lang="scss">
  main {
    position: relative;
    z-index: 0;
    height: 100%;
  }
</style>
