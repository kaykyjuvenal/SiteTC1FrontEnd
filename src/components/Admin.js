import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { MdDeleteForever } from "react-icons/md";
import styles from './Admin.modulo.css';


function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoMedico, setNovoMedico] = useState({ Usuario: '', Senha: '' });
  const [novoPaciente, setNovoPaciente] = useState({ Usuario: '', Senha: '' });
  const baseUrl = 'https://site-tc-1-back-end-ij8b.vercel.app';
  const baseFrontEnd = 'http://localhost:3001';

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${baseUrl}/usuarios`);
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados');
        }
        const data = await response.json();
        setUsuarios(data.Pacientes);
        setMedicos(data.Medicos);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleAddPaciente = async () => {
    // Verifica se o paciente já existe
    const pacienteExistente = usuarios.find(paciente => paciente.Usuario === novoPaciente.Usuario);
    if (pacienteExistente) {
      alert('Paciente já existe!');
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'adicionar',
          tipo: 'Pacientes',
          dados: novoPaciente
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao adicionar paciente');
      }
  
      const updatedData = await response.json();
      setUsuarios(updatedData.Pacientes);
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
    }
  };

  const handleAddMedico = async () => {
    // Verifica se o médico já existe
    const medicoExistente = medicos.find(medico => medico.Usuario === novoMedico.Usuario);
    if (medicoExistente) {
      alert('Médico já existe!');
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'adicionar',
          tipo: 'Medicos',
          dados: novoMedico
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao adicionar médico');
      }
  
      const updatedData = await response.json();
      setMedicos(updatedData.Medicos);
    } catch (error) {
      console.error('Erro ao adicionar médico:', error);
    }
  };

  const handleRemovePaciente = async (usuario) => {
    try {
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'remover',
          tipo: 'Pacientes',
          usuario
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover paciente');
      }

      const updatedData = await response.json();
      setUsuarios(updatedData.Pacientes);
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
    }
  };

  const handleRemoveMedico = async (usuario) => {
    try {
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'remover',
          tipo: 'Medicos',
          usuario
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover médico');
      }

      const updatedData = await response.json();
      setMedicos(updatedData.Medicos);
    } catch (error) {
      console.error('Erro ao remover médico:', error);
    }
  };

  const handleInputChange = (e, type, field) => {
    const { value } = e.target;
    if (type === 'paciente') {
      setNovoPaciente(prev => ({ ...prev, [field]: value }));
    } else if (type === 'medico') {
      setNovoMedico(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }


  return (
    <div>
      <Header/>
      <h1>Painel de Administração</h1>

      <h2>Adicionar Novo Médico</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={novoMedico.Usuario}
        onChange={(e) => handleInputChange(e, 'medico', 'Usuario')}
      />
      <input
        type="password"
        placeholder="Senha"
        value={novoMedico.Senha}
        onChange={(e) => handleInputChange(e, 'medico', 'Senha')}
      />
      <button onClick={handleAddMedico}>Adicionar Médico</button>

      <h2>Adicionar Novo Paciente</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={novoPaciente.Usuario}
        onChange={(e) => handleInputChange(e, 'paciente', 'Usuario')}
      />
      <input
        type="password"
        placeholder="Senha"
        value={novoPaciente.Senha}
        onChange={(e) => handleInputChange(e, 'paciente', 'Senha')}
      />
      <button onClick={handleAddPaciente}>Adicionar Paciente</button>
      
      <h2>Lista de Médicos</h2>
      <ul>
        {medicos.map((medico) => (
          <li key={medico.Usuario}>
            Usuário: {medico.Usuario}, Senha: {medico.Senha}
            <button className='buttonlixeira' onClick={() => handleRemoveMedico(medico.Usuario)}><MdDeleteForever /></button>
          </li>
        ))}
      </ul>

      <h2>Lista de Pacientes</h2>
      <ul>
        {usuarios.map((paciente) => (
          <li key={paciente.Usuario}>
            Usuário: {paciente.Usuario}, Senha: {paciente.Senha}
            <button className='buttonlixeira' onClick={() => handleRemovePaciente(paciente.Usuario)}><MdDeleteForever /></button>
          </li>
        ))}
      </ul>
      <button className='buttonvoltar' onClick={() => { window.location.href = `${baseFrontEnd}/login`; }}>Voltar</button>
      <Footer/>
    </div>
    

  );
}

export default Admin;