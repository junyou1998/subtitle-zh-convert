<script setup lang="ts">
import { onMounted } from 'vue';
import { useZhConvert } from './composables/useZhConvert';
import { useSubtitleList } from './composables/useSubtitleList';
import { useTheme } from './composables/useTheme';
import FileUploader from './components/FileUploader.vue';
import FileList from './components/FileList.vue';
import { Activity, Wifi, WifiOff } from 'lucide-vue-next';

import SettingsModal from './components/SettingsModal.vue';
import DiffModal from './components/DiffModal.vue';
import DisclaimerModal from './components/DisclaimerModal.vue';
import HelpSection from './components/HelpSection.vue';

const { isConnected, isChecking, checkConnection, convertSubtitle, getDiff, serviceInfo } = useZhConvert();
const { addFiles, selectedFiles, updateFileStatus, files } = useSubtitleList();
const { theme, cycleTheme } = useTheme();
import { ref, computed } from 'vue';
import { Play, Download, Settings, Moon, Sun, Monitor, HelpCircle, Github } from 'lucide-vue-next';

import JSZip from 'jszip';

const isConverting = ref(false);
const showSettings = ref(false);
const settings = ref({
  converter: 'Taiwan',
  jpTextStyles: 'protect',
  prettify: false,
  convertFilename: false,
  modules: {} as Record<string, number>,
});

const jpStyles = [
  { value: 'none', label: '無 (當成中文處理)' },
  { value: 'protect', label: '保護 (不轉換日文)' },
  { value: 'protectOnlySameOrigin', label: '僅保護原文與日文相同的字' },
  { value: 'fix', label: '修正 (嘗試修復日文漢字)' },
];

const handleFilesSelected = (files: File[]) => {
  addFiles(files);
};

const startConversion = async () => {
  if (selectedFiles.value.length === 0 || isConverting.value) return;

  isConverting.value = true;

  for (const file of selectedFiles.value) {
    if (file.status === 'success') continue; // Skip already converted

    updateFileStatus(file.id, 'pending');
    try {
      const convertedText = await convertSubtitle(file.originalContent, {
        converter: settings.value.converter,
        jpTextStyles: settings.value.jpTextStyles,
        modules: settings.value.modules,
      });
      // Update file with converted content
      file.convertedContent = convertedText;

      // Handle filename conversion
      if (settings.value.convertFilename) {
        try {
          // Remove extension, convert, then add extension back
          const lastDotIndex = file.originalFile.name.lastIndexOf('.');
          const name = lastDotIndex !== -1 ? file.originalFile.name.substring(0, lastDotIndex) : file.originalFile.name;
          const ext = lastDotIndex !== -1 ? file.originalFile.name.substring(lastDotIndex) : '';

          const convertedName = await convertSubtitle(name, {
            converter: settings.value.converter,
            jpTextStyles: settings.value.jpTextStyles,
            modules: settings.value.modules,
          });
          file.convertedFilename = convertedName + ext;
        } catch (e) {
          console.warn('Filename conversion failed, using original name', e);
          file.convertedFilename = file.originalFile.name;
        }
      } else {
        file.convertedFilename = file.originalFile.name;
      }

      updateFileStatus(file.id, 'success');
    } catch (err: any) {
      updateFileStatus(file.id, 'error', err.message);
    }
  }

  isConverting.value = false;
};

