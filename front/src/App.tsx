import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

//Desenvolvido por: Iago Trentini Etur

const socket = io('http://localhost:4000');

interface EstadoDispositivoSala {
  luzSalaOn: boolean,
  tvOn: boolean,
  arOn: boolean
};
interface EstadoDispositivoCozinha {
  luzCozinhaOn: boolean,
  geladeiraOn: boolean,
  fogaoOn: boolean
};
interface EstadoDispositivoQuarto {
  luzQuartoOn: boolean,
  ventiladorOn: boolean,
  curtinaOn: boolean
};

const App: React.FC = () => {
  const [dispositivoSala, setDispositivoSala] = useState<EstadoDispositivoSala>({
    luzSalaOn: false,
    tvOn: false,
    arOn: false
  });
  const [dispositivoCozinha, setDispositivoCozinha] = useState<EstadoDispositivoCozinha>({
    luzCozinhaOn: false,
    geladeiraOn: false,
    fogaoOn: false
  });
  const [dispositivoQuarto, setDispositivoQuarto] = useState<EstadoDispositivoQuarto>({
    luzQuartoOn: false,
    ventiladorOn: false,
    curtinaOn: false
  });
  const [dispositivoExtras, setDispositivoExtras] = useState({
    canalTV: 1,
    temperaturaAr: 24,
    temperaturaGeladeira: 4,
    potenciaFogao: 3,
    velocidadeVentilador: 2
  });

  //conectar ao backend e receber o estado inicial
  useEffect(() => {
    //atualiza o estado inicia da sala
    socket.on('estadoInicialSala', (estadoDispositivosSala: EstadoDispositivoSala) => {
      setDispositivoSala(estadoDispositivosSala);
    });

    //atualiza estado quando houver mudança
    socket.on('estadoAlteraSala', (novoEstadoSala: EstadoDispositivoSala) => {
      setDispositivoSala(novoEstadoSala);
    });

    //altera o estado inicial da cozinha
    socket.on('estadoInicialCozinha', (estadoDispositivosCozinha: EstadoDispositivoCozinha) => {
      setDispositivoCozinha(estadoDispositivosCozinha);
    });

    //atualiza estado quando houver mudança
    socket.on('estadoAlteraCozinha', (novoEstadoCozinha: EstadoDispositivoCozinha) => {
      setDispositivoCozinha(novoEstadoCozinha);
    });

    //altera o estado inicial do quarto
    socket.on('estadoInicialQuarto', (estadoDispositivosQuarto: EstadoDispositivoQuarto) => {
      setDispositivoQuarto(estadoDispositivosQuarto);
    });

    //atualiza estado quando houver mudança
    socket.on('estadoAlteraQuarto', (novoEstadoQuarto: EstadoDispositivoQuarto) => {
      setDispositivoQuarto(novoEstadoQuarto);
    });

    // Estado inicial dos dispositivos extras
    socket.on('estadoInicialExtras', (estadoExtras) => {
      setDispositivoExtras(estadoExtras);
    });

    // Atualizar o estado dos dispositivos extras quando houver mudança
    socket.on('estadoAlteraExtras', (novoEstadoExtras) => {
      setDispositivoExtras(novoEstadoExtras);
    });

    // Alerta de temperatura da geladeira
    socket.on('alertaGeladeira', (mensagem) => {
      alert(mensagem);
    });

    return () => {
      socket.off('estadoInicialSala');
      socket.off('estadoAlteraSala');
      socket.off('estadoInicialCozinha');
      socket.off('estadoAlteraCozinha');
      socket.off('estadoInicialQuarto');
      socket.off('estadoAlteraQuarto');
    };


  }, []);

  //funcao para alterar o estado do dispositivo
  const acenderLuzSala = () => {
    socket.emit('acenderLuzSala');
  };
  const ligarTvSala = () => {
    socket.emit('ligarTvSala');
  };
  const ligarArSala = () => {
    socket.emit('ligarArSala');
  };
  const acenderLuzCozinha = () => {
    socket.emit('acenderLuzCozinha');
  };
  const ligarGeladeiraCozinha = () => {
    socket.emit('ligarGeladeiraCozinha');
  };
  const ligarFogaoCozinha = () => {
    socket.emit('ligarFogaoCozinha');
  };
  const acenderLuzQuarto = () => {
    socket.emit('acenderLuzQuarto');
  };
  const ligarVentiladorQuarto = () => {
    socket.emit('ligarVentiladorQuarto');
  };
  const abrirCurtinaQuarto = () => {
    socket.emit('abrirCurtinaQuarto');
  };

  // Funções para manipular as novas funcionalidades
  const mudarCanalTV = (canal: number) => {
    socket.emit('mudarCanalTV', canal);
  };

  const ajustarTemperaturaAr = (temp: string) => {
    socket.emit('ajustarTemperaturaAr', temp);
  };

  const ajustarPotenciaFogao = (potencia: string) => {
    socket.emit('ajustarPotenciaFogao', potencia);
  };

  const ajustarVelocidadeVentilador = (velocidade: string) => {
    socket.emit('ajustarVelocidadeVentilador', velocidade);
  };

  return (
    <div className='casa'>
      <h1>Casa Inteligente</h1>
      <div className='sala'>
        <p>Sala de Estar</p>
        <div className='luz'>
          <p>Luz</p>
          <button onClick={acenderLuzSala}>
            {dispositivoSala.luzSalaOn ? 'Desligar Luz' : 'Ligar Luz'}
          </button>
          <img src='luz.png' className={`status ${dispositivoSala.luzSalaOn ? 'on' : 'off'}`} />
        </div>
        <div className='tv'>
          <p>Televisão</p>
          <button onClick={ligarTvSala}>
            {dispositivoSala.tvOn ? 'Desligar Tv' : 'Ligar Tv'}
          </button>
          <img src='tv.png' className={`status ${dispositivoSala.tvOn ? 'on' : 'off'}`}/>
          <p>Canal da TV: {dispositivoExtras.canalTV}</p>
          <button onClick={() => mudarCanalTV(dispositivoExtras.canalTV + 1)}>Próximo Canal</button>
        </div>
        <div className='ar'>
          <p>Ar Condicionado</p>
          <button onClick={ligarArSala}>
          {dispositivoSala.arOn ? 'Desligar Ar' : 'Ligar Ar'}
          </button>
          <img src='ar.png' className={`status ${dispositivoSala.arOn ? 'on' : 'off'}`}/>
          <p>Temperatura do Ar Condicionado: {dispositivoExtras.temperaturaAr}°C</p>
          <input type="range" min="18" max="30" value={dispositivoExtras.temperaturaAr} onChange={(e) => ajustarTemperaturaAr(e.target.value)}/>
        </div>
      </div>
      <div className='cozinha'>
        <p>Cozinha</p>
        <div className='luz'>
          <p>Luz</p>
          <button onClick={acenderLuzCozinha}>
            {dispositivoCozinha.luzCozinhaOn ? 'Desligar Luz' : 'Ligar Luz'}
          </button>
          <img src='luz.png' className={`status ${dispositivoCozinha.luzCozinhaOn ? 'on' : 'off'}`} />
        </div>
        <div className='geladeira'>
          <p>Geladeira</p>
          <button onClick={ligarGeladeiraCozinha}>
            {dispositivoCozinha.geladeiraOn ? 'Desligar Geladeira' : 'Ligar Geladeira'}
          </button>
          <img src='geladeira.png' className={`status ${dispositivoCozinha.geladeiraOn ? 'on' : 'off'}`}/>
          <p>Temperatura da Geladeira: {dispositivoExtras.temperaturaGeladeira}°C</p>
        </div>
        <div className='fogao'>
          <p>Fogão</p>
          <button onClick={ligarFogaoCozinha}>
            {dispositivoCozinha.fogaoOn ? 'Desligar Fogao' : 'Ligar Fogao'}
          </button>
          <img src='fogao.png' className={`status ${dispositivoCozinha.fogaoOn ? 'on' : 'off'}`}/>
          <p>Potência do Fogão: {dispositivoExtras.potenciaFogao}</p>
          <input type="range" min="1" max="5" value={dispositivoExtras.potenciaFogao} onChange={(e) => ajustarPotenciaFogao(e.target.value)}/>
        </div>
      </div>
      <div className='quarto'>
        <p>Quarto</p>
        <div className='luz'>
          <p>Luz</p>
          <button onClick={acenderLuzQuarto}>
            {dispositivoQuarto.luzQuartoOn ? 'Desligar Luz' : 'Ligar Luz'}
          </button>
          <img src='luz.png' className={`status ${dispositivoQuarto.luzQuartoOn ? 'on' : 'off'}`} />
        </div>
        <div className='ventilador'>
          <p>Ventilador</p>
          <button onClick={ligarVentiladorQuarto}>
            {dispositivoQuarto.ventiladorOn ? 'Desligar Ventilador' : 'Ligar Ventilador'}
          </button>
          <img src='ventilador.png' className={`status ${dispositivoQuarto.ventiladorOn ? 'on' : 'off'}`}/>
          <p>Velocidade do Ventilador: {dispositivoExtras.velocidadeVentilador}</p>
          <input type="range" min="1" max="3" value={dispositivoExtras.velocidadeVentilador} onChange={(e) => ajustarVelocidadeVentilador(e.target.value)}/>
        </div>
        <div className='curtina'>
          <p>Curtina</p>
          <button onClick={abrirCurtinaQuarto}>
            {dispositivoQuarto.curtinaOn ? 'Fechar Curtina' : 'Abrir Curtina'}
          </button>
          <img src='curtina.png' className={`status ${dispositivoQuarto.curtinaOn ? 'on' : 'off'}`}/>
        </div>
      </div>
    </div>
  );
}

export default App;
