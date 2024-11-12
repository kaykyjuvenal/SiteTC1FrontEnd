import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';  // Importa a biblioteca file-saver
import Footer from './Footer';
import Header from './Header';


function Medico() {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [resultadoExame, setResultadoExame] = useState('');
  const [nomeMedico, setNomeMedico] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados');
        }
        const data = await response.json();
        setPacientes(data.Pacientes);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchPacientes();
  }, []);

  const handleInputChange = (e) => {
    setResultadoExame(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedPaciente(e.target.value);
  };

  const handleNameChange = (e) => {
    setNomeMedico(e.target.value);
  };

  const handleSaveAtendimento = () => {
    if (!selectedPaciente || !resultadoExame || !nomeMedico) {
      console.error('Paciente, resultado do exame e nome do médico são obrigatórios');
      return;
    }

    // Cria o conteúdo do arquivo
    const atendimento = `
      Paciente: ${selectedPaciente}
      Resultado do Exame: ${resultadoExame}
      Médico: ${nomeMedico}
      ==============================
    `;
    const blob = new Blob([atendimento], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'Atendimentos.txt');

    // Limpa os campos após salvar
    setSelectedPaciente('');
    setResultadoExame('');
    setNomeMedico('');
    alert('Atendimento salvo com sucesso!');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Header/>
          
      <h1>Registro de Atendimento</h1>

      <div>
        <label>
          Nome do Médico:
          <input
            type="text"
            value={nomeMedico}
            onChange={handleNameChange}
            placeholder="Digite seu nome"
          />
        </label>
      </div>

      <div>
        <label>
          Selecione o Paciente:
          <select value={selectedPaciente} onChange={handleSelectChange}>
            <option value="">Selecione um paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.Usuario} value={paciente.Usuario}>
                {paciente.Usuario}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Resultado do Exame:
          <textarea
            value={resultadoExame}
            onChange={handleInputChange}
            placeholder="Digite o resultado do exame"
          />
        </label>
      </div>

      <button onClick={handleSaveAtendimento}>Salvar Atendimento</button>
      <button className='buttonvoltar' onClick={() => { window.location.href = "http://localhost:3001/login"; }}>Voltar</button>
      <Footer/>
    </div>
    
  );
}

export default Medico;