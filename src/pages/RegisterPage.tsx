import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { useNotification } from '../hooks/useNotification';
import { UserRole } from '../types/user.types';
import UTECLogo from '../components/UTECLogo';

const COUNTRIES = [
  { code: '+51', flag: '🇵🇪', name: 'Perú', dialCode: '51' },
  { code: '+1', flag: '🇺🇸', name: 'Estados Unidos', dialCode: '1' },
  { code: '+52', flag: '🇲🇽', name: 'México', dialCode: '52' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', dialCode: '54' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil', dialCode: '55' },
  { code: '+56', flag: '🇨🇱', name: 'Chile', dialCode: '56' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', dialCode: '57' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', dialCode: '58' },
  { code: '+34', flag: '🇪🇸', name: 'España', dialCode: '34' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido', dialCode: '44' },
];

const FACULTIES = [
  { value: 'computacion', label: 'Computación' },
  { value: 'negocios', label: 'Negocios' },
  { value: 'ingenieria', label: 'Ingeniería' },
];

const CAREERS_BY_FACULTY: Record<string, Array<{ value: string; label: string }>> = {
  computacion: [
    { value: 'ciberseguridad', label: 'Ciberseguridad' },
    { value: 'ciencia-de-datos', label: 'Ciencia de Datos' },
    { value: 'ciencia-de-la-computacion', label: 'Ciencia de la Computación' },
    { value: 'sistemas-de-informacion', label: 'Sistemas de Información' },
  ],
  negocios: [
    { value: 'administracion-negocios-digitales', label: 'Administración & Negocios Digitales' },
    { value: 'administracion-negocios-sostenibles', label: 'Administración & Negocios Sostenibles' },
    { value: 'business-analytics', label: 'Business Analytics' },
  ],
  ingenieria: [
    { value: 'bioingenieria', label: 'Bioingeniería' },
    { value: 'ingenieria-ambiental', label: 'Ingeniería Ambiental' },
    { value: 'ingenieria-civil', label: 'Ingeniería Civil' },
    { value: 'ingenieria-electronica', label: 'Ingeniería Electrónica' },
    { value: 'ingenieria-industrial', label: 'Ingeniería Industrial' },
    { value: 'ingenieria-mecanica', label: 'Ingeniería Mecánica' },
    { value: 'ingenieria-mecatronica', label: 'Ingeniería Mecatrónica' },
    { value: 'ingenieria-quimica', label: 'Ingeniería Química' },
    { value: 'ingenieria-de-la-energia', label: 'Ingeniería de la Energía' },
  ],
};

interface FieldErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  studentCode?: string;
  faculty?: string;
  career?: string;
  specialty?: string;
  department?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'alumno' as UserRole,
    phone: '',
    studentCode: '',
    faculty: '',
    career: '',
    specialty: '',
    department: '',
  });
  const [countryCode, setCountryCode] = useState('+51'); // Por defecto Perú
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Funciones de validación
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'El correo electrónico es requerido.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'El formato del correo electrónico no es válido. Debe ser ejemplo@dominio.com';
    }
    // Validar que sea correo institucional de UTEC (opcional, puedes comentar estas líneas si quieres permitir cualquier dominio)
    const lowerEmail = email.toLowerCase();
    if (!lowerEmail.includes('@utec.edu.pe') && !lowerEmail.includes('@alumno.utec.edu.pe')) {
      return 'Debe ser un correo institucional de UTEC. Formato: usuario@utec.edu.pe o usuario@alumno.utec.edu.pe';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'La contraseña es requerida.';
    }
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula.';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...).';
    }
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'El nombre completo es requerido.';
    }
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return 'Debe ingresar al menos nombre y apellido.';
    }
    if (name.trim().length < 5) {
      return 'El nombre completo debe tener al menos 5 caracteres.';
    }
    return undefined;
  };

  const validatePhone = (phone: string, code: string): string | undefined => {
    if (!phone.trim()) {
      return 'El teléfono es requerido.';
    }
    // Eliminar espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si el código es +51 (Perú), validar formato peruano: 9 dígitos comenzando con 9
    if (code === '+51') {
      if (!/^9\d{8}$/.test(cleanPhone)) {
        return 'El teléfono debe tener 9 dígitos y comenzar con 9. Ejemplo: 987654321';
      }
    } else {
      // Para otros países, validar que sean solo números y tengan al menos 7 dígitos
      if (!/^\d{7,15}$/.test(cleanPhone)) {
        return 'El teléfono debe contener entre 7 y 15 dígitos.';
      }
    }
    return undefined;
  };

  const validateStudentCode = (code: string, role: UserRole): string | undefined => {
    if (role === 'alumno' && !code.trim()) {
      return 'El código de estudiante es requerido para estudiantes.';
    }
    if (code.trim() && !/^[A-Z0-9]{6,10}$/i.test(code.trim())) {
      return 'El código de estudiante debe tener entre 6 y 10 caracteres alfanuméricos.';
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {};

    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.name = validateName(formData.name);
    newErrors.phone = validatePhone(formData.phone, countryCode);
    
    if (formData.role === 'alumno') {
      newErrors.studentCode = validateStudentCode(formData.studentCode, formData.role);
      if (!formData.faculty) {
        newErrors.faculty = 'Debe seleccionar una facultad.';
      }
      if (!formData.career) {
        newErrors.career = 'Debe seleccionar una carrera.';
      }
    }

    if (formData.role === 'worker') {
      if (!formData.specialty.trim()) {
        newErrors.specialty = 'La especialidad es requerida para trabajadores.';
      }
      if (!formData.department.trim()) {
        newErrors.department = 'El departamento es requerido para trabajadores.';
      }
    }

    setErrors(newErrors);
    // Retornar true solo si no hay errores (todos los valores son undefined)
    return Object.values(newErrors).every(err => err === undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const isValid = validateAll();
    if (!isValid) {
      addNotification('error', 'Por favor corrige los errores en el formulario antes de continuar.');
      return;
    }

    setLoading(true);

    try {
      const data: any = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
      };

      if (formData.role === 'alumno') {
        data.studentCode = formData.studentCode;
        data.faculty = formData.faculty;
        data.career = formData.career;
      }

      if (formData.role === 'worker') {
        data.specialty = formData.specialty;
        data.department = formData.department;
      }

      // Incluir código de país en el teléfono
      data.phone = countryCode + formData.phone.replace(/[\s\-\(\)]/g, '');

      await authService.register(data);
      addNotification('success', 'Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      let errorMessage = 'Error en el registro';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Datos de registro inválidos. Por favor verifica la información ingresada.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Este correo electrónico ya está registrado. Por favor utiliza otro correo o inicia sesión.';
      } else if (err.response?.status === 422) {
        errorMessage = 'Los datos proporcionados no son válidos. Verifica que todos los campos estén correctamente completados.';
      } else if (!err.response) {
        errorMessage = 'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.';
      }
      
      addNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof FieldErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
    
    if (name === 'faculty') {
      // Limpiar la carrera cuando cambia la facultad
      setFormData({ ...formData, faculty: value, career: '' });
      setErrors({ ...errors, faculty: undefined, career: undefined });
    } else if (name === 'role') {
      // Limpiar errores de campos específicos del rol cuando cambia el rol
      const newErrors = { ...errors };
      if (value === 'alumno') {
        delete newErrors.specialty;
        delete newErrors.department;
      } else if (value === 'worker') {
        delete newErrors.studentCode;
        delete newErrors.faculty;
        delete newErrors.career;
      }
      setFormData({ ...formData, [name]: value as UserRole });
      setErrors(newErrors);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let error: string | undefined;

    // Validar campo específico al perder el foco
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'name':
        error = validateName(value);
        break;
      case 'phone':
        error = validatePhone(value, countryCode);
        break;
      case 'studentCode':
        error = validateStudentCode(value, formData.role);
        break;
      case 'faculty':
        if (!value && formData.role === 'alumno') {
          error = 'Debe seleccionar una facultad.';
        }
        break;
      case 'career':
        if (!value && formData.role === 'alumno') {
          error = 'Debe seleccionar una carrera.';
        }
        break;
      case 'specialty':
        if (!value.trim() && formData.role === 'worker') {
          error = 'La especialidad es requerida para trabajadores.';
        }
        break;
      case 'department':
        if (!value.trim() && formData.role === 'worker') {
          error = 'El departamento es requerido para trabajadores.';
        }
        break;
    }

    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const availableCareers = formData.faculty ? CAREERS_BY_FACULTY[formData.faculty] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Back to home button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-10 flex items-center space-x-2 text-white hover:text-blue-200 transition-colors animate-fade-in"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver</span>
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 animate-slide-up">
          <div className="text-center mb-6">
            <div className="inline-block bg-white rounded-2xl shadow-lg p-3 mb-4 transform hover:scale-105 transition-transform">
              <UTECLogo size="md" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200">
                Registro
              </span>
            </h2>
            <p className="text-blue-200">Sistema de Gestión de Incidentes</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Correo institucional *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-400' : ''
                }`}
                placeholder="ejemplo@utec.edu.pe"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-400' : ''
                }`}
                placeholder="Mín. 8 caracteres, mayúscula, número y símbolo"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password}</p>
              )}
              {!errors.password && formData.password && (
                <p className="mt-1 text-xs text-blue-200">
                  Debe contener: 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-400' : ''
                }`}
                placeholder="Nombre Apellido"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-300">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Teléfono *
              </label>
              <div className="flex">
                <div className="relative" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    aria-label="Seleccionar código de país"
                    aria-expanded={showCountryDropdown}
                    className={`flex items-center gap-2 px-3 py-2 border-r-0 rounded-l-lg border transition-colors ${
                      errors.phone ? 'border-red-400' : 'border-white/30'
                    } bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  >
                    <span className="text-xl">{COUNTRIES.find(c => c.code === countryCode)?.flag}</span>
                    <span className="text-sm font-medium">{countryCode}</span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute z-50 mt-1 w-56 bg-blue-900 border border-white/30 rounded-lg shadow-lg max-h-64 overflow-y-auto top-full backdrop-blur-lg">
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(country.code);
                            setShowCountryDropdown(false);
                            // Limpiar error del teléfono cuando cambia el código de país
                            if (errors.phone) {
                              setErrors({ ...errors, phone: undefined });
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/20 transition-colors text-white ${
                            countryCode === country.code ? 'bg-blue-700 font-medium' : ''
                          }`}
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span className="flex-1 text-left text-sm">{country.name}</span>
                          <span className="text-sm text-blue-200">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-r-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-400' : 'border-l-0'
                  }`}
                  placeholder={countryCode === '+51' ? '987654321' : 'Número de teléfono'}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-300">{errors.phone}</p>
              )}
              {!errors.phone && !formData.phone && (
                <p className="mt-1 text-xs text-blue-200">
                  {countryCode === '+51' 
                    ? 'Formato: 9 dígitos comenzando con 9 (Ejemplo: 987654321)'
                    : 'Ingrese el número de teléfono sin el código de país'
                  }
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-1">
                Rol *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option value="alumno" className="bg-blue-900 text-white">Estudiante</option>
                <option value="worker" className="bg-blue-900 text-white">Trabajador</option>
                <option value="admin" className="bg-blue-900 text-white">Administrador</option>
              </select>
            </div>

            {formData.role === 'alumno' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Código de estudiante *
                  </label>
                  <input
                    type="text"
                    name="studentCode"
                    value={formData.studentCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                      errors.studentCode ? 'border-red-400' : ''
                    }`}
                    placeholder="Ejemplo: A123456"
                  />
                  {errors.studentCode && (
                    <p className="mt-1 text-sm text-red-300">{errors.studentCode}</p>
                  )}
                  {!errors.studentCode && !formData.studentCode && (
                    <p className="mt-1 text-xs text-blue-200">
                      6-10 caracteres alfanuméricos
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Facultad *
                  </label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                      errors.faculty ? 'border-red-400' : ''
                    }`}
                  >
                    <option value="" className="bg-blue-900 text-white">Seleccione una facultad</option>
                    {FACULTIES.map((faculty) => (
                      <option key={faculty.value} value={faculty.value} className="bg-blue-900 text-white">
                        {faculty.label}
                      </option>
                    ))}
                  </select>
                  {errors.faculty && (
                    <p className="mt-1 text-sm text-red-300">{errors.faculty}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-1">
                    Carrera *
                  </label>
                  <select
                    name="career"
                    value={formData.career}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!formData.faculty}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all disabled:bg-white/5 disabled:cursor-not-allowed disabled:text-blue-300 ${
                      errors.career ? 'border-red-400' : ''
                    }`}
                  >
                    <option value="" className="bg-blue-900 text-white">
                      {formData.faculty ? 'Seleccione una carrera' : 'Primero seleccione una facultad'}
                    </option>
                    {availableCareers.map((career) => (
                      <option key={career.value} value={career.value} className="bg-blue-900 text-white">
                        {career.label}
                      </option>
                    ))}
                  </select>
                  {errors.career && (
                    <p className="mt-1 text-sm text-red-300">{errors.career}</p>
                  )}
                </div>
              </>
            )}

            {formData.role === 'worker' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Especialidad *
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                      errors.specialty ? 'border-red-400' : ''
                    }`}
                    placeholder="Ejemplo: Electricista, Plomero, etc."
                  />
                  {errors.specialty && (
                    <p className="mt-1 text-sm text-red-300">{errors.specialty}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                      errors.department ? 'border-red-400' : ''
                    }`}
                    placeholder="Ejemplo: Mantenimiento, Seguridad, etc."
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-300">{errors.department}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-900 py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

          <p className="text-center mt-6 text-blue-200">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-white font-semibold hover:text-blue-200 transition-colors underline"
              disabled={loading}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}