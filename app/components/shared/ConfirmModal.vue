<script setup lang="ts">
interface Props {
  title: string
  description?: string
  loading?: boolean
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  loading: false,
  dismissible: true
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: []
  close: []
}>()

function handleConfirm() {
  if (props.loading) return
  emit('confirm')
}

function handleClose() {
  if (props.loading) return
  emit('close')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'sm:max-w-lg text-center',
      header: 'hidden',
      overlay: 'bg-black/40 backdrop-blur-[2px]'
    }"
    :close="{
      class: dismissible && !loading ? '' : 'hidden'
    }"
    :dismissible="dismissible && !loading"
    title="Xác nhận"
    description="Xác nhận"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Icon và Loading State -->
        <div class="flex justify-center">
          <div
            v-if="loading"
            class="ring-10 ring-primary/10 rounded-full"
          >
            <div
              class="flex size-13 justify-center items-center rounded-full bg-primary/20"
            >
              <UIcon
                name="i-lucide-loader"
                class="size-8 animate-spin text-primary"
              />
            </div>
          </div>
          <div
            v-else
            class="ring-10 ring-primary/10 rounded-full"
          >
            <div
              class="flex size-13 justify-center items-center rounded-full bg-primary/20"
            >
              <UIcon
                name="i-lucide-alert-circle"
                class="size-8 text-primary"
              />
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-3">
          <h4 class="text-xl font-bold">
            {{ title }}
          </h4>
          <p
            v-if="description"
            class="text-default"
          >
            {{ description }}
          </p>
          <p
            v-if="loading"
            class="text-primary font-medium"
          >
            Đang xử lý...
          </p>
        </div>

        <!-- Buttons -->
        <div class="space-x-4 mt-6 md:mt-8 flex">
          <UButton
            variant="outline"
            class="w-full min-h-12 text-lg"
            size="xl"
            block
            type="button"
            :disabled="loading"
            @click="handleClose"
          >
            Đóng
          </UButton>
          <UButton
            type="button"
            size="xl"
            class="w-full min-h-12 text-lg"
            block
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="handleConfirm"
          >
            {{ loading ? 'Đang xử lý' : 'Xác nhận' }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
