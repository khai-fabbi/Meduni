<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import IconSmsCode from "~/assets/icons/sms-code.svg";

interface Props {
  contactInfo: string;
  contactType: "email" | "phone";
  loading: boolean;
}

const props = defineProps<Props>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<{ otp: number[] }>];
  resend: [];
}>();

const otpValue = ref<number[]>([]);

const countdownSeconds = shallowRef(20);
const {
  remaining: remainingSeconds,
  start,
  reset,
} = useCountdown(countdownSeconds, {
  interval: 1000,
});

function resendOTP() {
  if (remainingSeconds.value > 0) return;
  emit("resend");
  start();
}

function handleFormSubmit() {
  if (otpValue.value.length !== 6) return;
  const payload: FormSubmitEvent<{ otp: number[] }> = {
    data: { otp: otpValue.value },
  } as FormSubmitEvent<{ otp: number[] }>;
  emit("submit", payload);
}

watch(open, (newValue) => {
  if (newValue) {
    otpValue.value = [];
    start(countdownSeconds.value);
  }
});

onUnmounted(() => {
  reset(countdownSeconds.value);
});
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'sm:max-w-lg text-center',
      header: 'hidden',
      overlay: 'bg-black/40 backdrop-blur-[2px]',
    }"
    :close="{
      class: 'hidden',
    }"
    title="OTP"
    description="OTP"
  >
    <template #body>
      <div class="ring-10 ring-primary/10 rounded-full mx-auto w-fit my-8">
        <div
          class="flex size-13 justify-center items-center rounded-full bg-primary/20"
        >
          <IconSmsCode class="size-8 animate-stroke-draw" />
        </div>
      </div>
      <div class="space-y-3">
        <h4 class="text-xl font-bold">Vui lòng kiểm tra điện thoại</h4>
        <p>
          Chúng tôi đã gửi một mã OTP tới
          {{ contactType === "email" ? "email" : "số điện thoại" }}:
          <span class="font-medium text-primary">{{ contactInfo }}</span>
          <br />
          Mã này hết hiệu lực sau
          <span class="font-medium text-primary"
            >{{ remainingSeconds }} giây</span
          >
        </p>

        <UForm
          :state="{ otp: otpValue }"
          @submit="handleFormSubmit"
          class="space-y-4"
          :disabled="loading"
        >
          <UFormField name="otp">
            <UPinInput
              size="xl"
              v-model="otpValue"
              :length="6"
              type="number"
              :ui="{
                base: 'md:w-16 md:h-16 w-12 h-12 text-2xl md:text-3xl font-bold text-primary border-primary',
              }"
              :disabled="loading"
            />
          </UFormField>

          <div>
            <span class="text-neutral-600"> Bạn không nhận được mã? </span>
            <UButton
              variant="link"
              :disabled="countdownSeconds > 0 || loading"
              @click="resendOTP"
              class="pl-1"
              type="button"
            >
              Gửi lại mã
            </UButton>
          </div>

          <div class="space-x-4 mt-4 md:mt-8 flex">
            <UButton
              variant="outline"
              @click="open = false"
              class="w-full min-h-14 text-lg"
              size="xl"
              block
              type="button"
              :disabled="loading"
            >
              Quay lại
            </UButton>
            <UButton
              type="submit"
              size="xl"
              class="w-full min-h-14 text-lg"
              block
              :disabled="otpValue.length !== 6"
              @click="handleFormSubmit"
              :loading="loading"
            >
              Xác nhận
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
