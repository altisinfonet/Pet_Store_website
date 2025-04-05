import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import getUrlWithKey from '../../util/_apiUrl';
import { encryptPayload } from '../../../util/_encryption_api_payload';

// Define types for the user object and authentication functions
type User = {
  // Define the structure of the user object
  id: string;
  email: string;
  // Add other properties as needed
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  // login: (encryptedData: string) => Promise<any>;
  logout: () => Promise<void>;
  // isAuthenticated: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const { signin, admin_me, user_logout } = getUrlWithKey("users");

  console.log("Tokendf5g45ds3", retryCount)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${admin_me}`, { withCredentials: true });
        if (response?.data && response?.data?.success) {
          setUser(response?.data?.data);
          setRetryCount(0)
        }
      } catch (error) {
        console.error('Errorfetchingdata', error?.status);
        if (error && error.status === 401) {
          // if (retryCount + 1 >= 2) {
          //   window.location.reload();
          // } else {
          //   setRetryCount(retryCount + 1);
          // }

          router.push("/admin/login");
        }
        // router.push("/login");
      }
    };
    // Call the async function
    fetchData();
  }, []);

  const login = async (credential: string, password: string): Promise<void> => {
    const encryptedPayload = encryptPayload({ credential, password });
    console.log(encryptedPayload)
    const { data } = await axios.post(`${signin}`, { data: encryptedPayload }, { withCredentials: true });
    if (data?.success && data?.data && data?.data?.id) {
      setUser(data?.data);
    }
    return data;
  };
  // const login = async (credential: string, password: string): Promise<void> => {
  //   const { data } = await axios.post(`${signin}`, { credential, password }, { withCredentials: true });
  //   if (data?.success && data?.data && data?.data?.id) {
  //     setUser(data?.data);
  //   }
  //   return data;
  // };

  // const login = async (encryptedData: string): Promise<any> => {
  //   const { data } = await axios.post(`${signin}`,
  //     { encryptedData },
  //     { withCredentials: true }
  //   );
  //   if (data?.success && data?.data?.id) {
  //     setUser(data?.data);
  //   }
  //   return data;
  // };

  const logout = async (): Promise<void> => {
    const { data } = await axios.post(`${user_logout}`, {}, { withCredentials: true });
    if (data?.success) {
      setUser(null);
      router.push("/admin/login")
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};