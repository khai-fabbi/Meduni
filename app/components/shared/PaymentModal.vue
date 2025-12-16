<script setup lang="ts">
interface Props {
  modelValue: boolean
  paymentAmount: number
  paymentContent: string
  bankAccount: string
  bankName: string
  accountHolder: string
  qrCodeUrl?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment',
  title: 'Thanh toán KHÓA HỌC AI NỀN TẢNG'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toast = useToast()
const { copy: copyToClipboard } = useClipboard()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}

function copyAccountNumber() {
  copyToClipboard(props.bankAccount)
  toast.add({
    title: 'Đã sao chép',
    description: 'Số tài khoản đã được sao chép',
    color: 'success'
  })
}

function copyPaymentContent() {
  copyToClipboard(props.paymentContent)
  toast.add({
    title: 'Đã sao chép',
    description: 'Nội dung chuyển khoản đã được sao chép',
    color: 'success'
  })
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'sm:max-w-lg p-0 overflow-hidden',
      overlay: 'bg-black/40 backdrop-blur-[2px]',
      header: 'hidden',
      footer: 'hidden',
      body: 'sm:p-0 p-0'
    }"
  >
    <template #body>
      <div class="space-y-0">
        <div class="bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-between py-4 px-6">
          <h3 class="text-white font-bold text-base md:text-lg uppercase sm:text-sm">
            {{ title }}
          </h3>
          <button
            class="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            @click="isOpen = false"
          >
            <UIcon
              name="i-lucide-x"
              class="w-5 h-5 text-white"
            />
          </button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div class="bg-primary-50 rounded-lg px-4 py-3 border border-primary-200">
            <p class="text-base font-medium text-primary-700 text-center">
              Vui lòng quét mã QR để thanh toán
            </p>
          </div>

          <div class="flex justify-center">
            <div class="bg-white rounded-lg p-4 border-2 border-neutral-200">
              <NuxtImg
                :src="qrCodeUrl"
                alt="QR Code"
                class="w-64 h-64"
              />
            </div>
          </div>

          <div class="bg-yellow-50 rounded-lg p-4 space-y-2 border border-yellow-200">
            <h4 class="font-bold text-base mb-2 text-neutral-800">
              Hướng dẫn thanh toán:
            </h4>
            <p class="text-sm text-neutral-700">
              Mở ứng dụng ngân hàng trên điện thoại
            </p>
            <p class="text-sm text-neutral-700">
              Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
            </p>
            <p class="text-sm text-neutral-700">
              Nhập đúng số tiền: <span class="text-primary-600 font-bold">{{ formatPrice(paymentAmount) }}</span>
            </p>
            <p class="text-sm text-neutral-700">
              Nhập nội dung: <span class="text-primary-600 font-bold">{{ paymentContent }}</span>
            </p>
          </div>

          <div class="bg-red-50 rounded-lg p-4 border border-red-200">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <label class="text-sm font-medium text-red-700 shrink-0">
                Nội dung chuyển khoản:
              </label>
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <div class="flex-1 bg-white rounded-md px-3 py-2 border border-red-200">
                  <p class="text-sm font-bold text-red-700 truncate">
                    {{ paymentContent }}
                  </p>
                </div>
                <UButton
                  icon="i-lucide-copy"
                  size="md"
                  color="primary"
                  variant="subtle"
                  class="bg-neutral-100 hover:bg-neutral-200"
                  @click="copyPaymentContent"
                />
              </div>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-200">
            <h4 class="font-bold text-base mb-2 text-neutral-800">
              Thông tin chuyển khoản:
            </h4>
            <div class="space-y-1.5">
              <p class="text-sm text-neutral-700">
                <span class="font-medium">Ngân hàng:</span> {{ bankName }}
              </p>
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm text-neutral-700 flex-1 min-w-0">
                  <span class="font-medium">Số tài khoản:</span> {{ bankAccount }}
                </p>
                <UButton
                  icon="i-lucide-copy"
                  size="md"
                  color="primary"
                  variant="subtle"
                  class="bg-neutral-100 hover:bg-neutral-200"
                  @click="copyAccountNumber"
                />
              </div>
              <p class="text-sm text-neutral-700">
                <span class="font-medium">Chủ tài khoản:</span> {{ accountHolder }}
              </p>
            </div>
          </div>

          <UButton
            color="neutral"
            size="lg"
            block
            class="bg-neutral-700 hover:bg-neutral-800 text-white font-bold"
            @click="isOpen = false"
          >
            Đóng
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
