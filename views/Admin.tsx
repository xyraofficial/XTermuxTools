import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { 
  Shield, Users, Database, AlertTriangle, Loader2, 
  ChevronRight, Lock, UserPlus, Trash2, HardDrive, 
  Activity, Search as SearchIcon, Key
} from 'lucide-react';

const AdminView: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'audit' | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-black">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-center space-y-4">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500">
        <Shield size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Access Denied</h2>
        <p className="text-sm text-zinc-500 max-w-xs">You do not have administrative privileges to access this neural sector.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 pb-32 bg-black min-h-full no-scrollbar">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">TEMPA (ADMIN)</h1>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Central System Control</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* User Management */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] space-y-6 transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-2xl text-accent"><Users size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">User Management</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Manage Roles & Access</p>
              </div>
            </div>
            <button className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><ChevronRight size={18} /></button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-2xl border border-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all group">
              <UserPlus size={18} className="text-zinc-500 group-hover:text-accent" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white">New User</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-2xl border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all group">
              <Trash2 size={18} className="text-zinc-500 group-hover:text-red-500" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white">Delete</span>
            </button>
          </div>
        </div>

        {/* System Resources */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] space-y-6 transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Database size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">System Resources</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">DB & Storage Control</p>
              </div>
            </div>
            <button className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><ChevronRight size={18} /></button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <HardDrive size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Database Status</span>
              </div>
              <span className="text-[9px] font-black text-green-500 uppercase">Optimal</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">System Load</span>
              </div>
              <span className="text-[9px] font-black text-blue-400 uppercase">12%</span>
            </div>
          </div>
        </div>

        {/* Audit Control */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] space-y-6 transition-all hover:border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500"><AlertTriangle size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Audit Control</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Security Logs</p>
              </div>
            </div>
            <button className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><ChevronRight size={18} /></button>
          </div>

          <div className="bg-black/50 rounded-2xl p-4 font-mono text-[9px] space-y-2 border border-white/5">
            <div className="flex items-center gap-2 text-zinc-600">
              <span className="text-yellow-500">[AUTH]</span> Login Attempt: admin_root
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <span className="text-blue-500">[SYS]</span> DB Connection Refreshed
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <span className="text-accent">[SEC]</span> New Device Registered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;