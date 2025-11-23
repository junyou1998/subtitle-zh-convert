<script setup lang="ts">
import { X, ShieldAlert } from 'lucide-vue-next';

defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            class="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div class="flex items-center gap-3">
                    <ShieldAlert class="w-6 h-6 text-orange-500" />
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">免責聲明與使用條款</h2>
                </div>
                <button @click="emit('close')"
                    class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 text-gray-700 dark:text-gray-300 space-y-6 text-sm leading-relaxed">

                <section>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">1. 關於本工具</h3>
                    <p>本工具（以下簡稱「本服務」）之程式碼主要由人工智慧輔助撰寫，旨在為使用者提供一個便捷、現代化的字幕轉換介面。開發者秉持著感恩與尊敬的心態開發此工具，希望能為社群提供便利。</p>
                </section>

                <section>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">2. 核心服務來源</h3>
                    <p>本服務之核心轉換功能係介接自 <strong>繁化姬 (ZhConvert)</strong> 所提供之公開
                        API。本服務與繁化姬官方無直接關聯，但開發者嚴格遵守繁化姬之使用規範，並對其致力於高品質繁簡轉換與本地化的理念深表敬意。</p>
                    <ul class="list-disc list-inside mt-2 space-y-1 text-blue-600 dark:text-blue-400">
                        <li><a href="https://zhconvert.org" target="_blank" class="hover:underline">繁化姬官方網站</a></li>
                        <li><a href="https://github.com/Fanhuaji" target="_blank" class="hover:underline">繁化姬 GitHub
                                專案</a></li>
                    </ul>
                </section>

                <section>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">3. 非營利聲明</h3>
                    <p>本專案為完全免費、開源且非營利的個人專案，旨在推廣繁化姬服務之便利性，本服務不包含任何商業營利行為。</p>
                </section>

                <section>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">4. 著作權與責任歸屬</h3>
                    <p>使用者須自行確認所上傳之字幕檔案（如 .ass,
                        .srt）來源之合法性與著作權。本服務僅提供格式轉換之工具介面，<strong>不對使用者上傳之內容進行任何形式的審查、儲存、備份或散佈</strong>。對於任何因使用者使用本服務而產生之版權糾紛或法律責任，概由使用者自行承擔，本專案與開發者不承擔任何連帶責任。
                    </p>
                </section>

                <section>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">5. 隱私權與資料傳輸</h3>
                    <p>本服務為純前端應用程式。除將您選擇轉換的文本數據經由加密連線傳送至繁化姬 API
                        進行處理外，<strong>本服務不會將您的檔案或內容上傳至任何其他第三方伺服器或本服務之伺服器</strong>。所有檔案操作皆於您的瀏覽器端完成。</p>
                </section>

                <section>
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">6. 權利主張與聯絡方式</h3>
                    <p>若本服務有任何內容侵犯了您的權益、違反使用規範、或有任何使用不當與冒犯之處，請立即來信告知。收到通知後，我們將立即進行審視，並在必要時配合修正或下架相關工具。</p>
                    <p class="mt-2 font-medium">聯絡信箱：<a href="mailto:junyou1998@gmail.com"
                            class="text-blue-600 dark:text-blue-400 hover:underline">junyou1998@gmail.com</a></p>
                </section>

                <div
                    class="pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-500">
                    <p>開始使用本服務即代表您已詳閱並同意上述所有條款。</p>
                </div>

            </div>

            <!-- Footer -->
            <div
                class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <button @click="emit('close')"
                    class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium cursor-pointer">
                    我瞭解並同意
                </button>
            </div>
        </div>
    </div>
</template>
