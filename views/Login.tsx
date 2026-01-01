import React, { useState } from 'react';
import { Mail, Lock, Loader2, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toast';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        showToast("Login berhasil!", "success");
      } else {
        await signup(email, password);
        showToast("Akun berhasil dibuat!", "success");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-zinc-950">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <div className="inline-flex p-4 bg-accent/10 border border-accent/20 rounded-2xl mb-4">
            <LogIn size={32} className="text-accent" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {isLogin ? 'Login Interface' : 'Nexus Registry'}
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2">
            {isLogin ? 'Access your neural link' : 'Create new identity'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" size={20} />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all font-bold tracking-tight"
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" size={20} />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 transition-all font-bold tracking-tight"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-black py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-tighter"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
            {isLogin ? 'Initialize Session' : 'Register Identity'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-zinc-500 hover:text-accent font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Need an identity? Register here" : "Have an identity? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
