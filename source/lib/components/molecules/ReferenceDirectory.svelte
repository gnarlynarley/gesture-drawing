<script lang="ts">
  import { references, removeReference } from "~lib/stores/references";
  import FileImage from "../atoms/FileImage.svelte";
  import IconClose from "../atoms/IconClose.svelte";
</script>

<ul>
  {#each $references as reference (reference)}
    <li class:is-active={$references.includes(reference)}>
      <button
        class="remove-button"
        type="button"
        on:click={() => removeReference(reference)}
      >
        <IconClose />
      </button>
      <FileImage
        name={reference.name}
        file={reference.thumbnail ?? reference.file}
        spread
        fit="cover"
      />
    </li>
  {/each}
</ul>

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
    grid-template-columns: repeat(var(--columns), 1fr);
    grid-gap: var(--spacing);
    padding: var(--spacing);

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
