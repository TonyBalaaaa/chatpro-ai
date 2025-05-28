import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para simular verificação inicial

  useEffect(() => {
    // Simular verificação de sessão (ex: localStorage ou chamada a Supabase)
    const storedUser = localStorage.getItem('chatpro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  // Função de login simulada
  const login = async (email, password) => {
    // AQUI SERIA A LÓGICA DE LOGIN COM SUPABASE
    // Ex: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) throw error;
    // setUser(data.user);
    // localStorage.setItem('chatpro_user', JSON.stringify(data.user));

    // Simulação:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'teste@chatpro.com' && password === '123456') {
          const mockUser = { id: '123', email: email, name: 'Usuário Teste' };
          setUser(mockUser);
          localStorage.setItem('chatpro_user', JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error('Credenciais inválidas (use teste@chatpro.com / 123456 para simulação)'));
        }
      }, 1000);
    });
  };

  // Função de signup simulada
  const signup = async (email, password) => {
    // AQUI SERIA A LÓGICA DE CADASTRO COM SUPABASE
    // Ex: const { data, error } = await supabase.auth.signUp({ email, password })
    // if (error) throw error;
    // setUser(data.user); // Ou talvez redirecionar para login/verificação de email
    // localStorage.setItem('chatpro_user', JSON.stringify(data.user));

    // Simulação:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulando que o cadastro sempre funciona, mas não loga automaticamente
        // Na vida real, você pode querer logar o usuário ou pedir verificação de email
        console.log(`Simulando cadastro para: ${email}`);
        resolve({ message: 'Cadastro simulado com sucesso. Faça login.' });
      }, 1000);
    });
  };

  // Função de logout simulada
  const logout = async () => {
    // AQUI SERIA A LÓGICA DE LOGOUT COM SUPABASE
    // Ex: const { error } = await supabase.auth.signOut();
    // if (error) throw error;
    setUser(null);
    localStorage.removeItem('chatpro_user');
    
    // Simulação:
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    // supabase // Será adicionado quando a integração estiver completa
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};