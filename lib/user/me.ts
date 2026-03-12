import { HTTP_STATUS } from '@/types/http';
import axios from 'axios';

export async function getMe(): Promise<User | null> {
  try {
    const response = await axios.get('/api/auth/me');
    if (response.status === HTTP_STATUS.OK) {
      return response.data as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching me:', error);
    return null;
  }
}

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string;
};
