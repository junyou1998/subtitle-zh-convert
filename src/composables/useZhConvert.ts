import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'https://api.zhconvert.org';

export interface ServiceInfo {
  converters: Record<string, any>;
  modules: Record<string, any>;
  version: string;
}

export function useZhConvert() {
  const isConnected = ref<boolean>(false);
  const isChecking = ref<boolean>(false);
  const serviceInfo = ref<ServiceInfo | null>(null);
  const error = ref<string | null>(null);

  const checkConnection = async () => {
    isChecking.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_BASE_URL}/service-info`, {
        withCredentials: false,
        headers: {
          'Accept': 'application/json',
        }
      });
      if (response.data && response.data.code === 0) {
        isConnected.value = true;
        serviceInfo.value = response.data.data;
      } else {
        isConnected.value = false;
        error.value = response.data.msg || 'Unknown error';
      }
    } catch (err: any) {
      isConnected.value = false;
      error.value = err.response?.data?.msg || err.message || 'Connection failed';
      console.error('API Connection Error:', err);
    } finally {
      isChecking.value = false;
    }
  };

  const convertSubtitle = async (text: string, options: { converter: string; jpTextStyles: string; modules?: Record<string, number> } = { converter: 'Taiwan', jpTextStyles: 'protect' }) => {
    try {
      const payload: any = {
        text,
        converter: options.converter,
        jpTextStyles: options.jpTextStyles,
      };

      if (options.modules && Object.keys(options.modules).length > 0) {
        payload.modules = JSON.stringify(options.modules);
      }

      const response = await axios.post(`${API_BASE_URL}/convert`, payload, {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.code === 0) {
        return response.data.data.text;
      } else {
        throw new Error(response.data.msg || 'Conversion failed');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Network error during conversion');
    }
  };

  const getDiff = async (text: string, options: { converter: string; jpTextStyles: string; modules?: Record<string, number> } = { converter: 'Taiwan', jpTextStyles: 'protect' }) => {
    try {
      const payload: any = {
        text,
        converter: options.converter,
        jpTextStyles: options.jpTextStyles,
        diffEnable: true,
        diffTemplate: 'SideBySide', // Request HTML diff
      };

      if (options.modules && Object.keys(options.modules).length > 0) {
        payload.modules = JSON.stringify(options.modules);
      }

      const response = await axios.post(`${API_BASE_URL}/convert`, payload, {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.code === 0) {
        return response.data.data.diff;
      } else {
        throw new Error(response.data.msg || 'Diff generation failed');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Network error during diff generation');
    }
  };

  return {
    isConnected,
    isChecking,
    serviceInfo,
    error,
    checkConnection,
    convertSubtitle,
    getDiff,
  };
}
