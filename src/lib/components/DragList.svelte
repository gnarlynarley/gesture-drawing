<script lang="ts" generics="T extends { id: string | number }">
  import type { Snippet } from "svelte";
  import { flip } from "svelte/animate";
  import { blur } from "svelte/transition";

  type DragState = {
    before: boolean;
    after: boolean;
    dragging: boolean;
  };
  type Props = {
    items: T[];
    content: Snippet<[T, number, DragState]>;
  };

  let { items = $bindable(), content }: Props = $props();

  let draggedIndex = $state<number | null>(null);
  let insertionIndex = $state<number | null>(null);
  let isDragOutsideWrapper = $state(false);

  let wrapperElement: HTMLDivElement | null = null;
  let itemElements = $state<Array<HTMLElement | null>>([]);

  const isPointInsideWrapper = (clientX: number, clientY: number) => {
    if (wrapperElement) {
      const rect = wrapperElement.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        return (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );
      }
    }

    return itemElements.some((element) => {
      if (!element) {
        return false;
      }

      const rect = element.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    });
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

  const getInsertionIndexFromPoint = (clientY: number) => {
    if (items.length === 0) {
      return 0;
    }

    for (let index = 0; index < items.length; index += 1) {
      const element = itemElements[index];
      if (!element) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      if (clientY < middle) {
        return index;
      }
    }

    return items.length;
  };

  const onWindowDragOver = (event: DragEvent) => {
    if (draggedIndex === null) {
      return;
    }

    const isInside = isPointInsideWrapper(event.clientX, event.clientY);
    isDragOutsideWrapper = !isInside;

    if (isInside) {
      insertionIndex = getInsertionIndexFromPoint(event.clientY);
    }
  };

  const onWindowDrop = (event: DragEvent) => {
    if (draggedIndex === null) {
      return;
    }

    event.preventDefault();

    if (isPointInsideWrapper(event.clientX, event.clientY)) {
      insertionIndex = getInsertionIndexFromPoint(event.clientY);
      moveDraggedItem();
    }

    clearDragState();
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

<svelte:window ondragover={onWindowDragOver} ondrop={onWindowDrop} />

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
    {@const dragState: DragState = {
        before: draggedIndex !== null &&
          insertionIndex === index,
        after: draggedIndex !== null &&
          insertionIndex === index + 1,
        dragging: draggedIndex === index
    }}
    <div
      class="item"
      bind:this={itemElements[index]}
      role="listitem"
      draggable="true"
      ondragstart={(event) => onDragStart(event, index)}
      ondragover={(event) => onDragOverItem(event, index)}
      ondrop={onDrop}
      ondragend={clearDragState}
    >
      {@render content(item, index, dragState)}
    </div>
  {/each}
</div>

<style lang="scss">
  .wrapper {
    display: contents;
  }

  .item {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }
</style>
