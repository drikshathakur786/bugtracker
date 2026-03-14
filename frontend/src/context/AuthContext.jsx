import { createContext, useContext, useState, useEffect } from 'react';

// Step 1: Create the context object
const AuthContext = createContext(null);

// Step 2: Create the Provider component
// Wrap your entire app in this so every component can access auth state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // loading = true while we check if user is already logged in
  const [loading, setLoading] = useState(true);

  // On app load, check if there's a saved token in localStorage
  // This keeps the user logged in after page refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    // Done checking — render the app
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    // Save to state (for current session)
    setUser(userData);
    setToken(jwtToken);
    // Save to localStorage (persists across page refreshes)
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Don't render children until we've checked localStorage
  // Prevents flash of login page for already-logged-in users
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook for easy access
// Instead of importing useContext + AuthContext everywhere,
// components just call: const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}