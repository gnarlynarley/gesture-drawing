<script lang="ts">
  import Button from "~lib/components/atoms/Button.svelte";
  import IconHelp from "~lib/components/atoms/IconHelp.svelte";
  import Modal from "~lib/components/atoms/Modal.svelte";
  import Home from "~lib/pages/Home.svelte";
  import Practice from "~lib/pages/Practice.svelte";
  import { currentPage } from "~lib/utils/navigation";

  let closeModalActive = false;

  function openModal() {
    closeModalActive = true;
  }
  function closeModal() {
    closeModalActive = false;
  }
</script>

<main>
  {#if $currentPage === "home"}
    <Home />
  {:else if $currentPage === "practice"}
    <Practice />
  {/if}
  <span class="help-button">
    <Button icon onClick={openModal}>
      <IconHelp />
    </Button>
  </span>
</main>

{#if closeModalActive}
  <Modal onClose={closeModal}>
    <div class="help-content">
      <h2>Help</h2>

      <p>
        Use this tool for timed drawing exersizes where you take a reference,
        and try to draw it in a limited amount of time.
      </p>

      <h3>Shortcuts</h3>
      <ul>
        <li><code>j</code> navigate to the previous image</li>
        <li><code>l</code> navigate to the next image</li>
        <li><code>space</code> pause the timer</li>
        <li><code>f</code> toggle fullscreen</li>
      </ul>
    </div>
  </Modal>
{/if}

<style lang="scss">
  main {
    position: relative;
    z-index: 0;
    height: 100%;
  }

  .help-button {
    position: fixed;
    bottom: var(--spacing);
    right: var(--spacing);
  }

  li {
    margin-left: 1em;
  }
</style>
