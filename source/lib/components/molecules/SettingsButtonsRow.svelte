<script lang="ts">
  import Button from "../atoms/Button.svelte";
  import Flex from "../atoms/Flex.svelte";
  import IconColor from "../atoms/IconColor.svelte";
  import IconFlipHorizontal from "../atoms/IconFlipHorizontal.svelte";
  import IconFlipVertical from "../atoms/IconFlipVertical.svelte";
  import { settings } from "../../stores/settings";
  import Tooltip from "../atoms/Tooltip.svelte";
</script>

<Flex>
  <Tooltip label="Enable/Disable color">
    <Button
      title="Enable/Disable color"
      variant={$settings.color ? "primary" : "default"}
      icon
      onClick={() => {
        $settings.color = !$settings.color;
      }}
    >
      <IconColor />
    </Button>
  </Tooltip>

  <Tooltip label="Flip image horizontally">
    <Button
      title="Flip image horizontally"
      variant={$settings.flippedHorizontal ? "primary" : "default"}
      icon
      onClick={() => {
        $settings.flippedHorizontal = !$settings.flippedHorizontal;
      }}
    >
      <IconFlipHorizontal />
    </Button>
  </Tooltip>

  <Tooltip label="Flip image vertically">
    <Button
      title="Flip image vertically"
      variant={$settings.flippedVertical ? "primary" : "default"}
      icon
      onClick={() => {
        $settings.flippedVertical = !$settings.flippedVertical;
      }}
    >
      <IconFlipVertical />
    </Button>
  </Tooltip>
</Flex>
