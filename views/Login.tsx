import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toast';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        showToast('Login berhasil!', 'success');
      } else {
        await register(email, password, username);
        showToast('Registrasi berhasil!', 'success');
      }
      window.location.href = '/';
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl border border-accent/20 flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            {isLogin ? 'Login Interface' : 'Create Identity'}
          </h1>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
            {isLogin ? 'Enter your credentials' : 'Join the neural network'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent/40 transition-all"
                  placeholder="X-User"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent/40 transition-all"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent/40 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-black uppercase py-4 rounded-2xl shadow-lg hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Initialize Login' : 'Create Access')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[11px] font-black text-zinc-500 uppercase tracking-widest hover:text-accent transition-all"
          >
            {isLogin ? "Don't have an identity? Register" : "Already have an identity? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;