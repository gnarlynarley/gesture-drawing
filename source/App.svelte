<script lang="ts">
  import Home from "~lib/pages/Home.svelte";
  import Practice from "~lib/pages/Practice.svelte";
  import { currentPage } from "~lib/utils/navigation";
</script>

{#if $currentPage === "home"}
  <Home />
{:else if $currentPage === "practice"}
  <Practice />
{/if}
