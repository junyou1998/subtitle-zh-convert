<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';

interface Settings {
  converter: string;
  jpTextStyles: string;
  prettify: boolean;
  convertFilename: boolean;
  modules: Record<string, number>;
}

const props = defineProps<{
  isOpen: boolean;
  settings: Settings;
  converters: Record<string, any>;
  modules: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:settings', settings: Settings): void;
}>();

const localSettings = ref<Settings>({ ...props.settings });

// Initialize modules if empty
if (!localSettings.value.modules) {
  localSettings.value.modules = {};
}

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings };
  if (!localSettings.value.modules) {
    localSettings.value.modules = {};
  }
}, { deep: true });

watch(() => props.isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const save = () => {
  emit('update:settings', localSettings.value);
  emit('close');
};

const toggleModule = (key: string) => {
  if (localSettings.value.modules[key] === 1) {
    delete localSettings.value.modules[key];
  } else {
    localSettings.value.modules[key] = 1;
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">進階設定 (模組)</h2>
          <button @click="$emit('close')"
            class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            啟用特定的詞彙轉換模組以獲得更精確的結果。
          </p>

          <div class="space-y-3">
            <div v-for="(info, key) in modules" :key="key"
              class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              @click="toggleModule(key as string)">
              <div class="flex h-5 items-center">
                <input type="checkbox" :checked="localSettings.modules[key] === 1"
                  class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500/50 bg-white dark:bg-gray-700">
              </div>
              <div class="text-sm">
                <label class="font-medium text-gray-900 dark:text-white cursor-pointer">{{ info.name }}</label>
                <p class="text-gray-500 dark:text-gray-400">{{ info.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            取消
          </button>
          <button @click="save"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
            儲存設定
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
