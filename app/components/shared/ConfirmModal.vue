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
      content: 'sm:max-w-lg text-center z-[101]',
      header: 'hidden',
      overlay: 'bg-black/40 backdrop-blur-[2px] z-100'
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
            class="rounded-full ring-10 ring-primary/10"
          >
            <div
              class="flex justify-center items-center rounded-full size-13 bg-primary/20"
            >
              <UIcon
                name="i-lucide-loader"
                class="animate-spin size-8 text-primary"
              />
            </div>
          </div>
          <div
            v-else
            class="rounded-full ring-10 ring-primary/10"
          >
            <div
              class="flex justify-center items-center rounded-full size-13 bg-primary/20"
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
            class="font-medium text-primary"
          >
            Đang xử lý...
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex mt-6 space-x-4 md:mt-8">
          <UButton
            variant="outline"
            class="w-full text-lg min-h-12"
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
            class="w-full text-lg min-h-12"
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
