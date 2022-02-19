<script lang="ts">
  import Button from "./Button.svelte";

  export let onChange: (files: File[]) => void;
  export let label: string;
  let input: HTMLInputElement;

  function handleOnChange() {
    const files = Array.from(input.files ?? []);
    onChange(files);
    // empty files after event.
    input.value = "";
  }
</script>

<label>
  <Button displayOnly>{label}</Button>
  <input bind:this={input} type="file" on:change={handleOnChange} multiple accept="image/*" />
</label>

<style>
  label {
    cursor: pointer;
  }
  input {
    display: none;
    visibility: hidden;
  }
</style>
