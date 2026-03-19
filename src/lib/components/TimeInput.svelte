<script lang="ts">
  type Props = {
    value: number;
  };

  let { value = $bindable() }: Props = $props();
  const seconds = $derived(value % 60);
  const minutes = $derived(Math.floor(value / 60));
</script>

<div class="wrapper">
  <input
    type="number"
    min="0"
    bind:value={
      () => minutes,
      (v) => {
        value = v * 60 + seconds || 0;
      }
    }
  />
  <span>:</span>
  <input
    type="number"
    min="0"
    max="59"
    bind:value={
      () => seconds.toString().padStart(2, "0"),
      (v) => {
        value = Number.parseFloat(v) + minutes * 60 || 0;
      }
    }
  />
</div>

<style>
  .wrapper {
    padding: var(--gutter);
    background-color: var(--color-accent);
    display: flex;
    border-radius: var(--border-radius);
    width: 100%;

    &:focus-within {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  input {
    field-sizing: content;
  }
</style>
