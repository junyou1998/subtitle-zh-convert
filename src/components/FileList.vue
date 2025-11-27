<script setup lang="ts">
import { computed } from 'vue';
import { useSubtitleList } from '../composables/useSubtitleList';
import { FileText, Trash2, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-vue-next';

const { files, removeFile, toggleSelection, toggleAllSelection } = useSubtitleList();

const emit = defineEmits<{
  (e: 'download-file', id: string): void;
  (e: 'compare-file', id: string): void;
}>();

const allSelected = computed({
  get: () => files.value.length > 0 && files.value.every(f => f.selected),
  set: (val) => toggleAllSelection(val)
});

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-400';
    case 'error': return 'text-red-400';
    case 'pending': return 'text-blue-400';
    default: return 'text-gray-400';
  }
};
</script>

<template>
  <div v-if="files.length > 0"
    class="w-full bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
    <!-- Header -->
    <div
      class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
      <input type="checkbox" v-model="allSelected"
        class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">全選 ({{ files.length }} 個檔案)</span>
    </div>

    <!-- List -->
    <div class="divide-y divide-gray-200 dark:divide-gray-700/50">
      <div v-for="file in files" :key="file.id"
        class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
        <input type="checkbox" :checked="file.selected" @change="toggleSelection(file.id)"
          class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer">

        <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors">
          <FileText class="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{{ file.originalFile.name }}</h3>
            <span class="text-xs text-gray-500 dark:text-gray-500">{{ formatSize(file.originalFile.size) }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs flex items-center gap-1" :class="getStatusColor(file.status)">
              <CheckCircle v-if="file.status === 'success'" class="w-3 h-3" />
              <AlertCircle v-else-if="file.status === 'error'" class="w-3 h-3" />
              <Loader2 v-else-if="file.status === 'pending'" class="w-3 h-3 animate-spin" />
              {{
                file.status === 'success' ? '轉換完成' :
                  file.status === 'error' ? (file.errorMessage || '轉換失敗') :
                    file.status === 'pending' ? '轉換中...' : '等待處理'
              }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button v-if="file.status === 'success'" @click="emit('compare-file', file.id)"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title="差異比較">
            <FileText class="w-5 h-5" />
          </button>
          <button v-if="file.status === 'success'" @click="emit('download-file', file.id)"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
            title="下載">
            <Download class="w-5 h-5" />
          </button>
          <button @click="removeFile(file.id)"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            title="移除">
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
