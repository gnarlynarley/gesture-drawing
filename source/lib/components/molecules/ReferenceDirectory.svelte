<script lang="ts">
  import { references, removeReference } from "~lib/stores/references";
  import FileImage from "../atoms/FileImage.svelte";
  import IconClose from "../atoms/IconClose.svelte";
</script>

{#if $references.length === 0}
  <p>No files found.</p>
{:else}
  <ul>
    {#each $references as file (file)}
      <li>
        <button
          class="remove-button"
          type="button"
          on:click={() => removeReference(file)}
        >
          <IconClose />
        </button>
        <FileImage {file} spread fit="cover" />
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  ul {
    --columns: 1;
    width: 100%;
    display: grid;
    grid-gap: var(--spacing);
    grid-template-columns: repeat(var(--columns), 1fr);

    @for $i from 1 through 8 {
      @media screen and (min-width: #{20rem * $i}) {
        --columns: #{$i};
      }
    }
  }

  li {
    position: relative;
    z-index: 0;
    background-color: var(--color-accent-200);
    color: white;
    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
    }

    .remove-button {
      position: absolute;
      top: var(--spacing);
      right: var(--spacing);
      z-index: 1;
    }
  }
</style>
