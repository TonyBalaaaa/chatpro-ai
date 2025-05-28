import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, UserPlus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Erro de Validação',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    if (!email || !password) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, password); // Simula signup
      toast({
        title: 'Cadastro Bem-sucedido!',
        description: 'Você será redirecionado para o login.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Erro no Cadastro',
        description: error.message || 'Não foi possível criar a conta. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignup = () => {
    setIsLoading(true);
    toast({
      title: 'Cadastro com Google',
      description: 'Funcionalidade de cadastro com Google será implementada com Supabase.',
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-card shadow-2xl rounded-xl border border-border/50"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            Criar Conta ✨
          </h1>
          <p className="mt-2 text-muted-foreground">Junte-se ao ChatPro Interplase AI.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className="pl-10"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
            ) : (
              <UserPlus className="mr-2 h-5 w-5" />
            )}
            Criar Conta
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Ou cadastre-se com</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading}>
           <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          Google
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Faça Login <ExternalLink className="inline h-4 w-4" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;