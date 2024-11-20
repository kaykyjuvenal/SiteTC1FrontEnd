import React, { useEffect,useState } from 'react';
import { saveAs } from 'file-saver';  // Importa a biblioteca file-saver
import Footer from './Footer';
import Header from './Header';
import styles from './Admin.modulo.css';


function Paciente() {
  const [nomePaciente, setNomePaciente] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [horarioConsulta, setHorarioConsulta] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('');
  const [error, setError] = useState('');
  const [cep, setCep] = useState('');
  const [Endereço, setSelectedEndereco]= useState('');


  const handleNomeChange = (e) => {
    setNomePaciente(e.target.value);
  };

  const handleDataChange = (e) => {
    setDataConsulta(e.target.value);
  };

  const handleHorarioChange = (e) => {
    setHorarioConsulta(e.target.value);
  };

  const handleTipoChange = (e) => {
    setTipoConsulta(e.target.value);
  };

  const handleSaveConsulta = () => {
    if (!nomePaciente || !dataConsulta || !horarioConsulta || !tipoConsulta) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    // Verifica se a data da consulta é maior que a data atual
    const dataAtual = new Date();
    const dataSelecionada = new Date(dataConsulta);

    if (dataSelecionada <= dataAtual) {
      setError('A data da consulta deve ser maior que a data atual.');
      return;
    }

    // Cria o conteúdo do arquivo
    const consulta = `Nome do Paciente: ${nomePaciente}
Data da Consulta: ${dataConsulta}
Horário da Consulta: ${horarioConsulta}
Tipo da Consulta: ${tipoConsulta}
==============================
    `;
    const blob = new Blob([consulta], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'Consultas.txt');

    // Limpa os campos após salvar
    setNomePaciente('');
    setDataConsulta('');
    setHorarioConsulta('');
    setTipoConsulta('');
    setError('');
    alert('Consulta salva com sucesso!');
  };

  return (
    <div>
      <Header/>
      <h1>Agendar Consulta</h1>

      <div>
        <label>
          Nome do Paciente:
          <input
            type="text"
            value={nomePaciente}
            onChange={handleNomeChange}
            placeholder="Digite o nome do paciente"
          />
        </label>
      </div>

      <div>
        <label>
          Data da Consulta:
          <input
            type="date"
            value={dataConsulta}
            onChange={handleDataChange}
          />
        </label>
      </div>

      <div>
        <label>
          Horário da Consulta:
          <input
            type="time"
            value={horarioConsulta}
            onChange={handleHorarioChange}
          />
        </label>
      </div>

      <div>
        <label>
          Tipo da Consulta:
          <input
            type="text"
            value={tipoConsulta}
            onChange={handleTipoChange}
            placeholder="Digite o tipo de consulta"
          />
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleSaveConsulta}>Salvar Consulta</button>
      <button className='buttonvoltar' onClick={() => { window.location.href = "http://localhost:3001/login"; }}>Voltar</button>
      <Footer/>

    </div>
  );
}

export default Paciente;