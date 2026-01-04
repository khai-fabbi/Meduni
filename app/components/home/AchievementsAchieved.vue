<script setup lang="ts">
import { motion } from 'motion-v'

const achievements = [
  {
    number: 5,
    description: 'Năm hoạt động',
    type: 'plus'
  },
  {
    number: 1_200,
    description: 'Chuyên gia tài năng'
  },
  {
    number: 30,
    description: 'Đối tác doanh nghiệp'
  },
  {
    number: 15_000,
    description: 'Học viên tham gia các chương trình miễn phí',
    type: 'plus'
  },
  {
    number: 4_500,
    description: 'Học viên tham gia cùng lúc',
    type: 'plus'
  },
  {
    number: 24_000,
    description: 'Học viên tốt nghiệp',
    type: 'plus'
  }
]

function formatNumberWithCommas(number: number) {
  return number.toLocaleString('vi-VN')
}

const sectionRef = ref<HTMLElement | null>(null)
const animatedNumbers = ref<number[]>(achievements.map(() => 0))
const hasAnimated = ref(false)

const { stop } = useIntersectionObserver(
  sectionRef,
  (entries) => {
    const entry = entries[0]
    if (entry?.isIntersecting && !hasAnimated.value) {
      hasAnimated.value = true
      achievements.forEach((achievement, index) => {
        const targetValue = achievement.number
        const duration = 2000
        const startTime = Date.now()
        const startValue = 0

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          const easeOut = 1 - Math.pow(1 - progress, 3)
          const currentValue = startValue + (targetValue - startValue) * easeOut

          animatedNumbers.value[index] = Math.floor(currentValue)

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            animatedNumbers.value[index] = targetValue
          }
        }

        requestAnimationFrame(animate)
      })
    }
  },
  { threshold: 0.3 }
)

onUnmounted(() => {
  stop()
})
</script>

<template>
  <UContainer class="py-6 space-y-6 md:py-15 md:space-y-8">
    <div class="space-y-2 text-center">
      <Heading
        variant="h3"
      >
        Học Viện MEDUNI cùng những <span class="text-secondary">con số ấn tượng</span>
      </Heading>
      <p class="max-w-[1000px] text-base md:text-lg mx-auto">
        Minh chứng cho chất lượng đào tạo AI, Học viện MEDUNI đã xây dựng một cộng đồng lớn mạnh với sự đồng hành của các chuyên gia và đối tác uy tín, luôn sẵn sàng mang đến những kiến thức AI tiên tiến nhất.
      </p>
    </div>

    <section
      ref="sectionRef"
      class="p-4 bg-gradient-to-b rounded-md from-secondary to-secondary-700"
    >
      <ul class="grid grid-cols-1 gap-4 text-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-7.5">
        <li
          v-for="(achievement, index) in achievements"
          :key="achievement.description"
        >
          <motion.div
            :initial="{ opacity: 0, y: 30, scale: 0.9 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }"
          >
            <div class="flex justify-center items-center">
              <motion.span
                class="flex gap-0.5 items-center text-3xl font-bold md:text-4xl"
                :initial="{ scale: 0.5, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :transition="{
                  duration: 0.5,
                  delay: index * 0.1 + 0.2,
                  ease: 'easeOut'
                }"
              >
                {{ formatNumberWithCommas(animatedNumbers[index] ?? 0) }}
                <motion.span
                  v-if="achievement.type === 'plus'"
                  :initial="{ rotate: -180, opacity: 0 }"
                  :animate="{ rotate: 0, opacity: 1 }"
                  :transition="{
                    duration: 0.4,
                    delay: index * 0.1 + 0.4,
                    ease: 'backOut'
                  }"
                >
                  <UIcon
                    name="i-lucide-plus"
                    class="size-7 stroke-5"
                  />
                </motion.span>
              </motion.span>
            </div>
            <motion.p
              class="text-base text-center md:text-lg"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{
                duration: 0.5,
                delay: index * 0.1 + 0.6
              }"
            >
              {{ achievement.description }}
            </motion.p>
          </motion.div>
        </li>
      </ul>
    </section>

    <div class="w-full h-full">
      <iframe
        width="100%"
        height="100%"
        class="object-cover w-full h-full rounded-md aspect-video"
        src="https://www.youtube.com/embed/KYS_IR-YqQE?rel=0"
        title="YouTube video player"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />
    </div>
  </UContainer>
</template>
