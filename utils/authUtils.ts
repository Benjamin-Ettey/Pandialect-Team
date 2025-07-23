import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from './consts';

export async function apiFetch(url: string, options: RequestInit = {}, retry = true) {
  const accessToken = await AsyncStorage.getItem('accessToken');
  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && retry) {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const refreshRes = await fetch(`${BASE_API_URL}/api/auth/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      // Retry original request with new token
      return apiFetch(url, options, false);
    }
  }
  return response;
}