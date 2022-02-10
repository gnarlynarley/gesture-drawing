<script lang="ts">
  export let onChange: (files: File[]) => void;
  let input: HTMLInputElement;

  function handleOnChange() {
    const files = Array.from(input.files ?? []);
    onChange(files);
  }
</script>

<input bind:this={input} type="file" on:change={handleOnChange} />
