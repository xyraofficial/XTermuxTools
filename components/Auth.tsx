import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, UserPlus, LogIn, Eye, EyeOff, KeyRound, MessageSquare, Shield, Globe, ChevronDown, MoreVertical } from 'lucide-react';
import { showToast } from './Toast';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isResetting) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        showToast('Password reset link has been sent to your email!', 'success');
        setIsResetting(false);
        setStep('welcome');
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('This email is already registered. Please sign in.');
          }
          throw error;
        }

        if (data.user && !data.session && data.user.identities && data.user.identities.length === 0) {
          throw new Error('This email is already registered. Please sign in.');
        }

        showToast('Account created! Please check your email.', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Incorrect email or password.');
          }
          throw error;
        }
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen bg-[#0b141a] text-[#e9edef] p-6">
        <div className="w-full flex justify-end">
          <button className="p-2 text-[#8696a0]">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-12 flex-1 justify-center max-w-sm w-full">
          <div className="relative">
            <div className="w-64 h-64 bg-[#111b21] rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
                {[...Array(20)].map((_, i) => (
                  <MessageSquare key={i} size={16} />
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#25d366] rounded-2xl flex items-center justify-center transform -rotate-12">
                    <MessageSquare size={24} className="text-[#0b141a]" />
                  </div>
                  <div className="w-12 h-12 bg-[#34b7f1] rounded-2xl flex items-center justify-center transform rotate-12">
                    <Globe size={24} className="text-[#0b141a]" />
                  </div>
                </div>
                <div className="w-16 h-16 bg-[#00a884] rounded-full flex items-center justify-center">
                  <Shield size={32} className="text-[#0b141a]" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-normal">Welcome to XTermux</h1>
            <p className="text-[#8696a0] text-sm leading-relaxed px-4">
              Read our <span className="text-[#53bdeb] cursor-pointer">Privacy Policy</span>. Tap "Agree and continue" to accept the <span className="text-[#53bdeb] cursor-pointer">Terms of Service</span>.
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="flex items-center justify-center gap-2 text-[#00a884] bg-[#111b21] py-2 px-4 rounded-full w-fit mx-auto cursor-pointer hover:bg-[#202c33] transition-colors">
              <Globe size={18} />
              <span className="text-sm">English</span>
              <ChevronDown size={16} />
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full bg-[#00a884] text-[#0b141a] font-medium py-3 rounded-full hover:bg-[#06cf9c] transition-colors active:scale-95"
            >
              Agree and continue
            </button>
          </div>
        </div>

        <div className="py-6 text-center">
          <p className="text-[#8696a0] text-[10px] uppercase tracking-widest font-bold">from REPLIT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0b141a] text-[#e9edef] p-6">
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={() => setStep('welcome')}
          className="text-[#00a884] font-medium"
        >
          Cancel
        </button>
        <h2 className="text-xl font-medium">
          {isResetting ? 'Reset password' : (isSignUp ? 'Create account' : 'Enter email')}
        </h2>
        <button className="p-2 text-[#8696a0]">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-[#8696a0] text-sm leading-relaxed">
            {isResetting 
              ? 'XTermux will send an email to verify your address.'
              : 'XTermux will need to verify your email address.'}
          </p>
          <button className="text-[#53bdeb] text-sm mt-2 font-medium">
            What's my email?
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="border-b border-[#00a884] py-2">
            <div className="flex items-center justify-between text-[#e9edef] text-lg mb-1">
              <span>Your Email</span>
              <ChevronDown size={20} className="text-[#00a884]" />
            </div>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[#e9edef] text-xl placeholder:text-[#8696a0]/30"
              required
            />
          </div>

          {!isResetting && (
            <div className="border-b border-[#00a884] py-2 relative">
              <div className="flex items-center justify-between text-[#e9edef] text-lg mb-1">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#00a884]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[#e9edef] text-xl placeholder:text-[#8696a0]/30"
                required
              />
            </div>
          )}

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00a884] text-[#0b141a] font-medium py-3 rounded-full hover:bg-[#06cf9c] transition-colors active:scale-95 disabled:bg-[#111b21] disabled:text-[#8696a0] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {isResetting ? 'NEXT' : (isSignUp ? 'SIGN UP' : 'NEXT')}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4 text-center">
          {!isResetting && !isSignUp && (
            <button
              type="button"
              onClick={() => setIsResetting(true)}
              className="text-[#53bdeb] text-sm font-medium"
            >
              Forgot password?
            </button>
          )}
          
          <button
            onClick={() => {
              if (isResetting) {
                setIsResetting(false);
              } else {
                setIsSignUp(!isSignUp);
              }
            }}
            className="text-[#8696a0] text-sm"
          >
            {isResetting ? 'Back to login' : (
              isSignUp ? (
                <>Already have an account? <span className="text-[#53bdeb]">Sign in</span></>
              ) : (
                <>Don't have an account? <span className="text-[#53bdeb]">Sign up</span></>
              )
            )}
          </button>
        </div>
      </div>

      <div className="mt-auto py-6 text-center text-[#8696a0] text-[12px]">
        <p>You must be at least 13 years old to register. Learn how XTermux works with the <span className="text-[#53bdeb]">Meta Companies</span>.</p>
      </div>
    </div>
  );
};
