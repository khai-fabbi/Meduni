<script setup lang="ts">
import type { UserProps } from '@nuxt/ui'
import CommentIcon from '~/assets/icons/comment.svg'

// const feedbacks = [
//   {
//     name: 'Nguyễn Thị Minh',
//     content: 'Nền tảng rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Khóa học ngắn gọn, dễ hiểu và cập nhật theo thực hành lâm sàng hằng ngày. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.',
//     image: 'https://picsum.photos/640/640?random=1',
//     role: 'Điều dưỡng trưởng - Bệnh viện Đa khoa tỉnh'
//   },
//   {
//     name: 'Trần Văn Bình',
//     content: 'Tôi đánh giá rất cao các mô phỏng ca bệnh bằng AI. Những tình huống cấp cứu thường gặp được mô phỏng sát thực tế, giúp tôi luyện phản xạ và xử lý tình huống an toàn hơn trước khi thực hành trên bệnh nhân thật.',
//     image: 'https://picsum.photos/640/640?random=2',
//     role: 'Bác sĩ nội trú Khoa Cấp cứu – Hồi sức tích cực'
//   },
//   {
//     name: 'Lê Thị Cẩm',
//     content: 'Các khóa học về Y tế cộng đồng trên MedUni.ai cực kỳ thiết thực. Tài liệu được thẩm định kỹ, nội dung cập nhật theo tiêu chuẩn WHO. Là cán bộ CDC, tôi cần kiến thức chuẩn xác – và MedUni.ai đáp ứng rất tốt điều đó.',
//     image: 'https://picsum.photos/640/640?random=3',
//     role: 'Chuyên viên dịch tễ - CDC Hà Nội'
//   },
//   {
//     name: 'Phạm Văn Dũng',
//     content: 'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.',
//     image: 'https://picsum.photos/640/640?random=4',
//     role: 'Kỹ thuật viên y tế - Bệnh viện Đa khoa tỉnh'
//   },
//   {
//     name: 'Nguyễn Văn E',
//     content: 'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.',
//     image: 'https://picsum.photos/640/640?random=5',
//     role: 'Kỹ thuật viên y tế - Bệnh viện Đa khoa tỉnh'
//   }
// ]

