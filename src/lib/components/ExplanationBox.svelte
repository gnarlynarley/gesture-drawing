<script lang="ts">
  import Box from "./Box.svelte";
  import { CircleQuestionMarkIcon } from "@lucide/svelte";
  import Button from "./Button.svelte";
  const links: [string, string][] = [
    [
      "THIS Improves Your Gesture Drawing - Proko",
      "https://www.youtube.com/watch?v=2fl5LYouyoY",
    ],
    [
      "The 16 Line Gesture Method - Steven Michael Hampton",
      "https://www.youtube.com/watch?v=tSyGOZjTs5A",
    ],
    [
      "The Basics of Gesture Drawing - Steven Michael Hampton",
      "https://www.youtube.com/watch?v=8c6Peo0ychw",
    ],
    [
      "Step by Step Gesture Drawing - Michael Mattesi",
      "https://www.youtube.com/watch?v=c93T3DTsbo0",
    ],
  ];
</script>

<button type="button" command="show-modal" commandfor="explanation-box">
  <CircleQuestionMarkIcon />
</button>

<dialog id="explanation-box">
  <Box xl xlPadding>
    <h1>What is gesture drawing?</h1>

    <p>
      Timed gesture drawing is a practice where you draw a subject, usually a
      human figure, in a short, fixed amount of time, typically anywhere from 30
      seconds to 5 minutes. The whole point is not to create a perfect, detailed
      drawing. Instead, you're trying to capture the overall feel, movement, and
      energy of the pose in just a few quick strokes.
    </p>
    <p>
      Because the clock is ticking, you're forced to skip the nitpicky details
      and focus on what actually matters, the flow of the body, the weight
      distribution, the sense of motion. Over time, this trains your eye and
      hand to work together faster and more intuitively.
    </p>
    <p>
      It's an excellent warm-up exercise for artists of all skill levels, kind
      of like stretching before a workout. Regular practice builds muscle
      memory, loosens up your drawing style, and helps you get more comfortable
      with proportions and anatomy without overthinking every single line.
    </p>

    <p>Some videos to watch:</p>
    <ul>
      {#each links as [label, href]}
        <li>
          <a {href}>{label}</a>
        </li>
      {/each}
    </ul>

    <div class="close-button">
      <Button type="button" commandfor="explanation-box" command="close">
        Close
      </Button>
    </div>
  </Box>
</dialog>

<style>
  dialog {
    background: var(--color-background);
    color: currentColor;
    border: none;
    max-width: 60em;
    padding: 0;
    background: transparent;

    &::backdrop {
      backdrop-filter: blur(3px);
      background-color: color-mix(
        in srgb,
        var(--color-background),
        transparent 10%
      );
    }
  }

  a {
    text-decoration: underline;
  }

  .close-button {
    margin-left: auto;
  }
</style>
