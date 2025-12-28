<script setup lang="ts">
import { motion } from 'motion-v'

const route = useRoute()
const isSignupPage = computed(() => route.path === '/signup')

const greetingText = 'Xin chào!'
const greetingChars = greetingText.split('')
</script>

<template>
  <div class="h-screen flex overflow-hidden">
    <UButton
      icon="i-lucide-chevron-left"
      to="/"
      size="xl"
      color="primary"
      variant="subtle"
      class="absolute md:left-8 left-4 top-4 md:top-8 rounded-full z-10"
    />

    <div
      class="flex-1 hidden md:flex items-center justify-center px-12 bg-gray-50 dark:bg-gray-900 overflow-y-auto"
    >
      <div class="max-w-lg w-full space-y-12 text-center">
        <motion.div
          :initial="{ opacity: 0, scale: 0.85, y: -20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
        >
          <NuxtImg
            src="/Robot.png"
            class="w-80 h-auto mx-auto"
          />
        </motion.div>

        <div class="space-y-4">
          <h1
            class="text-5xl font-bold dark:text-white flex justify-center gap-0.5"
          >
            <template
              v-for="(char, index) in greetingChars"
              :key="index"
            >
              <motion.span
                v-if="char !== ' '"
                :initial="{ opacity: 0, y: 30, scale: 0.5 }"
                :animate="{ opacity: 1, y: 0, scale: 1 }"
                :transition="{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut'
                }"
                class="inline-block"
              >
                {{ char }}
              </motion.span>
              <span
                v-else
                class="inline-block w-2"
              />
            </template>
          </h1>
          <motion.p
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.2, ease: 'easeOut' }"
            class="text-lg text-default dark:text-gray-400"
          >
            Chào mừng bạn đến với Học viện MEDUNI. <br>

            <span v-if="isSignupPage">
              Nếu bạn đã có tài khoản hãy nhấp đăng nhập
            </span>
            <span v-else>
              Nếu bạn chưa có tài khoản hãy nhấp đăng ký để tạo tài khoản Học
              viện MEDUNI nhanh chóng
            </span>
          </motion.p>
        </div>

        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.4, ease: 'easeOut' }"
        >
          <UButton
            v-if="isSignupPage"
            to="/login"
            variant="outline"
            size="xl"
            class="w-full max-w-[258px] justify-center min-h-14 text-lg"
            trailing-icon="i-lucide-arrow-right"
          >
            Đăng nhập
          </UButton>
          <UButton
            v-else
            to="/signup"
            variant="outline"
            size="xl"
            class="w-full max-w-[258px] justify-center min-h-14 text-lg"
            trailing-icon="i-lucide-arrow-right"
          >
            Đăng ký
          </UButton>
        </motion.div>
      </div>
    </div>

    <motion.div
      :initial="{ opacity: 0, x: 50 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ duration: 0.6, delay: 0.3, ease: 'easeOut' }"
      class="flex-1 h-full flex items-center justify-center overflow-y-auto px-4 md:px-12 py-4 md:py-8"
    >
      <div class="max-w-md size-full flex items-center justify-center">
        <slot />
      </div>
    </motion.div>
  </div>
</template>
