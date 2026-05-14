<script lang="ts">
  import src from "$public/logo.jpg?url";
</script>

<a
  class="wrapper"
  href="https://x.com/GnarlyNarley"
  rel="noopener noreferrer"
  target="_blank"
>
  <img {src} alt="Narley" />
  <span>Made with love by Narley</span>
</a>

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
