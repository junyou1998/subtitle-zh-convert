<script setup lang="ts">
import { X, RefreshCw } from 'lucide-vue-next';

defineProps<{
    isOpen: boolean;
    diffHtml: string | null;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'refresh'): void;
}>();

</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            class="w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div class="flex items-center gap-4">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">差異比較</h2>
                    <button @click="emit('refresh')"
                        class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        :disabled="isLoading" title="重新載入差異">
                        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                    </button>
                </div>
                <button @click="emit('close')"
                    class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-hidden relative">
                <div v-if="isLoading"
                    class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10">
                    <div class="flex flex-col items-center gap-2">
                        <RefreshCw class="w-8 h-8 text-blue-500 animate-spin" />
                        <span class="text-sm text-gray-600 dark:text-gray-300">載入差異中...</span>
                    </div>
                </div>

                <div v-if="diffHtml" class="w-full h-full overflow-auto p-4 bg-white dark:bg-gray-900">
                    <!-- Render API Diff HTML -->
                    <div v-html="diffHtml" class="diff-container"></div>
                </div>

                <div v-else class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>尚無差異資料，請點擊重新整理載入。</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Scoped styles for the diff HTML content */
.diff-container table {
    width: 100%;
    border-collapse: collapse;
    font-family: monospace;
    font-size: 14px;
}

.diff-container td {
    padding: 2px 4px;
    vertical-align: top;
    word-break: break-all;
}

.diff-container .diff-line-num {
    color: #999;
    text-align: right;
    padding-right: 8px;
    user-select: none;
    width: 1%;
    white-space: nowrap;
}

.diff-container .diff-content {
    white-space: pre-wrap;
}

/* Light mode diff colors */
.diff-container del {
    background-color: #fee2e2;
    /* red-100 */
    color: #991b1b;
    /* red-800 */
    text-decoration: none;
    padding: 0 2px;
    border-radius: 2px;
}

.diff-container ins {
    background-color: #dcfce7;
    /* green-100 */
    color: #166534;
    /* green-800 */
    text-decoration: none;
    padding: 0 2px;
    border-radius: 2px;
}

/* Dark mode diff colors */
.dark .diff-container del {
    background-color: rgba(127, 29, 29, 0.5);
    /* red-900/50 */
    color: #fca5a5;
    /* red-300 */
}

.dark .diff-container ins {
    background-color: rgba(20, 83, 45, 0.5);
    /* green-900/50 */
    color: #86efac;
    /* green-300 */
}

/* Table styling */
.diff-container table {
    width: 100%;
    border-collapse: collapse;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 14px;
    line-height: 1.5;
}

.diff-container th {
    font-weight: 600;
    color: #6b7280;
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
}

.dark .diff-container th {
    color: #9ca3af;
    border-color: #374151;
}

.diff-container td {
    padding: 4px 8px;
    vertical-align: top;
    word-break: break-all;
    border-bottom: 1px solid #f3f4f6;
}

.dark .diff-container td {
    border-color: #374151;
}

.diff-container .n-old,
.diff-container .n-new {
    color: #9ca3af;
    text-align: right;
    padding-right: 12px;
    user-select: none;
    width: 1%;
    white-space: nowrap;
    border-right: 1px solid #e5e7eb;
    background-color: #f9fafb;
}

.dark .diff-container .n-old,
.dark .diff-container .n-new {
    color: #6b7280;
    border-color: #374151;
    background-color: #1f2937;
}
</style>
