<script lang="ts">
  import src from "$public/logo.jpg?url";
  import Dialog from "./Dialog.svelte";
</script>

<Dialog title="Warning, this guy draws smut.">
  {#snippet button()}
    <span class="wrapper">
      <img {src} alt="Narley" />
      <span>Made with love by Narley</span>
    </span>
  {/snippet}
  {#snippet content()}
    <p>
      Why else you think I made this app, need to get better at anatomy and I
      hope you will as well :D
    </p>
    <p>
      <a
        href="https://x.com/GnarlyNarley"
        rel="noopener noreferrer"
        target="_blank"
      >
        Twitter
      </a>
    </p>
  {/snippet}
</Dialog>

<style>
  .wrapper {
    display: inline-flex;
    align-items: center;
    gap: var(--gutter);
    padding: var(--gutter);
    border: 2px solid var(--color-accent);
    border-radius: var(--border-radius);
    background-color: var(--color-background);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary-text);
      background-color: var(--color-primary);
    }
  }

  img {
    border-radius: var(--border-radius);
    width: 3em;
    display: block;
  }
</style>
