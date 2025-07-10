import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Scissors } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = onLogin(formData.username, formData.password);
    
    if (!success) {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 border border-white rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 text-center relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <Scissors className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ORMEN TEKSTİL</h1>
            <p className="text-white/80 text-sm font-medium">Kartela Yönetim Sistemi V1</p>
            <div className="absolute top-4 right-4 text-white/60 text-xs">
              © 2025
            </div>
          </div>

          {/* Form */}
          <div className="p-8 bg-white/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 font-medium"
                    placeholder="Kullanıcı adınızı giriniz"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-800 font-medium"
                    placeholder="Şifrenizi giriniz"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Scissors className="w-5 h-5 mr-2" />
                    Sisteme Giriş Yap
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                  <Scissors className="w-4 h-4" />
                  <span className="text-sm font-semibold">ORMEN TEKSTİL</span>
                </div>
                <p className="text-xs text-gray-500">© 2025 Tüm hakları saklıdır</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}