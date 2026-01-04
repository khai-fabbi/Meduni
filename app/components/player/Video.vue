<template>
  <ClientOnly>
    <div>
      <media-player
        ref="$player"
        :title="videoTitle"
        :src="{
          src: src,
          type: type
        }"
        controls
        :autoplay="false"
        plays-inline
        @can-play="onCanPlay"
        @volume-change="onVolumeChange"
        @play-fail="onPlayFail"
        @time-update="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
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

<script setup lang="ts">
import 'vidstack/bundle'

interface Props {
  src: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'video/mp4'
})

const emit = defineEmits<{
  'time-update': [currentTime: number, duration: number]
  'played-one-minute': [currentTime: number]
  'finished-ninety-percent': []
  'ended': []
}>()

const $player = ref()
const videoTitle = ref('Video Lesson')
const volume = useCookie('volume', {
  default: () => ({
    volume: 0.5,
    muted: false
  })
})

const hasPlayedOneMinute = ref(false)
const hasFinishedNinetyPercent = ref(false)
const isPlaying = ref(false)

watch(() => props.src, () => {
  hasPlayedOneMinute.value = false
  hasFinishedNinetyPercent.value = false
  isPlaying.value = false
})

interface VolumeChangeEvent {
  detail: {
    volume: number
    muted: boolean
  }
}

interface TimeUpdateEvent {
  detail: {
    currentTime: number
    duration: number
  }
}

function onVolumeChange(event: VolumeChangeEvent): void {
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
  // Autoplay was prevented by browser
}

function onTimeUpdate(event: TimeUpdateEvent): void {
  if (!$player.value) {
    return
  }

  const currentTime = event.detail.currentTime || 0
  // Get duration directly from player element instead of event
  const duration = $player.value.duration || event.detail.duration || 0

  if (duration === 0) {
    return
  }

  emit('time-update', currentTime, duration)

  if (isPlaying.value) {
    checkProgress(currentTime, duration)
  }
}

function checkProgress(currentTime: number, duration: number): void {
  if (duration === 0 || currentTime === 0) {
    return
  }

  if (currentTime >= 60 && !hasPlayedOneMinute.value) {
    hasPlayedOneMinute.value = true
    emit('played-one-minute', currentTime)
  }

  const progressPercent = (currentTime / duration) * 100
  const ninetyPercentTime = duration * 0.9

  if ((progressPercent >= 90 || currentTime >= ninetyPercentTime) && !hasFinishedNinetyPercent.value) {
    hasFinishedNinetyPercent.value = true
    emit('finished-ninety-percent')
  }
}

function onPlay() {
  isPlaying.value = true
}

function onPause() {
  isPlaying.value = false
}

function onEnded() {
  emit('ended')
}

defineExpose({
  play: (time?: number) => {
    if ($player.value) {
      if (time !== undefined) {
        $player.value.currentTime = time
      }
      $player.value.play()
    }
  },
  pause: () => {
    if ($player.value) {
      $player.value.pause()
    }
  },
  seek: (time: number) => {
    if ($player.value) {
      $player.value.currentTime = time
    }
  },
  getCurrentTime: () => {
    return $player.value?.currentTime || 0
  },
  getDuration: () => {
    return $player.value?.duration || 0
  }
})
</script>
