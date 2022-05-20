<script lang="ts">
  import {
    addReferences,
    clearReferences,
    references,
    removeReference,
type ReferenceFile,
  } from "~lib/stores/references";
  import Button from "../atoms/Button.svelte";
  import FileImage from "../atoms/FileImage.svelte";
  import FileInput from "../atoms/FileInput.svelte";
  import IconClose from "../atoms/IconClose.svelte";
  import Modal from "../atoms/Modal.svelte";

  let orderedReferences: Array<ReferenceFile> = [];
  let state: "browse" | "ordering" = "browse";

  function cancelOrderReferences() {
    state = "browse";
    orderedReferences = [];
  }
  function orderReferences() {
    $references = Array.from(new Set([...orderedReferences, ...$references]));
    cancelOrderReferences();
  }

  function onFileClick(file: ReferenceFile) {
    if (state === "ordering") {
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
  {#if state === "ordering"}
    <Button variant="primary" onClick={orderReferences}>Done</Button>
    <Button onClick={cancelOrderReferences}>Cancel</Button>
  {:else}
    <FileInput onChange={addReferences} label="Add files" />
    <Button onClick={() => (state = "ordering")}>Reorder</Button>
    <Button onClick={() => (showClearReferenceModal = true)}>Clear</Button>
  {/if}
</div>
<ul class:is-ordering={state === "ordering"}>
  {#each $references as reference (reference)}
    <li class:is-active={orderedReferences.includes(reference)}>
      <button
        class="remove-button"
        type="button"
        on:click={() => removeReference(reference)}
      >
        <IconClose />
      </button>
      <FileImage name={reference.name} file={reference.file} spread fit="cover" />
      {#if state === "ordering"}
        <button
          class="order-button"
          type="button"
          on:click={() => onFileClick(reference)}
        >
          <span>{orderedReferences.indexOf(reference) + 1 || ""}</span>
        </button>
      {/if}
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

    .is-ordering & {
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

    .order-button {
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

      @at-root li.is-active .order-button:after {
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
