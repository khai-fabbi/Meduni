<template>
  <div>
    <media-player
      ref="$player"
      title="Sprite Fight"
      :src="{
        src: 'https://files.vidstack.io/sprite-fight/720p.mp4',
        type: 'video/mp4'
      }"
      controls
      autoplay
      plays-inline
      @can-play="onCanPlay"
      @volume-change="onVolumeChange"
    >
      <media-provider>
        <track
          src="https://files.vidstack.io/sprite-fight/subs/english.vtt"
          label="English"
          language="en-US"
          kind="subtitles"
          type="vtt"
          default
        >
      </media-provider>

      <media-video-layout />
    </media-player>
  </div>
</template>

<script setup>
import 'vidstack/bundle'

const $player = ref()
const volume = useCookie('volume', {
  default: () => ({
    volume: 0.5,
    muted: false
  })
})

function onVolumeChange(event) {
  volume.value = {
    volume: event.detail.volume,
    muted: event.detail.muted
  }
}

function onCanPlay() {
  $player.value.play()

  setTimeout(() => {
    if ($player.value) {
      $player.value.volume = volume.value.volume
      $player.value.muted = volume.value.muted
    }
  }, 0)
}
</script>
