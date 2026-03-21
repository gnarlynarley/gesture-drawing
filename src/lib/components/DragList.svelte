<script lang="ts" generics="T extends { id: string | number }">
  import type { Snippet } from "svelte";
  import { flip } from "svelte/animate";
  import { blur } from "svelte/transition";

  type Props = {
    items: T[];
    content: Snippet<[T, number]>;
  };

  let { items = $bindable(), content }: Props = $props();

  let draggedIndex = $state<number | null>(null);
  let insertionIndex = $state<number | null>(null);
  let isDragOutsideWrapper = $state(false);

  let wrapperElement: HTMLDivElement | null = null;

  const isPointInsideWrapper = (clientX: number, clientY: number) => {
    if (!wrapperElement) {
      return false;
    }

    const rect = wrapperElement.getBoundingClientRect();

    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  const clearDragState = () => {
    draggedIndex = null;
    insertionIndex = null;
    isDragOutsideWrapper = false;
  };

  const onDragStart = (event: DragEvent, index: number) => {
    draggedIndex = index;
    insertionIndex = index;

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));

      const hiddenDragImage = document.createElement("div");
      hiddenDragImage.style.width = "1px";
      hiddenDragImage.style.height = "1px";
      hiddenDragImage.style.opacity = "0";
      hiddenDragImage.style.position = "fixed";
      hiddenDragImage.style.top = "0";
      hiddenDragImage.style.left = "0";

      document.body.appendChild(hiddenDragImage);
      event.dataTransfer.setDragImage(hiddenDragImage, 0, 0);

      requestAnimationFrame(() => {
        hiddenDragImage.remove();
      });
    }
  };

  const onDragOverItem = (event: DragEvent, index: number) => {
    if (draggedIndex === null) {
      return;
    }

    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    const currentTarget = event.currentTarget as HTMLElement;
    const { top, height } = currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - top;
    const isBefore = offsetY < height / 2;

    isDragOutsideWrapper = false;
    insertionIndex = isBefore ? index : index + 1;
  };

  const onWindowDragOver = (event: DragEvent) => {
    if (draggedIndex === null) {
      return;
    }

    isDragOutsideWrapper = !isPointInsideWrapper(event.clientX, event.clientY);
  };

  const moveDraggedItem = () => {
    if (draggedIndex === null || insertionIndex === null) {
      return;
    }

    const fromIndex = draggedIndex;

    let toIndex = insertionIndex;
    if (toIndex > fromIndex) {
      toIndex -= 1;
    }

    if (toIndex === fromIndex) {
      return;
    }

    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    items = next;
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    moveDraggedItem();
    clearDragState();
  };
</script>

<svelte:window ondragover={onWindowDragOver} />

<div
  bind:this={wrapperElement}
  class="wrapper"
  class:is-dragging={draggedIndex !== null}
  class:is-drag-inside={draggedIndex !== null && !isDragOutsideWrapper}
  role="list"
  ondragover={(event) => event.preventDefault()}
  ondrop={onDrop}
>
  {#each items as item, index (item.id)}
    <div
      animate:flip={{ duration: 150 }}
      transition:blur
      class="item"
      class:is-before={draggedIndex !== null &&
        insertionIndex === index &&
        draggedIndex !== insertionIndex - 1}
      class:is-after={draggedIndex !== null &&
        insertionIndex === index + 1 &&
        draggedIndex !== insertionIndex}
      class:is-dragging={draggedIndex === index}
      role="listitem"
      draggable="true"
      ondragstart={(event) => onDragStart(event, index)}
      ondragover={(event) => onDragOverItem(event, index)}
      ondrop={onDrop}
      ondragend={clearDragState}
    >
      {@render content(item, index)}
    </div>
  {/each}
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .item {
    --border-size: 1px;
    border-block: var(--border-size) solid transparent;
    padding: calc(var(--gutter) - (var(--border-size) * 2));

    .wrapper.is-drag-inside &:not(.is-dragging).is-before {
      border-block-start-color: var(--color-primary);
    }
    .wrapper.is-drag-inside &:not(.is-dragging).is-after {
      border-block-end-color: var(--color-primary);
    }
    &.is-dragging {
      background-color: color-mix(
        in oklab,
        var(--color-primary),
        var(--color-accent) 90%
      );
      border-color: color-mix(
        in oklab,
        var(--color-primary),
        var(--color-accent) 90%
      );
    }
  }
</style>
