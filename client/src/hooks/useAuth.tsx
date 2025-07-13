import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  studentId?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  district: string;
  subcounty: string;
  village: string;
  educationLevel: string;
  courseType?: string;
  role: 'admin' | 'instructor' | 'student';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/user');
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      setError(null);
      const response = await api.post('/api/login', { identifier, password });
      setUser(response.data.user);
      
      // Redirect based on role
      switch (response.data.user.role) {
        case 'admin':
          navigate('/', { replace: true });
          break;
        case 'instructor':
          navigate('/', { replace: true });
          break;
        case 'student':
          navigate('/', { replace: true });
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout', {});
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 