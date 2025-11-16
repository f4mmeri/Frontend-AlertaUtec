import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { useNotification } from '../hooks/useNotification';
import { UserRole } from '../types/user.types';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      await authService.register(data);
      addNotification('success', 'Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      addNotification('error', err.response?.data?.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'faculty') {
      // Limpiar la carrera cuando cambia la facultad
      setFormData({ ...formData, faculty: value, career: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const availableCareers = formData.faculty ? CAREERS_BY_FACULTY[formData.faculty] || [] : [];

  return (
    <div className="min-h-screen from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <AlertCircle className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">Registro</h2>
          <p className="text-gray-600 mt-1">Sistema de Gestión de Incidentes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo institucional *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="alumno">Estudiante</option>
                <option value="worker">Trabajador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {formData.role === 'alumno' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de estudiante
                  </label>
                  <input
                    type="text"
                    name="studentCode"
                    value={formData.studentCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facultad
                  </label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccione una facultad</option>
                    {FACULTIES.map((faculty) => (
                      <option key={faculty.value} value={faculty.value}>
                        {faculty.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <select
                    name="career"
                    value={formData.career}
                    onChange={handleChange}
                    disabled={!formData.faculty}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.faculty ? 'Seleccione una carrera' : 'Primero seleccione una facultad'}
                    </option>
                    {availableCareers.map((career) => (
                      <option key={career.value} value={career.value}>
                        {career.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {formData.role === 'worker' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 font-semibold hover:underline"
            disabled={loading}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}