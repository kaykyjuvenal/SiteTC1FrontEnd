import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';  // Importa a biblioteca file-saver
import Footer from './Footer';
import Header from './Header';
import styles from './Admin';


function Medico() {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [resultadoExame, setResultadoExame] = useState('');
  const [nomeMedico, setNomeMedico] = useState('');
  const [loading, setLoading] = useState(true);
  const [cep, setCep] = useState('');

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [image, setImage] = useState(null);


  const baseUrl = "https://site-tc-1-back-end-f2y7.vercel.app"
  const APICEP = "https://viacep.com.br/ws/"
  const APIIMAGEM = "https://api.unsplash.com/photos/?client_id=UAyZcwpLMS7aeLdK1opXUn-5Jams-2O_j420soTVBIs"



  


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`${baseUrl}/usuarios`);
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

  const handleFetch1 = async () => {
    const API_URL = 'https://api.unsplash.com/users/?client_id=UAyZcwpLMS7aeLdK1opXUn-5Jams-2O_j420soTVBIs';

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // Pega a primeira imagem da lista retornada
      const firstImage = data[0]?.urls?.regular;
      setImage(firstImage);
    } catch (err) {
      setError(err.message);
    }
  };


  const handleFetch = async () => {
    setError(null); // Limpa o erro anterior
    setData(null); // Limpa os dados anteriores

    try {
      const response = await fetch(`${APICEP}${cep}/json/`);
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      setError(error.message);
    }
  };

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
    if (!selectedPaciente || !resultadoExame || !nomeMedico || !cep) {
      console.error('Paciente, resultado do exame e nome do médico são obrigatórios');
      return;
    }

    // Cria o conteúdo do arquivo
    const atendimento = `
      Paciente: ${selectedPaciente}
      Endereço: 
        Rua/Logradouro: ${data.logradouro}
        Bairro: ${data.bairro}
        Cidade: ${data.localidade}
        Estado: ${data.uf}
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

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Fetch Image from Unsplash API</h1>
      <button onClick={handleFetch1} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Fetch Image
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && <img src={image} alt="Fetched from Unsplash" style={{ marginTop: '20px', maxWidth: '100%' }} />}
      </div>

      <div>
        <h1>Buscar CEP</h1>
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite o CEP"
        />
        <button onClick={handleFetch}>Buscar</button>

        {error && <div style={{ color: 'red' }}>Erro: {error}</div>}
        {data && (
          <div>
            <h2>Endereço:</h2>
            <p>Rua: {data.logradouro}</p>
            <p>Bairro: {data.bairro}</p>
            <p>Cidade: {data.localidade}</p>
            <p>Estado: {data.uf}</p>
          </div>
        )}
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