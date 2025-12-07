<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { signupSchema, type SignupSchema } from "~/utils/schema/signup";

export interface JSConfettiApi {
  JSConfetti: {
    new (): {
      addConfetti: (options?: {
        emojis?: string[];
        confettiColors?: string[];
        confettiRadius?: number;
        confettiNumber?: number;
        confettiWind?: number;
      }) => void;
    };
  };
}

declare global {
  interface Window extends JSConfettiApi {}
}

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Đăng ký",
  description: "Tạo tài khoản mới để bắt đầu",
});

const { onLoaded } = useScriptNpm<JSConfettiApi>({
  packageName: "js-confetti",
  file: "dist/js-confetti.browser.js",
  version: "0.12.0",
  scriptOptions: {
    use() {
      return { JSConfetti: window.JSConfetti };
    },
    bundle: true,
  },
});

const toast = useToast();

const signupForm = reactive({
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
});

const isLoading = ref(false);

async function onSubmit(payload: FormSubmitEvent<SignupSchema>) {
  try {
    isLoading.value = true;
    console.log("Submitted", payload.data);

    onLoaded(({ JSConfetti }) => {
      const confetti = new JSConfetti();
      // fully typed!
      confetti.addConfetti({
        confettiColors: [
          "#ff0a54",
          "#ff477e",
          "#ff7096",
          "#ff85a1",
          "#fbb1bd",
          "#f9bec7",
        ],
        confettiRadius: 6,
        confettiNumber: 100,
        confettiWind: 10,
      });
    });

    toast.add({
      title: "Đăng ký thành công",
      description:
        "Bạn đã đăng ký thành công! Vui lòng kiểm tra email để tiếp tục",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Đăng ký thất bại",
      description: error instanceof Error ? error.message : "Có lỗi xảy ra",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="w-full space-y-6 h-full">
    <div class="text-center space-y-4">
      <AppLogo class="w-76 h-auto mx-auto" />

      <h1
        class="mt-8 md:text-5xl text-4xl font-bold dark:text-white text-primary"
      >
        Đăng ký
      </h1>

      <p class="md:text-lg text-base text-default">
        Bạn hãy điền đầy đủ thông tin bên dưới để tiến hành đăng ký!
      </p>
    </div>

    <UForm
      :schema="signupSchema"
      :state="signupForm"
      class="flex flex-col gap-3 flex-1"
      @submit="onSubmit"
      :disabled="isLoading"
      autocomplete="off"
    >
      <UFormField label="Họ và tên" name="fullName" required>
        <UInput
          v-model="signupForm.fullName"
          class="w-full"
          placeholder="Nhập họ và tên của bạn"
          size="xl"
          icon="i-lucide-user"
          autocomplete="off"
        />
      </UFormField>

      <UFormField label="Số điện thoại" name="phone" required>
        <UInput
          v-model="signupForm.phone"
          class="w-full"
          placeholder="Nhập số điện thoại của bạn"
          size="xl"
          icon="i-lucide-phone"
          autocomplete="off"
        />
      </UFormField>

      <UFormField label="Email" name="email" required>
        <UInput
          v-model="signupForm.email"
          class="w-full"
          placeholder="Nhập email của bạn"
          size="xl"
          icon="i-lucide-mail"
          autocomplete="off"
        />
      </UFormField>

      <UFormField label="Mật khẩu" name="password" required>
        <SharedInputPassword
          v-model="signupForm.password"
          class="w-full"
          size="xl"
          placeholder="Nhập mật khẩu"
          autocomplete="new-password"
        />
      </UFormField>

      <UFormField label="Nhập lại mật khẩu" name="confirmPassword" required>
        <SharedInputPassword
          v-model="signupForm.confirmPassword"
          class="w-full"
          size="xl"
          placeholder="Nhập lại mật khẩu"
          autocomplete="new-password"
        />
      </UFormField>

      <UFormField label="Mã giới thiệu" name="referralCode">
        <UInput
          v-model="signupForm.referralCode"
          class="w-full"
          placeholder="Nhập mã giới thiệu (nếu có)"
          size="xl"
          icon="i-lucide-gift"
          autocomplete="off"
        />
      </UFormField>

      <UButton
        type="submit"
        size="xl"
        class="w-full min-h-14 text-lg mt-2"
        block
        :disabled="isLoading"
        :loading="isLoading"
      >
        Đăng ký
      </UButton>
    </UForm>

    <div class="text-center block md:hidden">
      <p class="text-default">
        Đã có tài khoản?
        <ULink
          to="/login"
          class="text-primary font-semibold animate-link-underline"
          >Đăng nhập</ULink
        >
      </p>
    </div>
  </div>
</template>
