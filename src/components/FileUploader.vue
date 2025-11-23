<script setup lang="ts">
import { ref } from 'vue';
import { UploadCloud } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'files-selected', files: File[]): void;
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  if (e.dataTransfer?.files) {
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.name.endsWith('.ass') || file.name.endsWith('.srt')
    );
    if (files.length > 0) {
      emit('files-selected', files);
    }
  }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    emit('files-selected', files);
    // Reset input so same files can be selected again if needed
    target.value = '';
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div
    class="w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-4"
    :class="[
      isDragging
        ? 'border-blue-500 bg-blue-500/10'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50'
    ]" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop" @click="triggerFileInput">
    <input ref="fileInput" type="file" multiple accept=".ass,.srt" class="hidden" @change="handleFileSelect" />

    <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors">
      <UploadCloud class="w-8 h-8 text-blue-500 dark:text-blue-400" />
    </div>

    <div class="text-center">
      <p class="text-lg font-medium text-gray-900 dark:text-gray-200">
        點擊或拖曳檔案至此
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        支援 .ass 與 .srt 字幕檔
      </p>
    </div>
  </div>
</template>
