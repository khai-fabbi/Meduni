<script setup lang="ts">
useSeoMeta({
  title: 'Hỗ trợ',
  description: 'Trung tâm hỗ trợ'
})

definePageMeta({
  layout: 'profile'
})

const supportTickets = ref([
  {
    id: 1,
    title: 'Không thể truy cập khoá học',
    description: 'Tôi không thể truy cập vào khoá học \'AI trong Y tế\' mặc dù đã thanh toán',
    status: 'open',
    createdAt: '20/12/2024',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Vấn đề về chứng nhận',
    description: 'Chứng nhận của tôi không hiển thị đúng thông tin',
    status: 'in-progress',
    createdAt: '18/12/2024',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Câu hỏi về nội dung khoá học',
    description: 'Tôi có một số câu hỏi về bài học số 5 trong khoá học Y tế cộng đồng',
    status: 'resolved',
    createdAt: '10/12/2024',
    priority: 'low'
  }
])

const faqs = ref([
  {
    question: 'Làm thế nào để tải xuống chứng nhận?',
    answer: 'Bạn có thể tải xuống chứng nhận từ trang \'Chứng nhận của bạn\' sau khi hoàn thành khoá học.'
  },
  {
    question: 'Tôi có thể hoàn tiền không?',
    answer: 'Có, bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày mua khoá học.'
  },
  {
    question: 'Làm thế nào để liên hệ với giảng viên?',
    answer: 'Bạn có thể gửi tin nhắn cho giảng viên thông qua hệ thống tin nhắn trong khoá học.'
  },
  {
    question: 'Khoá học có thời hạn không?',
    answer: 'Khoá học của bạn có thời hạn truy cập không giới hạn sau khi mua.'
  }
])

const newTicket = ref({
  title: '',
  description: '',
  priority: 'medium'
})

const showNewTicket = ref(false)

const createTicket = () => {
  if (newTicket.value.title && newTicket.value.description) {
    supportTickets.value.unshift({
      id: supportTickets.value.length + 1,
      ...newTicket.value,
      status: 'open',
      createdAt: new Date().toLocaleDateString('vi-VN')
    })
    newTicket.value = { title: '', description: '', priority: 'medium' }
    showNewTicket.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-sm p-6">
    <Heading
      variant="h3"
      class="mb-6"
    >
      Hỗ trợ
    </Heading>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">
            Yêu cầu hỗ trợ
          </h2>
          <UButton
            color="primary"
            size="sm"
            @click="showNewTicket = !showNewTicket"
          >
            Tạo yêu cầu mới
          </UButton>
        </div>

        <div
          v-if="showNewTicket"
          class="mb-6 p-4 border rounded-lg bg-gray-50"
        >
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">Tiêu đề</label>
              <UInput
                v-model="newTicket.title"
                placeholder="Nhập tiêu đề yêu cầu"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">Mô tả</label>
              <UTextarea
                v-model="newTicket.description"
                placeholder="Mô tả chi tiết vấn đề của bạn"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">Mức độ ưu tiên</label>
              <USelect
                v-model="newTicket.priority"
                :options="['low', 'medium', 'high']"
              />
            </div>
            <div class="flex gap-2">
              <UButton
                color="primary"
                @click="createTicket"
              >
                Gửi yêu cầu
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                @click="showNewTicket = false"
              >
                Hủy
              </UButton>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="ticket in supportTickets"
            :key="ticket.id"
            class="p-4 border rounded-lg"
          >
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold">
                {{ ticket.title }}
              </h3>
              <UBadge
                :color="ticket.status === 'resolved' ? 'success' : ticket.status === 'in-progress' ? 'info' : 'warning'"
                size="sm"
              >
                {{ ticket.status === 'resolved' ? 'Đã giải quyết' : ticket.status === 'in-progress' ? 'Đang xử lý' : 'Mới' }}
              </UBadge>
            </div>
            <p class="text-gray-600 text-sm mb-2">
              {{ ticket.description }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ ticket.createdAt }}</span>
              <UBadge
                :color="ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'neutral'"
                size="xs"
              >
                {{ ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp' }}
              </UBadge>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">
          Câu hỏi thường gặp
        </h2>
        <div class="space-y-3">
          <UAccordion :items="faqs.map(faq => ({ label: faq.question, content: faq.answer }))" />
        </div>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold mb-2">
            Liên hệ trực tiếp
          </h3>
          <p class="text-sm text-gray-600 mb-3">
            Nếu bạn cần hỗ trợ ngay lập tức, vui lòng liên hệ với chúng tôi:
          </p>
          <div class="space-y-2 text-sm">
            <p><strong>Email:</strong> support@example.com</p>
            <p><strong>Hotline:</strong> 1900 1234</p>
            <p><strong>Thời gian:</strong> 8:00 - 22:00 (T2 - CN)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
