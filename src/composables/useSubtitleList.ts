import { ref, computed } from 'vue';

export interface SubtitleFile {
  id: string;
  originalFile: File;
  originalContent: string;
  convertedContent: string | null;
  convertedFilename: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  selected: boolean;
  errorMessage?: string;
  progress?: number;
}

const files = ref<SubtitleFile[]>([]);

export function useSubtitleList() {
  const addFiles = async (newFiles: File[]) => {
    for (const file of newFiles) {
      // Avoid duplicates based on name and size (simple check)
      if (files.value.some(f => f.originalFile.name === file.name && f.originalFile.size === file.size)) {
        continue;
      }

      const content = await readFileContent(file);
      
      files.value.push({
        id: crypto.randomUUID(),
        originalFile: file,
        originalContent: content,
        convertedContent: null,
        convertedFilename: null,
        status: 'idle',
        selected: true,
      });
    }
  };

  const removeFile = (id: string) => {
    files.value = files.value.filter(f => f.id !== id);
  };

  const updateFileStatus = (id: string, status: SubtitleFile['status'], error?: string) => {
    const file = files.value.find(f => f.id === id);
    if (file) {
      file.status = status;
      if (error) file.errorMessage = error;
    }
  };

  const toggleSelection = (id: string) => {
    const file = files.value.find(f => f.id === id);
    if (file) {
      file.selected = !file.selected;
    }
  };
  
  const toggleAllSelection = (selected: boolean) => {
    files.value.forEach(f => f.selected = selected);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const selectedFiles = computed(() => files.value.filter(f => f.selected));
  const hasFiles = computed(() => files.value.length > 0);

  return {
    files,
    selectedFiles,
    hasFiles,
    addFiles,
    removeFile,
    updateFileStatus,
    toggleSelection,
    toggleAllSelection
  };
}
