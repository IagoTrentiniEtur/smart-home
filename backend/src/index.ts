import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
//criar servidor http
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", //URL do Front-End React
        methods: ["GET","POST"],
    }
});

//estado inicial dos dispositivos
let dispositivosSala = {
    luzSalaOn: false,
    tvOn: false,
    arOn: false
};
let dispositivosCozinha = {
    luzCozinhaOn: false,
    geladeiraOn: false,
    fogaoOn: false
};
let dispositivosQuarto = {
    luzQuartoOn: false,
    ventiladorOn: false,
    curtinaOn: false
}
//escuta os eventos de conexao do socket
io.on('connection',(socket)=>{
    console.log('Cliente conectado',socket.id);

    //enviando o estado inicial dos dispositivos para o cliente
    socket.emit('estadoInicialSala',dispositivosSala);

    //manipulando os eventos e mudanças do estado dos dispositivos
    socket.on('acenderLuzSala',() => {
        dispositivosSala.luzSalaOn = !dispositivosSala.luzSalaOn;
        io.emit('estadoAlteraSala',dispositivosSala);
    });
    socket.on('ligarTvSala',() => {
        dispositivosSala.tvOn = !dispositivosSala.tvOn;
        io.emit('estadoAlteraSala',dispositivosSala);
    });
    socket.on('ligarArSala',() => {
        dispositivosSala.arOn = !dispositivosSala.arOn;
        io.emit('estadoAlteraSala',dispositivosSala);
    });

    socket.emit('estadoInicialCozinha',dispositivosCozinha);
    socket.on('acenderLuzCozinha',() => {
        dispositivosCozinha.luzCozinhaOn = !dispositivosCozinha.luzCozinhaOn;
        io.emit('estadoAlteraCozinha',dispositivosCozinha);
    });
    socket.on('ligarGeladeiraCozinha',() => {
        dispositivosCozinha.geladeiraOn = !dispositivosCozinha.geladeiraOn;
        io.emit('estadoAlteraCozinha',dispositivosCozinha);
    });
    socket.on('ligarFogaoCozinha',() => {
        dispositivosCozinha.fogaoOn = !dispositivosCozinha.fogaoOn;
        io.emit('estadoAlteraCozinha',dispositivosCozinha);
    });

    socket.emit('estadoInicialQuarto',dispositivosQuarto);
    socket.on('acenderLuzQuarto',() => {
        dispositivosQuarto.luzQuartoOn = !dispositivosQuarto.luzQuartoOn;
        io.emit('estadoAlteraQuarto',dispositivosQuarto);
    });
    socket.on('ligarVentiladorQuarto',() => {
        dispositivosQuarto.ventiladorOn = !dispositivosQuarto.ventiladorOn;
        io.emit('estadoAlteraQuarto',dispositivosQuarto);
    });
    socket.on('abrirCurtinaQuarto',() => {
        dispositivosQuarto.curtinaOn = !dispositivosQuarto.curtinaOn;
        io.emit('estadoAlteraQuarto',dispositivosQuarto);
    });
});


//Iniciar Servidor npm start
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// Variáveis adicionais para dispositivos
let dispositivosExtras = {
    canalTV: 1, // Estado inicial para o canal da TV
    temperaturaAr: 24, // Estado inicial para a temperatura do ar condicionado
    temperaturaGeladeira: 4, // Estado inicial da temperatura da geladeira
    potenciaFogao: 3, // Potência inicial do fogão
    velocidadeVentilador: 2 // Velocidade inicial do ventilador
};

// Temperatura máxima permitida para a geladeira
const temperaturaMaxGeladeira = 8;

// Manipulando eventos adicionais
io.on('connection', (socket) => {

    // Emitir estado inicial para o cliente
    socket.emit('estadoInicialExtras', dispositivosExtras);

    // Controle de mudar o canal da TV
    socket.on('mudarCanalTV', (novoCanal) => {
        dispositivosExtras.canalTV = novoCanal;
        io.emit('estadoAlteraExtras', dispositivosExtras);
    });

    // Controle de ajustar a temperatura do ar condicionado
    socket.on('ajustarTemperaturaAr', (novaTemp) => {
        dispositivosExtras.temperaturaAr = novaTemp;
        io.emit('estadoAlteraExtras', dispositivosExtras);
    });

    // Monitorar a temperatura da geladeira
    setInterval(() => {
        if (dispositivosExtras.temperaturaGeladeira > temperaturaMaxGeladeira) {
            io.emit('alertaGeladeira', 'Temperatura da geladeira excedeu o limite!');
        }
    }, 5000); // Monitorar a cada 5 segundos

    // Controle de ajustar a potência do fogão
    socket.on('ajustarPotenciaFogao', (novaPotencia) => {
        dispositivosExtras.potenciaFogao = novaPotencia;
        io.emit('estadoAlteraExtras', dispositivosExtras);
    });

    // Controle de ajustar a velocidade do ventilador
    socket.on('ajustarVelocidadeVentilador', (novaVelocidade) => {
        dispositivosExtras.velocidadeVentilador = novaVelocidade;
        io.emit('estadoAlteraExtras', dispositivosExtras);
    });

});