const downloadFile = (fileId: string) => {
  const file = files.value.find(f => f.id === fileId);
  if (!file || !file.convertedContent || !file.convertedFilename) return;

  const blob = new Blob([file.convertedContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.convertedFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadSelected = async () => {
  const filesToDownload = selectedFiles.value.filter(f => f.status === 'success' && f.convertedContent);
  if (filesToDownload.length === 0) return;

  if (filesToDownload.length === 1) {
    downloadFile(filesToDownload[0].id);
    return;
  }

  const zip = new JSZip();
  filesToDownload.forEach(file => {
    if (file.convertedContent && file.convertedFilename) {
      zip.file(file.convertedFilename, file.convertedContent);
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted_subtitles.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const hasSelectedFiles = computed(() => selectedFiles.value.length > 0);
const hasConvertedFiles = computed(() => selectedFiles.value.some(f => f.status === 'success'));

// Diff Modal State
const showDiff = ref(false);
const showDisclaimer = ref(false);
const isDiffLoading = ref(false);
const currentDiffFile = ref<{ original: string; converted: string; diff: string | null; id: string } | null>(null);

const handleCompareFile = async (fileId: string) => {
  const file = files.value.find(f => f.id === fileId);
  if (!file || !file.convertedContent) return;

  currentDiffFile.value = {
    id: file.id,
    original: file.originalContent,
    converted: file.convertedContent,
    diff: null,
  };
  showDiff.value = true;

  await fetchDiff(file.originalContent);
};

const fetchDiff = async (text: string) => {
  if (!currentDiffFile.value) return;

  isDiffLoading.value = true;
  try {
    const diff = await getDiff(text, {
      converter: settings.value.converter,
      jpTextStyles: settings.value.jpTextStyles,
      modules: settings.value.modules,
    });
    if (currentDiffFile.value) {
      currentDiffFile.value.diff = diff;
    }
  } catch (err) {
    console.error('Failed to fetch diff:', err);
    // Fallback or error handling could go here
  } finally {
    isDiffLoading.value = false;
  }
};

onMounted(() => {
  checkConnection();
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 transition-colors duration-200">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-500/20 rounded-lg">
            <Activity class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            ZhConvert 字幕轉換器
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <!-- GitHub Link -->
          <a href="https://github.com/junyou1998/subtitle-zh-convert" target="_blank"
            class="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="GitHub 儲存庫">
            <Github class="w-5 h-5" />
          </a>

          <!-- Disclaimer/Help Button -->
          <button @click="showDisclaimer = true"
            class="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="免責聲明與使用條款">
            <HelpCircle class="w-5 h-5" />
          </button>

          <!-- Theme Toggle -->
          <button @click="cycleTheme"
            class="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            :title="theme === 'system' ? '系統預設' : (theme === 'dark' ? '深色模式' : '淺色模式')">
            <Monitor v-if="theme === 'system'" class="w-5 h-5" />
            <Moon v-else-if="theme === 'dark'" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>

          <!-- API Status -->
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div v-if="isChecking" class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <component :is="isConnected ? Wifi : WifiOff" class="w-4 h-4"
              :class="isConnected ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'" />
            <span class="text-sm font-medium"
              :class="isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ isChecking ? '連線中...' : (isConnected ? 'API 連線正常' : 'API 連線失敗') }}
            </span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="space-y-6">
        <FileUploader @files-selected="handleFilesSelected" />

        <!-- Basic Settings -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Converter Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">轉換模式</label>
            <select v-model="settings.converter"
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors">
              <option v-for="(info, key) in serviceInfo?.converters || {}" :key="key" :value="key">
                {{ info.name }} ({{ info.desc }})
              </option>
            </select>
          </div>

          <!-- Japanese Text Style -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">日文處理策略</label>
            <select v-model="settings.jpTextStyles"
              class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors">
              <option v-for="style in jpStyles" :key="style.value" :value="style.value">
                {{ style.label }}
              </option>
            </select>
          </div>

          <!-- Filename Conversion -->
          <div class="flex items-end pb-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="settings.convertFilename"
                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500/50">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">轉換檔名</span>
            </label>
          </div>
        </div>

        <!-- Control Bar -->
        <div v-if="files.length > 0"
          class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center gap-4">
            <button @click="startConversion" :disabled="!hasSelectedFiles || isConverting || !isConnected"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer">
              <Play class="w-4 h-4" :class="{ 'fill-current': !isConverting }" />
              {{ isConverting ? '轉換中...' : '開始轉換' }}
            </button>
            <button @click="downloadSelected" :disabled="!hasConvertedFiles"
              class="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer">
              <Download class="w-4 h-4" />
              下載選取
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button @click="showSettings = true"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              title="進階設定">
              <Settings class="w-5 h-5" />
              <span>進階設定</span>
            </button>
          </div>
        </div>

        <FileList @download-file="downloadFile" @compare-file="handleCompareFile" />
      </main>

      <HelpSection />

      <SettingsModal :is-open="showSettings" v-model:settings="settings" :converters="serviceInfo?.converters || {}"
        :modules="serviceInfo?.modules || {}" @close="showSettings = false" />

      <DiffModal :is-open="showDiff" :original-text="currentDiffFile?.original || ''"
        :converted-text="currentDiffFile?.converted || ''" :diff-html="currentDiffFile?.diff || null"
        :is-loading="isDiffLoading" @close="showDiff = false"
        @refresh="currentDiffFile && fetchDiff(currentDiffFile.original)" />

      <DisclaimerModal :is-open="showDisclaimer" @close="showDisclaimer = false" />

      <!-- Footer -->
      <footer class="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p class="mb-2">Powered by <a href="https://zhconvert.org" target="_blank"
            class="text-blue-600 dark:text-blue-400 hover:underline">ZhConvert 繁化姬</a></p>
        <button @click="showDisclaimer = true"
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline cursor-pointer">
          免責聲明與使用條款
        </button>
      </footer>
    </div>
  </div>
</template>
