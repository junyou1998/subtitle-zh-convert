import { ref, watch, onMounted, onUnmounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const theme = ref<Theme>('system');
  const isDark = ref(false);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const updateIsDark = () => {
    if (theme.value === 'system') {
      isDark.value = mediaQuery.matches;
    } else {
      isDark.value = theme.value === 'dark';
    }
    
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    updateIsDark();
  };

  const cycleTheme = () => {
    const modes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme.value);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const handleSystemChange = () => {
    if (theme.value === 'system') {
      updateIsDark();
    }
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme;
    } else {
      theme.value = 'system';
    }
    
    updateIsDark();
    mediaQuery.addEventListener('change', handleSystemChange);
  });

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemChange);
  });

  return {
    theme,
    isDark,
    setTheme,
    cycleTheme,
  };
}
