<script setup lang="ts">
useSeoMeta({
  title: "Chứng nhận của bạn",
  description: "Chứng nhận đã hoàn thành",
});

definePageMeta({
  layout: "profile",
});

const certificates = ref([
  {
    id: 1,
    title: "Chứng nhận hoàn thành khoá học AI trong Y tế",
    course: "AI trong Y tế",
    issuedDate: "15/12/2024",
    certificateId: "CERT-2024-001",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400",
    status: "completed",
  },
  {
    id: 2,
    title: "Chứng nhận hoàn thành khoá học Y tế cộng đồng",
    course: "Y tế cộng đồng",
    issuedDate: "10/11/2024",
    certificateId: "CERT-2024-002",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
    status: "completed",
  },
  {
    id: 3,
    title: "Chứng nhận hoàn thành Lộ trình học tập",
    course: "Lộ trình học tập",
    issuedDate: "05/10/2024",
    certificateId: "CERT-2024-003",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    status: "completed",
  },
]);
</script>

<template>
  <div class="bg-white rounded-sm p-6">
    <h1 class="text-2xl font-bold mb-6">Chứng nhận của bạn</h1>

    <div v-if="certificates.length === 0" class="text-center py-12">
      <p class="text-gray-500">Bạn chưa có chứng nhận nào</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="certificate in certificates"
        :key="certificate.id"
        class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <img
          :src="certificate.image"
          :alt="certificate.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">{{ certificate.course }}</h3>
          <p class="text-gray-600 text-sm mb-1">Mã chứng nhận: {{ certificate.certificateId }}</p>
          <p class="text-gray-600 text-sm mb-4">Ngày cấp: {{ certificate.issuedDate }}</p>
          <div class="flex gap-2">
            <UButton color="primary" variant="outline" size="sm" block>
              <UIcon name="i-lucide-download" class="w-4 h-4 mr-2" />
              Tải xuống
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-share-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

