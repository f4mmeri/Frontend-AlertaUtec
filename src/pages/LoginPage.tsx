import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import UTECLogo from '../components/UTECLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      addNotification('success', 'Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (err: any) {
      addNotification('error', err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Back to home button */}
      <button
        type="button"
        onClick={() => navigate('/landing')}
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg transition-colors animate-fade-in pointer-events-auto"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver</span>
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-block bg-white rounded-2xl shadow-2xl p-4 mb-6 transform hover:scale-105 transition-transform">
              <UTECLogo size="lg" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200">
                Iniciar Sesión
              </span>
            </h2>
            <p className="text-blue-200">Sistema de Gestión de Incidentes</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-up-delay">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Correo institucional
                </label>
                <input
                  type="email"
                  placeholder="usuario@utec.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-900 py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 font-bold text-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <LogIn className="w-5 h-5" />
                <span>{loading ? 'Ingresando...' : 'Ingresar'}</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-center text-blue-200">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-white font-semibold hover:text-blue-200 transition-colors underline"
                  disabled={loading}
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
