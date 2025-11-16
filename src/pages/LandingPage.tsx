import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';
import UTECLogo from '../components/UTECLogo';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center space-x-3 animate-fade-in">
          <UTECLogo size="sm" className="shadow-lg" />
          <span className="text-white text-xl font-bold">UTEC</span>
        </div>
        <div className="flex items-center space-x-4 animate-fade-in-delay">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-white hover:text-blue-200 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo Animation */}
          <div className="mb-8 animate-bounce-in">
            <div className="inline-block bg-white rounded-2xl shadow-2xl p-4 mb-6 transform hover:rotate-6 transition-transform">
              <UTECLogo size="lg" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-slide-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200">
              Alerta UTEC
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-4 animate-slide-up-delay">
            Sistema de Gestión de Incidentes
          </p>
          
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto animate-fade-in-delay-2">
            Reporta, gestiona y resuelve incidentes de manera rápida y eficiente.
            Mantén tu campus seguro y funcionando correctamente.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-3">
            <button
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span>Comienza ahora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all transform hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in">
            ¿Por qué elegir Alerta UTEC?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 animate-slide-up-delay">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Rápido y Eficiente</h3>
              <p className="text-blue-100 text-center">
                Reporta incidentes en segundos y recibe respuesta inmediata del equipo de soporte.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 animate-slide-up-delay-2">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Seguro y Confiable</h3>
              <p className="text-blue-100 text-center">
                Sistema seguro diseñado para proteger la información de la comunidad universitaria.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 animate-slide-up-delay-3">
              <div className="w-16 h-16 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">Trabajo en Equipo</h3>
              <p className="text-blue-100 text-center">
                Colabora con estudiantes, trabajadores y administradores para resolver problemas juntos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 mt-20 py-8">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p className="text-blue-200">
            © 2024 Universidad de Ingeniería y Tecnología - UTEC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

