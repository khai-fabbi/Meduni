<template>
  <ClientOnly>
    <div>
      <media-player
        ref="$player"
        :title="videoTitle"
        :src="{
          src: 'https://files.vidstack.io/sprite-fight/720p.mp4',
          type: 'video/mp4'
        }"
        controls
        :autoplay="false"
        plays-inline
        @can-play="onCanPlay"
        @volume-change="onVolumeChange"
        @play-fail="onPlayFail"
      >
        <media-provider />

        <media-video-layout />
      </media-player>
    </div>
    <template #fallback>
      <div class="aspect-video bg-neutral-200 rounded-lg flex items-center justify-center">
        <span class="text-neutral-600">Đang tải video...</span>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import 'vidstack/bundle'

const $player = ref()
const videoTitle = ref('Sprite Fight')
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
  setTimeout(() => {
    if ($player.value) {
      $player.value.volume = volume.value.volume
      $player.value.muted = volume.value.muted
    }
  }, 0)
}

function onPlayFail() {
  console.warn('Autoplay was prevented by browser')
}
</script>
