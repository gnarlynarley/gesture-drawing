<script lang="ts">
  import src from "./Charr.image.phoebe.png";
</script>

<img class="charr" {src} alt="Silly lil charr" />

<style>
  .charr {
    aspect-ratio: 400 / 342;
    object-fit: cover;
    width: 100%;
    animation: sprite 600ms steps(5, jump-none) infinite;
    max-width: 20em;
  }

  @keyframes sprite {
    from {
      object-position: 0% 0%;
    }
    to {
      object-position: 100% 0%;
    }
  }
</style>
