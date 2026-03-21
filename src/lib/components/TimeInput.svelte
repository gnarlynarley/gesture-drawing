<script lang="ts">
  type Props = {
    value: number;
    label?: string;
  };

  let { value = $bindable(), label }: Props = $props();
  const seconds = $derived(value % 60);
  const minutes = $derived(Math.floor(value / 60));
  const id = $props.id();
</script>

<div class="wrapper">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <div class="inputs">
    <input
      {id}
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
</div>

<style>
  .wrapper {
    display: grid;
    gap: var(--gutter);
  }

  .inputs {
    display: flex;
    align-items: center;
    gap: 0.3em;
    flex-shrink: 1;
  }

  input {
    padding: var(--gutter);
    background-color: var(--color-accent);
    display: flex;
    border-radius: var(--border-radius);
    /* width: 100%; */
    border: 2px solid transparent;
    width: 4em;

    &:first-of-type {
      text-align: right;
    }

    &:focus-visible {
      border-color: var(--color-primary);
      outline: none;
    }
  }
</style>
