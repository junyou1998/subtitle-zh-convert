<script setup lang="ts">
import { Upload, Settings, Play, Download, FileText } from 'lucide-vue-next';
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-blue-500 rounded-full"></span>
            操作說明
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <!-- Step 1 -->
            <div class="flex flex-col gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    1</div>
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Upload class="w-4 h-4" /> 上傳檔案
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    將您的 <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">.ass</code> 或 <code
                        class="bg-gray-100 dark:bg-gray-700 px-1 rounded">.srt</code> 字幕檔拖曳至上傳區，或直接點擊上傳區選擇檔案。
                </p>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    2</div>
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings class="w-4 h-4" /> 基礎設定
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    選擇您要轉換的模式（如：台灣化），並設定日文部分的處理策略（如：保護日文不轉換）。
                </p>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    3</div>
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings class="w-4 h-4" /> 進階模組
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    點擊「進階設定」按鈕，勾選您需要的優化模組，例如：修正錯別字、動漫專有名詞轉換等。
                </p>
            </div>

            <!-- Step 4 -->
            <div class="flex flex-col gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    4</div>
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Play class="w-4 h-4" /> 開始轉換
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    確認設定無誤後，點擊「開始轉換」按鈕。系統將透過 API 進行批次處理。
                </p>
            </div>

            <!-- Step 5 -->
            <div class="flex flex-col gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                    5</div>
                <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Download class="w-4 h-4" /> 比較與下載
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    轉換完成後，可點擊
                    <FileText class="w-3 h-3 inline" /> 查看差異比較，確認後點擊
                    <Download class="w-3 h-3 inline" /> 下載檔案。
                </p>
            </div>
        </div>
    </div>
</template>
