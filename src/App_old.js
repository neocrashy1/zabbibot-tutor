import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, RotateCcw, Trophy, Zap, Target, Lightbulb, Rocket, Coffee, Heart } from 'lucide-react';

const ZabbiBotTutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userLevel, setUserLevel] = useState(null);
  const [currentTool, setCurrentTool] = useState(null);
  const [conversationState, setConversationState] = useState('greeting');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [userName, setUserName] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    addBotMessage(`🎮 E aí, futuro mestre do monitoramento!

Antes de começar nossa aventura épica, me conta: **qual seu nome?** 

(Pode ser seu nome real ou um apelido maneiro tipo "ZabbixSlayer" 😎)`);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (content, delay = 800) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content,
        timestamp: new Date()
      }]);
    }, delay);
  };

  const addSystemMessage = (content) => {
    setMessages(prev => [...prev, {
      type: 'system',
      content,
      timestamp: new Date()
    }]);
  };

  const addXP = (amount, reason = '') => {
    setXp(prev => prev + amount);
    addSystemMessage(`✨ +${amount} XP ${reason ? `- ${reason}` : ''}! Você tá ON FIRE! 🔥`);
  };

  const quizzes = {
    zabbix_basico: [
      {
        question: "🤔 O que é um HOST no Zabbix?",
        options: [
          "A) Um servidor web que hospeda o Zabbix",
          "B) O dispositivo ou sistema que você quer monitorar",
          "C) Um tipo de trigger especial",
          "D) O banco de dados do Zabbix"
        ],
        correct: 1,
        explanation: "Isso aí! 🎯 HOST é qualquer coisa que você quer monitorar: servidor, switch, impressora, até sua cafeteira IoT!"
      },
      {
        question: "🎯 Qual a diferença entre ITEM e TRIGGER?",
        options: [
          "A) Item coleta dados, Trigger define quando alertar",
          "B) São a mesma coisa com nomes diferentes",
          "C) Item é para alertas, Trigger é para gráficos",
          "D) Item é novo, Trigger é o jeito antigo"
        ],
        correct: 0,
        explanation: "EXATAMENTE! 💡 Item = O Espião (coleta info), Trigger = O Alarme (avisa quando tem problema)!"
      }
    ],
    grafana_basico: [
      {
        question: "🎨 Para que serve o Grafana?",
        options: [
          "A) Coletar métricas de servidores",
          "B) Criar dashboards visuais bonitos",
          "C) Substituir o Zabbix completamente",
          "D) Fazer backup de dados"
        ],
        correct: 1,
        explanation: "Perfeito! 🌟 Grafana é o Photoshop dos dados - pega números feios e deixa tudo LINDO!"
      }
    ]
  };

  const smartRespond = (userMsg) => {
    const msg = userMsg.toLowerCase().trim();

    if (conversationState === 'greeting') {
      setUserName(userMsg.trim());
      setConversationState('choosing_level');
      addXP(10, 'Bem-vindo(a)');
      return `Prazer, **${userMsg.trim()}**! 🤝 Que nome massa!

Agora me conta, qual seu nível de experiência com Zabbix e Grafana?

🌱 **1** - Iniciante Total (tipo "o que é isso?")
🌿 **2** - Básico (já ouvi falar, mexi um pouquinho)
🌳 **3** - Intermediário (uso no trabalho)
🚀 **4** - Avançado (sou praticamente um ninja!)

**Digite só o número!** 👆`;
    }

    if (conversationState === 'choosing_level') {
      if (msg === '1' || msg.includes('iniciante') || msg.includes('total')) {
        setUserLevel('iniciante');
        setConversationState('choosing_tool');
        addXP(15, 'Humildade é o primeiro passo');
        return `Perfeito, ${userName}! 🌱 TODO MESTRE JÁ FOI INICIANTE!

Vamos começar devagar e firme. Escolhe qual ferramenta quer dominar primeiro:

🔵 **ZABBIX** - O cérebro que monitora tudo
   (digita: zabbix)

🟣 **GRAFANA** - A beleza dos dashboards
   (digita: grafana)

🔶 **OS DOIS!** - Modo hardcore
   (digita: ambos)

**Qual vai ser?** 🎮`;
      } else if (msg === '2' || msg.includes('básico')) {
        setUserLevel('basico');
        setConversationState('choosing_tool');
        addXP(25, 'Já tem base');
        return `Show, ${userName}! 🌿 Você já tá na caminhada!

Vamos preencher as lacunas e te levar pro próximo nível!

Qual ferramenta quer aperfeiçoar?
🔵 **zabbix** | 🟣 **grafana** | 🔶 **ambos**`;
      } else if (msg === '3' || msg.includes('intermediário')) {
        setUserLevel('intermediario');
        setConversationState('choosing_tool');
        addXP(35, 'Nível respeitável');
        return `Opa, ${userName}! 🌳 Um profissional de verdade!

Agora vamos para técnicas ninja e otimizações!

Escolhe a arma:
🔵 **zabbix** | 🟣 **grafana** | 🔶 **ambos**`;
      } else if (msg === '4' || msg.includes('avançado') || msg.includes('ninja')) {
        setUserLevel('avancado');
        setConversationState('choosing_tool');
        addXP(50, 'RESPEITA O MESTRE');
        return `CARALH*! 🚀 Temos um MESTRE aqui, ${userName}!

Preparei conteúdo hardcore para você:
🔵 **zabbix** | 🟣 **grafana** | 🔶 **ambos**

**Bora dominar o mundo!** 😎`;
      }
      return `Hmm, não entendi... Digite apenas **1**, **2**, **3** ou **4**! 😅`;
    }

    if (conversationState === 'choosing_tool') {
      if (msg.includes('zabbix')) {
        setCurrentTool('zabbix');
        setConversationState('learning');
        addXP(20, 'Zabbix selecionado');
        return `🔵 **ZABBIX ESCOLHIDO!** Excelente escolha, ${userName}!

Vamos começar com o essencial. Escolhe seu caminho:

**1️⃣ TUTORIAL RÁPIDO** (15 min) ⚡
   → Instalação básica + primeiro monitoramento
   
**2️⃣ CONCEITOS FUNDAMENTOS** (30 min) 🎓
   → Host, Items, Triggers, Actions explicados
   
**3️⃣ MÃO NA MASSA** (60 min) 💪
   → Projeto completo do zero
   
**4️⃣ QUIZ DE AQUECIMENTO** (5 min) 🎮
   → Testa o que você já sabe!

**Digite o número que escolher!** 🎯`;
      } else if (msg.includes('grafana')) {
        setCurrentTool('grafana');
        setConversationState('learning');
        addXP(20, 'Grafana selecionado');
        return `🟣 **GRAFANA NA ÁREA!** Boa, ${userName}! Dashboards bonitos = reuniões mais curtas! 😂

Escolhe seu caminho:

**1️⃣ INSTALAÇÃO TURBINADA** ⚡
   → Do zero até seu primeiro dashboard
   
**2️⃣ DASHBOARDS PROFISSIONAIS** 🎨
   → Criando painéis que impressionam
   
**3️⃣ QUERIES AVANÇADAS** 🔥
   → Extraindo dados como um ninja
   
**4️⃣ QUIZ RELÂMPAGO** 🎮
   → Vamos testar seus conhecimentos!

**Qual vai ser?** 🚀`;
      } else if (msg.includes('ambos') || msg.includes('dois')) {
        setCurrentTool('ambos');
        setConversationState('learning');
        addXP(40, 'MODO HARDCORE ATIVADO');
        return `🔶 **MODO HARDCORE ATIVADO!** 💥

${userName}, você é corajoso! Vamos dominar TUDO!

**PLANO DE ATAQUE:**
1️⃣ Zabbix (coletar dados)
2️⃣ Grafana (visualizar bonito)
3️⃣ Integração (magia acontece)

**Por onde começamos?**
- **zabbix** (começar pelo cérebro)
- **grafana** (começar pela beleza)

Ou digita **roadmap** para ver o caminho completo! 🗺️`;
      }
      return `Não entendi! Digite **zabbix**, **grafana** ou **ambos**! 😊`;
    }

    if (conversationState === 'learning') {
      if (msg.includes('ajuda') || msg === 'help' || msg === '?') {
        return `📚 **COMANDOS DISPONÍVEIS:**

**Navegação:**
- \`voltar\` - Volta ao menu anterior
- \`reset\` - Recomeça do zero
- \`roadmap\` - Vê o caminho completo

**Interação:**
- \`quiz\` - Inicia desafio
- \`dica\` - Recebe uma dica aleatória
- \`progresso\` - Vê seu status
- \`foco\` - Técnica de concentração

**Aprendizado:**
- \`exemplo\` - Vê um exemplo prático
- \`explicar [tema]\` - Aprofunda em algo

Qualquer dúvida, é só perguntar! 💬`;
      }

      if (msg === 'progresso' || msg === 'status' || msg === 'xp') {
        const level = xp < 100 ? 'Novato' : xp < 300 ? 'Aprendiz' : xp < 600 ? 'Praticante' : xp < 1000 ? 'Especialista' : 'MESTRE';
        return `📊 **STATUS DE ${userName.toUpperCase()}**

🏆 **XP:** ${xp} pontos
⭐ **Nível:** ${level}
🔥 **Streak:** ${streak} dias
🎯 **Ferramenta:** ${currentTool || 'Nenhuma'}
📚 **Nível técnico:** ${userLevel}

${xp >= 1000 ? '🎖️ VOCÊ É UM MESTRE SUPREMO! 👑' : xp >= 500 ? '🥈 Tá quase no topo! Continue!' : '🌱 Continue aprendendo!'}

**Próxima conquista:** ${xp < 100 ? '100 XP (Aprendiz)' : xp < 300 ? '300 XP (Praticante)' : xp < 600 ? '600 XP (Especialista)' : xp < 1000 ? '1000 XP (MESTRE)' : 'VOCÊ DOMINOU TUDO! 🎉'}`;
      }

      if (msg === 'dica' || msg === 'tip') {
        const tips = [
          "💡 **Pro Tip:** Sempre documente suas configurações! Seu eu do futuro vai agradecer de joelhos! 🙏",
          "💡 **Sacada:** Use naming conventions! Ex: web-prod-01, web-prod-02... Organização = Sanidade Mental 🧠",
          "💡 **Hack:** Template é vida! Crie UMA VEZ, use SEMPRE! #PreguiçaInteligente 😎",
          "💡 **Regra de Ouro:** Menos alertas = Mais atenção. Não seja o garoto que gritava LOBO! 🐺",
          "💡 **Sabedoria:** Dashboard bom conta uma HISTÓRIA, não joga números na cara! 📖",
          "💡 **Segredo:** Teste TUDO em homologação primeiro. Produção não perdoa! ☠️",
          "💡 **Ninja Move:** Macros deixam tudo flexível. Use {$VARIAVEIS} em tudo! 🥷",
          "💡 **Game Changer:** Backup é que nem seguro: só vê o valor quando precisa! 💾"
        ];
        addXP(5, 'Curiosidade');
        return tips[Math.floor(Math.random() * tips.length)];
      }

      if (msg.includes('quiz') || msg === '4') {
        const quizKey = currentTool === 'zabbix' ? 'zabbix_basico' : 'grafana_basico';
        if (!quizzes[quizKey] || quizzes[quizKey].length === 0) {
          return "😅 Ainda não criei quiz para esse nível! Mas tô trabalhando nisso! Digite **1**, **2** ou **3** para continuar aprendendo!";
        }
        const quiz = quizzes[quizKey][0];
        setQuizMode(true);
        setCurrentQuiz(quiz);
        return `🎮 **QUIZ TIME!** Vamos testar seus neurônios!

${quiz.question}

${quiz.options.map((opt, idx) => opt).join('\n')}

**Digite a letra da resposta (A, B, C ou D)** 🎯`;
      }

      if (quizMode && currentQuiz) {
        const answer = msg.toUpperCase().replace(/[^ABCD]/g, '');
        const correctLetter = ['A', 'B', 'C', 'D'][currentQuiz.correct];
        
        if (answer === correctLetter) {
          setQuizMode(false);
          setCurrentQuiz(null);
          addXP(30, 'Acertou no quiz');
          return `🎉 **ACERTOOOOU!** 🎉

${currentQuiz.explanation}

Você tá mandando bem demais! Continue assim! 💪

Digite **quiz** para mais perguntas ou escolha outro caminho! 🚀`;
        } else if (answer && ['A', 'B', 'C', 'D'].includes(answer)) {
          setQuizMode(false);
          setCurrentQuiz(null);
          addXP(10, 'Tentou o quiz');
          return `😅 **Ops! Não foi dessa vez...**

A resposta certa era **${correctLetter}**!

${currentQuiz.explanation}

Mas ei, errar faz parte! Você ganhou 10 XP só por tentar! 💪

Digite **quiz** para tentar outra ou continue aprendendo! 📚`;
        }
        return "Digite apenas **A**, **B**, **C** ou **D**! 😊";
      }

      if (currentTool === 'zabbix' || currentTool === 'ambos') {
        if (msg === '1' || msg.includes('tutorial') || msg.includes('rápido')) {
          addXP(20, 'Tutorial iniciado');
          return `⚡ **TUTORIAL TURBINADO - 15 MINUTOS**

Vamos instalar e configurar o Zabbix rapidinho!

**PASSO 1: Preparar o ambiente** 🛠️

\`\`\`bash
# Ubuntu 22.04/24.04
sudo apt update && sudo apt upgrade -y
\`\`\`

**O que isso faz?**
Atualiza o sistema (pensa como Windows Update, mas rápido! 😂)

**Executou?** Digite **ok** para continuar! ⏭️`;
        }

        if (msg === 'ok' || msg === 'sim' || msg === 'feito' || msg === 'pronto') {
          addXP(15, 'Progresso');
          return `🚀 **PASSO 2: Adicionar repositório Zabbix**

\`\`\`bash
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
sudo dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
sudo apt update
\`\`\`

**Traduzindo:**
- \`wget\` = baixa o arquivo
- \`dpkg -i\` = instala o pacote
- \`apt update\` = atualiza lista de pacotes

É tipo baixar um instalador e executar! 📦

**Executou?** Digite **ok** novamente! 👍`;
        }

        if (msg === '2' || msg.includes('conceitos') || msg.includes('fundamentos')) {
          addXP(20, 'Conceitos iniciado');
          return `🎓 **CONCEITOS FUNDAMENTAIS DO ZABBIX**

Vou te explicar os 4 pilares de forma que NUNCA MAIS você esquece:

**1️⃣ HOST** 🖥️
O "QUEM" você quer monitorar
→ Pensa como uma pessoa na sua agenda de contatos
→ Pode ser: servidor, switch, impressora, IoT, etc.

**2️⃣ ITEM** 📊
O "O QUÊ" você quer saber dessa pessoa
→ CPU? Memória? Espaço em disco?
→ É tipo perguntar "Como você tá?" e esperar resposta específica

**3️⃣ TRIGGER** 🚨
O "QUANDO" você deve se preocupar
→ Define os limites: "Se CPU > 90%, ME AVISA!"
→ É o sistema de alerta inteligente

**4️⃣ ACTION** 📧
O "O QUE FAZER" quando a merda bate no ventilador
→ Mandar email? SMS? Acionar script?
→ A ação automática!

**ANALOGIA MATADORA:** 🎯
Zabbix é tipo um personal trainer para servidores:
- Observa (Items)
- Avisa quando tá errado (Triggers)
- Toma ação (Actions)

**Entendeu a base?** Digite **exemplo** para ver isso na prática! 💡`;
        }

        if (msg.includes('exemplo') || msg.includes('prática')) {
          addXP(25, 'Exemplo prático');
          return `💪 **EXEMPLO PRÁTICO - MUNDO REAL**

Vamos monitorar um servidor web! 🌐

**CENÁRIO:**
Você tem um servidor web com nginx rodando seu site.

**CONFIGURAÇÃO:**

**HOST:**
\`\`\`
Nome: Web-Server-01
IP: 192.168.1.100
Template: Linux by Zabbix agent
\`\`\`

**ITEMS (o que monitorar):**
- CPU Usage → system.cpu.util
- RAM Usage → vm.memory.size[available]
- Nginx Running → proc.num[nginx]
- HTTP Response → web.page.perf[http://meusite.com]

**TRIGGERS (quando alertar):**
- CPU > 80% por 5 minutos → WARNING
- RAM < 500MB → WARNING
- Nginx parado → DISASTER 🔥
- Site não responde → HIGH

**ACTIONS (o que fazer):**
- WARNING → Mandar email pro time
- DISASTER → Email + SMS pro gerente!

**Sacou a pegada?** 🎯
É uma cadeia lógica: Monitora → Detecta → Alerta → Age

Digite **3** para projeto completo ou **quiz** para testar! 🚀`;
        }
      }

      if (currentTool === 'grafana') {
        if (msg === '1' || msg.includes('instalação')) {
          addXP(20, 'Instalação Grafana');
          return `📊 **INSTALANDO GRAFANA - RAPIDÃO!**

**PASSO 1: Adicionar repositório**

\`\`\`bash
sudo apt-get install -y apt-transport-https software-properties-common
sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
\`\`\`

**PASSO 2: Instalar**

\`\`\`bash
sudo apt-get update
sudo apt-get install grafana
\`\`\`

**PASSO 3: Iniciar serviço**

\`\`\`bash
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
\`\`\`

**ACESSO:** http://seu-ip:3000
**Login padrão:**
- User: admin
- Pass: admin (MUDE ISSO AGORA! 🔒)

**Conseguiu acessar?** Digite **ok**! 🎉`;
        }
      }

      if (msg.includes('como') || msg.includes('o que é') || msg.includes('explica')) {
        return `Hmm, boa pergunta! 🤔

Para te ajudar melhor, escolhe uma opção do menu que mostrei antes, ou seja mais específico!

Por exemplo:
- "explica trigger"
- "como funciona item"
- "diferença entre host e template"

Ou digite **ajuda** para ver todos os comandos! 💬`;
      }
    }

    return `😅 Ops! Não entendi muito bem...

${conversationState === 'learning' ? '**Comandos disponíveis:**\n• Digite um número (1, 2, 3, 4)\n• \`ajuda\` - Ver todos comandos\n• \`voltar\` - Voltar ao menu\n• \`dica\` - Receber uma dica\n• \`quiz\` - Fazer um quiz' : 'Tenta reformular ou responder a pergunta que fiz! 😊'}

Qualquer dúvida, tamo junto! 💪`;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const response = smartRespond(input);
    addBotMessage(response, 600);

    setInput('');
  };

  const handleReset = () => {
    setMessages([]);
    setUserLevel(null);
    setCurrentTool(null);
    setConversationState('greeting');
    setXp(0);
    setStreak(1);
    setUserName('');
    setQuizMode(false);
    setCurrentQuiz(null);
    addBotMessage(`🔄 **RESET COMPLETO!**

Vamos começar de novo! Qual seu nome? 😊`, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-lg rounded-t-3xl p-6 border-b-2 border-purple-500/50 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg animate-pulse">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">ZabbiBot 🤖</h1>
                <p className="text-purple-300 font-medium">Seu tutor épico de Zabbix & Grafana</p>
                {userName && <p className="text-sm text-blue-300">Olá, {userName}! 👋</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center bg-yellow-900/30 px-4 py-2 rounded-xl border border-yellow-500/30">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Trophy className="w-5 h-5" />
                  <span className="font-black text-lg">{xp}</span>
                </div>
                <p className="text-xs text-gray-400">XP</p>
              </div>
              
              <div className="text-center bg-orange-900/30 px-4 py-2 rounded-xl border border-orange-500/30">
                <div className="flex items-center gap-2 text-orange-400">
                  <Zap className="w-5 h-5" />
                  <span className="font-black text-lg">{streak}</span>
                </div>
                <p className="text-xs text-gray-400">Streak</p>
              </div>
              
              <button
                onClick={handleReset}
                className="p-3 bg-red-600/20 hover:bg-red-600/40 rounded-xl transition-all border border-red-500/30 group"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5 text-red-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm h-[550px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Coffee className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Aguardando mensagens...</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : message.type === 'system'
                    ? 'bg-green-900/50 text-green-300 border border-green-500/30 text-center'
                    : 'bg-slate-700/90 text-gray-100 border border-slate-600/50'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('```')) {
                      return null;
                    }
                    if (line.trim().startsWith('sudo ') || line.trim().startsWith('wget ')) {
                      return (
                        <code key={i} className="block bg-black/50 p-2 rounded my-2 text-green-400 font-mono text-xs">
                          {line}
                        </code>
                      );
                    }
                    return <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">{line}</p>;
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-slate-800/80 backdrop-blur-lg rounded-b-3xl p-5 border-t-2 border-purple-500/50 shadow-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua resposta..."
              className="flex-1 bg-slate-700/80 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-600/50 placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl px-8 py-4 flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/50 font-bold"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => setInput('ajuda')} className="text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-2 rounded-lg transition-all border border-slate-600/50">
              📚 Ajuda
            </button>
            <button onClick={() => setInput('progresso')} className="text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-2 rounded-lg transition-all border border-slate-600/50">
              📊 Progresso
            </button>
            <button onClick={() => setInput('dica')} className="text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-2 rounded-lg transition-all border border-slate-600/50">
              💡 Dica
            </button>
            <button onClick={() => setInput('quiz')} className="text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-2 rounded-lg transition-all border border-slate-600/50">
              🎮 Quiz
            </button>
            <button onClick={() => setInput('exemplo')} className="text-xs bg-slate-700/50 hover:bg-slate-600 text-gray-300 px-3 py-2 rounded-lg transition-all border border-slate-600/50">
              💡 Exemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZabbiBotTutor;