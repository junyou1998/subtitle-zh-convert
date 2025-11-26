<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Download, X } from 'lucide-vue-next';

const deferredPrompt = ref<any>(null);
const showInstallPrompt = ref(false);

const handleInstall = async () => {
    if (!deferredPrompt.value) return;

    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === 'accepted') {
        deferredPrompt.value = null;
        showInstallPrompt.value = false;
    }
};

const dismissPrompt = () => {
    showInstallPrompt.value = false;
};

const onBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPrompt.value = true;
};

onMounted(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
});

onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
});
</script>

<template>
    <Transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showInstallPrompt"
            class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 z-50 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Download class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">安裝應用程式</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">將 ZhConvert 安裝到您的裝置，獲得更佳的使用體驗。</p>
            </div>

            <div class="flex items-center gap-2">
                <button @click="dismissPrompt"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <X class="w-5 h-5" />
                </button>
                <button @click="handleInstall"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                    安裝
                </button>
            </div>
        </div>
    </Transition>
</template>