const testimonials: { user: UserProps, quote: string }[] = [
  {
    user: {
      name: 'Nguyễn Thị Minh',
      description: 'Điều dưỡng trưởng - Bệnh viện Đa khoa tỉnh',
      avatar: {
        src: 'https://media.licdn.com/dms/image/v2/C4E03AQEY3pmXsH8hDg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1519741249442?e=1746057600&v=beta&t=dvQfBT9ah03MPNy9cnly30ugreeCdxG4nrxV3lwKAC8',
        loading: 'lazy'
      }
    },
    quote:
      'Nền tảng rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Khóa học ngắn gọn, dễ hiểu và cập nhật theo thực hành lâm sàng hằng ngày. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.'
  },
  {
    user: {
      name: 'Trần Văn Bình',
      description: 'Bác sĩ nội trú Khoa Cấp cứu – Hồi sức tích cực',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1824690890222485504/lQ7v1AGt_400x400.jpg',
        loading: 'lazy'
      }
    },
    quote:
      'Tôi đánh giá rất cao các mô phỏng ca bệnh bằng AI. Những tình huống cấp cứu thường gặp được mô phỏng sát thực tế, giúp tôi luyện phản xạ và xử lý tình huống an toàn hơn trước khi thực hành trên bệnh nhân thật.'
  },
  {
    user: {
      name: 'Lê Thị Cẩm',
      description: 'Chuyên viên dịch tễ - CDC Hà Nội',
      avatar: {
        src: 'https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/acidjazz',
        srcset: 'https://ipx.nuxt.com/f_auto,s_80x80/gh_avatar/acidjazz 2x',
        loading: 'lazy'
      }
    },
    quote:
      'Các khóa học về Y tế cộng đồng trên MedUni.ai cực kỳ thiết thực. Tài liệu được thẩm định kỹ, nội dung cập nhật theo tiêu chuẩn WHO. Là cán bộ CDC, tôi cần kiến thức chuẩn xác – và MedUni.ai đáp ứng rất tốt điều đó.'
  },
  {
    user: {
      name: 'Phạm Văn Dũng',
      description: 'Senior Frontend Developer',
      avatar: {
        src: 'https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/mokkapps',
        srcset: 'https://ipx.nuxt.com/f_auto,s_80x80/gh_avatar/mokkapps 2x',
        loading: 'lazy'
      }
    },
    quote:
      'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.'
  },
  {
    user: {
      name: 'Nguyễn Văn E',
      description: 'Kỹ thuật viên y tế - Bệnh viện Đa khoa tỉnh',
      avatar: {
        src: 'https://ipx.nuxt.com/f_auto,s_40x40/gh_avatar/harlan-zw',
        srcset: 'https://ipx.nuxt.com/f_auto,s_80x80/gh_avatar/harlan-zw 2x',
        loading: 'lazy'
      }
    },
    quote:
      'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.'
  }
  // {
  //   user: {
  //     name: 'Nguyễn Văn F',
  //     description: 'Y tế cộng đồng - CDC Hà Nội',
  //     avatar: {
  //       src: 'https://pbs.twimg.com/profile_images/1374040164180299791/ACw4G3nZ_400x400.jpg',
  //       loading: 'lazy'
  //     }
  //   },
  //   quote:
  //     'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.'
  // },
  // {
  //   user: {
  //     name: 'Nguyễn Văn G',
  //     description: 'YouTuber and SaaS builder',
  //     avatar: {
  //       src: 'https://pbs.twimg.com/profile_images/1607353032420769793/I8qQSUfQ_400x400.jpg',
  //       loading: 'lazy'
  //     }
  //   },
  //   quote:
  //     'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.'
  // },
  // {
  //   user: {
  //     name: 'Nguyễn Văn H',
  //     description: 'Web developer and UnJS member',
  //     avatar: {
  //       src: 'https://pbs.twimg.com/profile_images/1801649350319218689/aS_X_iTm_400x400.jpg',
  //       loading: 'lazy'
  //     }
  //   },
  //   quote:
  //     'MedUni.ai giúp tôi học được nhiều kiến thức mới và áp dụng vào thực tế. Khóa học được thiết kế rất phù hợp với nhân viên y tế tuyến đầu, đặc biệt là những người bận rộn như tôi. Nhờ MedUni.ai, tôi học được nhiều kỹ năng mới mà trước đây không có thời gian tiếp cận.'
  // }
]
</script>

<template>
  <div>
    <Heading class="text-center">
      Feedback từ học viên
    </Heading>
    <p class="mt-2 text-center">
      Nhân viên y tế nói gì về MedUni.ai
    </p>
    <div class="mt-15 w-full">
      <UMarquee
        pause-on-hover
        :overlay="true"
        :ui="{ root: '[--gap:--spacing(6)] [--duration:40s]', content: 'w-auto py-2 animation-play-state:paused' }"
        :repeat="2"
      >
        <UPageCard
          v-for="(testimonial, index) in testimonials"
          :key="index"
          variant="subtle"
          :description="testimonial.quote"
          :ui="{
            description: 'line-clamp-7 min-h-[8.75rem] text-default',
            root: 'bg-white h-full rounded-xl shadow-md ring-0',
            container: 'h-full'
          }"
          class="w-full h-full max-w-sm shrink-0"
        >
          <template
            #footer
          >
            <div class="flex items-center">
              <UUser
                v-bind="testimonial.user"
                size="3xl"
                :ui="{
                  root: 'flex-1',
                  avatar: 'size-15',
                  name: 'font-bold',
                  description: 'line-clamp-2 text-base text-default'
                }"
              />
              <CommentIcon class="size-26 -mr-3" />
            </div>
          </template>
        </UPageCard>
      </UMarquee>
    </div>
  </div>
</template>
