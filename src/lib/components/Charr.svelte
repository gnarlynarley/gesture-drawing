<script lang="ts">
  import phoebeSrc from "./Charr.image.phoebe.png";
  import memeSrc from "./Charr.image.meme.png";
  import swaggatarSrc from "./Charr.image.swaggatar.jpg";

  const now = new Date();
  const memeImages = [memeSrc, swaggatarSrc];
  const isAprilFools = now.getMonth() === 3 && now.getDate() === 1;
  const hasMeme = isAprilFools && Math.random() < 0.5;

  let src = $state(phoebeSrc);

  if (hasMeme) {
    src = memeImages[Math.floor(Math.random() * memeImages.length)];
  }

  $effect(() => {
    if (!hasMeme) return;

    const id = setTimeout(() => {
      src = phoebeSrc;
    }, 200);

    return () => {
      clearTimeout(id);
    };
  });
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
