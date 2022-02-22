<script lang="ts">
  import App from "source/App.svelte";

  import {
    clearReferences,
    references,
    removeReference,
  } from "~lib/stores/references";
  import Button from "../atoms/Button.svelte";
  import FileImage from "../atoms/FileImage.svelte";
  import IconClose from "../atoms/IconClose.svelte";
  import Modal from "../atoms/Modal.svelte";

  let orderedReferences: Array<File> = [];
  let state: "browse" | "sorting" = "browse";

  function cancelOrderReferences() {
    state = "browse";
    orderedReferences = [];
  }
  function orderReferences() {
    $references = Array.from(new Set([...orderedReferences, ...$references]));
    cancelOrderReferences();
  }

  function onFileClick(file: File) {
    if (state === "sorting") {
      if (orderedReferences.includes(file)) {
        orderedReferences.splice(orderedReferences.indexOf(file), 1);
      } else {
        orderedReferences.push(file);
      }
      orderedReferences = orderedReferences;
    }
  }

  let showClearReferenceModal = false;
</script>

{#if $references.length === 0}
  <p>No files found.</p>
{:else}
  {#if showClearReferenceModal}
    <Modal
      onClose={() => (showClearReferenceModal = false)}
      onAccept={clearReferences}
      onAcceptLabel="Clear references"
    >
      Are you sure you want to remove all reference files?
    </Modal>
  {/if}
  <div class="buttons">
    {#if state === "sorting"}
      <Button onClick={orderReferences}>Done sorting</Button>
      <Button onClick={cancelOrderReferences}>Cancel sorting</Button>
    {:else}
      <Button onClick={() => (state = "sorting")}>Sort</Button>
    {/if}
    <Button onClick={() => (showClearReferenceModal = true)}>Clear</Button>
  </div>
  <ul class:is-sorting={state === "sorting"}>
    {#each $references as file (file)}
      <li class:is-active={orderedReferences.includes(file)}>
        <button
          class="remove-button"
          type="button"
          on:click={() => removeReference(file)}
        >
          <IconClose />
        </button>
        <FileImage {file} spread fit="cover" />
        {#if state === "sorting"}
          <button
            class="sort-button"
            type="button"
            on:click={() => onFileClick(file)}
          >
            <span>{orderedReferences.indexOf(file) + 1 || ""}</span>
          </button>
        {/if}
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

    .is-sorting & {
      opacity: 0.5;

      &.is-active,
      &:hover {
        opacity: 1;
      }
    }

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

    .sort-button {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 2em;
      z-index: 0;
      text-shadow: 0 3px 1px rgba(black, 0.1);

      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-primary);
        opacity: 0;
        z-index: -1;
      }

      @at-root li.is-active .sort-button:after {
        opacity: 0.5;
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: var(--spacing);
  }
</style>
