<script lang="ts">
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
  {label}
  <input bind:this={input} type="file" on:change={handleOnChange} />
</label>

<style>
  input {
    display: none;
    visibility: hidden;
  }
</style>
