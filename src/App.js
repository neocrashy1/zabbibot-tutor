import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, RotateCcw, Trophy, Zap, Target, Sparkles, Code, Cpu, Flame, Rocket, Wand2, GitBranch, Search, BookOpen, Wrench, Shield, TrendingUp, Lightbulb, Award, MessageSquare, FileCode, Activity } from 'lucide-react';

const ZabbiBotTutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationState, setConversationState] = useState('greeting');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [userName, setUserName] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Super Modos
  const [superMode, setSuperMode] = useState(null); // 'ai-chat', 'code-analyzer', 'simulator', 'script-gen', 'troubleshoot', 'mentor', 'architect'
  
  const [learningProfile, setLearningProfile] = useState({
    style: null,
    personality: null,
    focusLevel: 100,
    energy: 100,
    frustrationLevel: 0,
    successStreak: 0,
    preferredPace: 'medium',
    motivationType: null,
  });
  
  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    interactions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    pomodoroCount: 0,
    lastBreakTime: Date.now(),
    aiCallsUsed: 0,
  });

  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentTool, setCurrentTool] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    addBotMessage(`🦸‍♂️ **ZabbiBot 3.0 - SUPER IA TUTOR**

Eu não sou um tutor comum. Sou uma **IA AVANÇADA** com super poderes:

🤖 **IA Conversacional** - Converso sobre QUALQUER dúvida
🔍 **Analisador de Código** - Analiso configs e scripts
🎮 **Simulador** - Crio cenários reais para treinar
🛠️ **Gerador de Scripts** - Crio código personalizado
🐛 **Troubleshooter** - Resolvo problemas reais
🧙 **Mentor Socrático** - Te guio com perguntas inteligentes
🏗️ **Arquiteto** - Desenho infraestruturas completas

Mas primeiro... **qual seu nome?** 😊`, 0);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (content, delay = 800) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content,
        timestamp: new Date(),
        mood: getBotMood()
      }]);
    }, delay);
  };

  const addSystemMessage = (content, type = 'info') => {
    setMessages(prev => [...prev, {
      type: 'system',
      content,
      timestamp: new Date(),
      systemType: type
    }]);
  };

  const addXP = (amount, reason = '') => {
    setXp(prev => prev + amount);
    setLearningProfile(prev => ({
      ...prev,
      successStreak: prev.successStreak + 1,
      frustrationLevel: Math.max(0, prev.frustrationLevel - 10)
    }));
    addSystemMessage(`✨ +${amount} XP ${reason ? `- ${reason}` : ''}! 🔥`, 'success');
  };

  const getBotMood = () => {
    const { focusLevel, energy, frustrationLevel, successStreak } = learningProfile;
    if (frustrationLevel > 60) return 'supportive';
    if (energy < 40) return 'energetic';
    if (successStreak > 3) return 'challenging';
    if (focusLevel > 80 && energy > 70) return 'intense';
    return 'balanced';
  };

  // SUPER PODER 1: IA Conversacional com Claude API
  const callClaudeAI = async (userQuestion, context = '') => {
    setIsAiThinking(true);
    setSessionData(prev => ({ ...prev, aiCallsUsed: prev.aiCallsUsed + 1 }));
    
    try {
      const systemPrompt = `Você é o ZabbiBot 3.0, um tutor especialista em Zabbix e Grafana com formação em pedagogia e psicologia educacional.

Perfil do aluno:
- Nome: ${userName}
- Nível: ${userLevel}
- Estilo: ${learningProfile.style}
- Personalidade: ${learningProfile.personality}
- Motivação: ${learningProfile.motivationType}

Contexto: ${context}

Seja: divertido, use emojis, explique de forma clara, adapte ao perfil do aluno. Use analogias e exemplos práticos. Seja motivador!`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...conversationHistory,
            { role: "user", content: userQuestion }
          ],
        })
      });

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      // Atualiza histórico
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: userQuestion },
        { role: "assistant", content: aiResponse }
      ]);
      
      setIsAiThinking(false);
      return aiResponse;
      
    } catch (error) {
      setIsAiThinking(false);
      return `❌ Ops! Erro ao conectar com a IA: ${error.message}\n\nMas não se preocupe, ainda posso te ajudar de outras formas! 💪`;
    }
  };

  // SUPER PODER 2: Gerador Dinâmico de Tutoriais
  const generateTutorial = async (topic) => {
    const prompt = `Crie um tutorial COMPLETO e PRÁTICO sobre: "${topic}"

Inclua:
1. Introdução rápida (por que é importante)
2. Pré-requisitos
3. Passo a passo com comandos
4. Exemplos práticos
5. Dicas pro
6. Troubleshooting comum

Use formato markdown, comandos em blocos de código, e seja MUITO prático!`;

    return await callClaudeAI(prompt, `Tutorial solicitado: ${topic}`);
  };

  // SUPER PODER 3: Analisador de Código
  const analyzeCode = async (code, type = 'config') => {
    const prompt = `Analise este ${type} de Zabbix/Grafana:

\`\`\`
${code}
\`\`\`

Forneça:
1. 🎯 Resumo do que faz
2. ✅ Pontos positivos
3. ⚠️ Problemas/Melhorias
4. 💡 Sugestões otimizadas
5. 🔒 Considerações de segurança

Seja específico e prático!`;

    return await callClaudeAI(prompt, `Análise de ${type}`);
  };

  // SUPER PODER 4: Simulador Interativo
  const createScenario = async (difficulty = 'medium') => {
    const levels = {
      easy: 'iniciante',
      medium: 'intermediário',
      hard: 'avançado'
    };
    
    const prompt = `Crie um cenário REALISTA de problema de monitoramento para nível ${levels[difficulty]}:

Inclua:
1. 🎬 Situação (descrição do problema)
2. 📊 Métricas observadas
3. ❓ Pergunta: "O que você faria?"
4. 💡 Dicas (opcional)

Seja específico com números reais! Exemplo: "CPU em 95%, RAM 87%, load average 8.5"`;

    return await callClaudeAI(prompt, 'Simulação de cenário');
  };

  // SUPER PODER 5: Gerador de Scripts
  const generateScript = async (description) => {
    const prompt = `Gere um script FUNCIONAL baseado nesta descrição:

"${description}"

Forneça:
1. 💻 Código completo e comentado
2. 📝 Explicação do que faz
3. 🚀 Como usar
4. ⚙️ Requisitos
5. 🔧 Customizações possíveis

Use linguagem apropriada (bash, python, etc)`;

    return await callClaudeAI(prompt, 'Geração de script');
  };

  // SUPER PODER 6: Troubleshooting Inteligente
  const troubleshoot = async (problem) => {
    const prompt = `TROUBLESHOOT este problema:

"${problem}"

Forneça:
1. 🔍 Diagnóstico provável
2. ✅ Como verificar (comandos)
3. 🛠️ Soluções (passo a passo)
4. 🔄 Como testar se resolveu
5. 🚨 Quando escalar

Seja MUITO prático e direto!`;

    return await callClaudeAI(prompt, 'Troubleshooting');
  };

  // SUPER PODER 7: Modo Mentor Socrático
  const socraticMentor = async (studentAnswer, topic) => {
    const prompt = `MODO MENTOR SOCRÁTICO sobre "${topic}":

Aluno respondeu: "${studentAnswer}"

Faça 2-3 perguntas inteligentes que:
1. Façam o aluno PENSAR mais profundamente
2. Guiem para descobrir a resposta
3. Não dê a resposta direta!

Use o método socrático clássico!`;

    return await callClaudeAI(prompt, 'Modo mentor');
  };

  // SUPER PODER 8: Arquiteto de Projetos
  const architectProject = async (requirements) => {
    const prompt = `Como ARQUITETO, desenhe uma infraestrutura de monitoramento baseada em:

"${requirements}"

Forneça:
1. 🏗️ Arquitetura proposta (descrição)
2. 🔧 Componentes necessários
3. 📊 Templates/Dashboards recomendados
4. 🔄 Fluxo de dados
5. 💰 Estimativa de recursos
6. 📈 Escalabilidade

Seja detalhado e profissional!`;

    return await callClaudeAI(prompt, 'Arquitetura de projeto');
  };

  const profileQuestions = {
    learning_style: {
      question: `${userName}, vou criar uma experiência PERFEITA! 🎯

**Como você aprende MELHOR?**

A) 📊 Visual (gráficos, diagramas)
B) 🎧 Auditivo (explicações)
C) 📝 Leitura (textos, docs)
D) 🛠️ Prático (mão na massa)`,
      profiles: { A: 'visual', B: 'auditivo', C: 'reading', D: 'kinesthetic' }
    },
    personality: {
      question: `**Seu estilo de aprender:**

A) 🗺️ Explorador (tentativa e erro)
B) 📋 Estrategista (plano estruturado)
C) ⚡ Pragmático (direto ao ponto)
D) 👥 Social (trocar ideias)`,
      profiles: { A: 'explorador', B: 'estrategista', C: 'pragmatico', D: 'social' }
    },
    motivation: {
      question: `**O que te MOTIVA?**

A) 🏆 Conquistar objetivos
B) 🎓 Dominar profundamente
C) 🔓 Liberdade criativa
D) 🌟 Ajudar outros`,
      profiles: { A: 'achievement', B: 'mastery', C: 'autonomy', D: 'purpose' }
    }
  };

  const smartRespond = async (userMsg) => {
    const msg = userMsg.toLowerCase().trim();
    setLastInteractionTime(Date.now());
    setSessionData(prev => ({ ...prev, interactions: prev.interactions + 1 }));

    // SUPER MODO ATIVO
    if (superMode === 'ai-chat') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do modo IA Chat! Voltando ao menu principal.\n\nDigite **menu** para ver opções! 🎯';
      }
      
      const aiResponse = await callClaudeAI(userMsg, `Conversa livre sobre Zabbix/Grafana`);
      addXP(10, 'IA Chat');
      return `🤖 **IA Responde:**\n\n${aiResponse}\n\n💬 Continue perguntando ou digite **sair** para voltar!`;
    }

    if (superMode === 'code-analyzer') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do Analisador! Digite **menu** para opções! 🎯';
      }
      
      if (msg.length < 20) {
        return '📋 Cole aqui sua configuração ou código do Zabbix/Grafana que vou analisar!\n\nOu digite **sair** para voltar.';
      }
      
      const analysis = await analyzeCode(userMsg, 'configuração');
      addXP(30, 'Código analisado');
      return `🔍 **ANÁLISE COMPLETA:**\n\n${analysis}\n\n📋 Cole outro código ou **sair**!`;
    }

    if (superMode === 'script-gen') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do Gerador! Digite **menu**! 🎯';
      }
      
      if (msg.length < 10) {
        return '💡 Descreva o que você precisa!\n\nExemplo: "Script para monitorar containers Docker e alertar quando CPU > 80%"\n\nOu **sair** para voltar.';
      }
      
      const script = await generateScript(userMsg);
      addXP(50, 'Script gerado');
      return `🛠️ **SCRIPT GERADO:**\n\n${script}\n\n💻 Descreva outro ou **sair**!`;
    }

    if (superMode === 'troubleshoot') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do Troubleshooter! Digite **menu**! 🎯';
      }
      
      const solution = await troubleshoot(userMsg);
      addXP(40, 'Problema resolvido');
      return `🐛 **SOLUÇÃO:**\n\n${solution}\n\n🔧 Outro problema? Ou **sair**!`;
    }

    if (superMode === 'simulator') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do Simulador! Digite **menu**! 🎯';
      }
      
      if (msg === 'fácil' || msg === 'facil' || msg === '1') {
        const scenario = await createScenario('easy');
        return `🎮 **CENÁRIO:**\n\n${scenario}\n\n💭 Responda ou digite **nova** para outro cenário!`;
      } else if (msg === 'médio' || msg === 'medio' || msg === '2') {
        const scenario = await createScenario('medium');
        return `🎮 **CENÁRIO:**\n\n${scenario}\n\n💭 Responda ou **nova** para outro!`;
      } else if (msg === 'difícil' || msg === 'dificil' || msg === '3') {
        const scenario = await createScenario('hard');
        return `🎮 **CENÁRIO:**\n\n${scenario}\n\n💭 Responda ou **nova**!`;
      } else if (msg === 'nova' || msg === 'novo') {
        return '🎲 Escolha dificuldade:\n**fácil** | **médio** | **difícil**';
      }
      
      const feedback = await socraticMentor(userMsg, 'cenário de monitoramento');
      addXP(35, 'Simulação');
      return `🧙 **FEEDBACK:**\n\n${feedback}\n\n**nova** cenário ou **sair**!`;
    }

    if (superMode === 'architect') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do Arquiteto! Digite **menu**! 🎯';
      }
      
      if (msg.length < 20) {
        return '🏗️ Descreva sua infraestrutura!\n\nExemplo: "Preciso monitorar 50 servidores Linux, 20 switches, 10 aplicações web e 5 bancos MySQL"\n\n**sair** para voltar.';
      }
      
      const architecture = await architectProject(userMsg);
      addXP(60, 'Arquitetura criada');
      return `🏗️ **ARQUITETURA:**\n\n${architecture}\n\nOutra infraestrutura ou **sair**!`;
    }

    if (superMode === 'tutorial-gen') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo do Gerador! Digite **menu**! 🎯';
      }
      
      if (msg.length < 10) {
        return '📚 Sobre o que quer aprender?\n\nExemplo: "Monitoramento de containers Docker com Zabbix"\n\n**sair** para voltar.';
      }
      
      const tutorial = await generateTutorial(userMsg);
      addXP(45, 'Tutorial criado');
      return `📖 **TUTORIAL:**\n\n${tutorial}\n\nOutro tópico ou **sair**!`;
    }

    // Estados de perfilamento
    if (conversationState === 'greeting') {
      setUserName(userMsg.trim());
      setConversationState('profiling_style');
      addXP(10, 'Bem-vindo');
      return `Prazer, **${userMsg.trim()}**! 🤝\n\n${profileQuestions.learning_style.question}`;
    }

    if (conversationState === 'profiling_style') {
      const answer = msg.toUpperCase().replace(/[^ABCD]/g, '');
      if (['A', 'B', 'C', 'D'].includes(answer)) {
        setLearningProfile(prev => ({ ...prev, style: profileQuestions.learning_style.profiles[answer] }));
        setConversationState('profiling_personality');
        addXP(15, 'Perfil mapeado');
        return profileQuestions.personality.question;
      }
      return 'Digite **A**, **B**, **C** ou **D**! 😊';
    }

    if (conversationState === 'profiling_personality') {
      const answer = msg.toUpperCase().replace(/[^ABCD]/g, '');
      if (['A', 'B', 'C', 'D'].includes(answer)) {
        setLearningProfile(prev => ({ ...prev, personality: profileQuestions.personality.profiles[answer] }));
        setConversationState('profiling_motivation');
        addXP(15, 'Personalidade identificada');
        return profileQuestions.motivation.question;
      }
      return 'Digite **A**, **B**, **C** ou **D**! 😊';
    }

    if (conversationState === 'profiling_motivation') {
      const answer = msg.toUpperCase().replace(/[^ABCD]/g, '');
      if (['A', 'B', 'C', 'D'].includes(answer)) {
        setLearningProfile(prev => ({ ...prev, motivationType: profileQuestions.motivation.profiles[answer] }));
        setConversationState('choosing_level');
        addXP(25, 'Perfil completo');
        return `🎉 **PERFIL COMPLETO!**\n\nQual seu nível técnico?\n\n🌱 **1** - Iniciante\n🌿 **2** - Básico\n🌳 **3** - Intermediário\n🚀 **4** - Avançado`;
      }
      return 'Digite **A**, **B**, **C** ou **D**! 😊';
    }

    if (conversationState === 'choosing_level') {
      if (['1', '2', '3', '4'].includes(msg)) {
        const levels = { '1': 'iniciante', '2': 'basico', '3': 'intermediario', '4': 'avancado' };
        setUserLevel(levels[msg]);
        setConversationState('super_menu');
        addXP(30, 'Pronto para começar');
        return `✨ **PERFIL CONFIGURADO, ${userName}!**\n\nAgora você tem acesso aos SUPER PODERES! 🦸‍♂️\n\nDigite **menu** para ver todas as opções!`;
      }
      return 'Digite **1**, **2**, **3** ou **4**! 😊';
    }

    // Menu principal
    if (msg === 'menu' || msg === 'ajuda' || msg === 'help') {
      return `🦸‍♂️ **SUPER PODERES DISPONÍVEIS:**

**1️⃣ IA CHAT** 🤖
   → Conversa livre sobre QUALQUER dúvida
   → Comando: **ia** ou **chat**

**2️⃣ ANALISADOR** 🔍
   → Cola config/código para análise
   → Comando: **analisar** ou **analise**

**3️⃣ GERADOR DE SCRIPTS** 🛠️
   → Cria scripts personalizados
   → Comando: **gerar** ou **script**

**4️⃣ TROUBLESHOOTER** 🐛
   → Resolve problemas reais
   → Comando: **problema** ou **bug**

**5️⃣ SIMULADOR** 🎮
   → Cenários reais para treinar
   → Comando: **simular** ou **treino**

**6️⃣ ARQUITETO** 🏗️
   → Desenha infraestruturas
   → Comando: **arquitetar** ou **infra**

**7️⃣ TUTORIAL GERADOR** 📚
   → Cria tutoriais sob demanda
   → Comando: **tutorial** ou **aprender**

**Outros Comandos:**
• **progresso** - Ver status
• **perfil** - Ver perfil de aprendizagem
• **dica** - Dica aleatória

**Digite o comando do super poder que quer usar!** 🚀`;
    }

    // Ativar super poderes
    if (msg === 'ia' || msg === 'chat') {
      setSuperMode('ai-chat');
      return `🤖 **MODO IA CHAT ATIVADO!**\n\nPergunte QUALQUER COISA sobre Zabbix, Grafana, monitoramento, etc!\n\nA IA vai responder com inteligência contextual! 🧠\n\n💬 Digite sua pergunta! (ou **sair** para voltar)`;
    }

    if (msg === 'analisar' || msg === 'analise') {
      setSuperMode('code-analyzer');
      return `🔍 **ANALISADOR ATIVADO!**\n\nCole aqui:\n• Configurações do Zabbix\n• Templates\n• Scripts\n• Queries do Grafana\n\nVou analisar e dar feedback PRO! 💪\n\n📋 Cole o código! (ou **sair**)`;
    }

    if (msg === 'gerar' || msg === 'script') {
      setSuperMode('script-gen');
      return `🛠️ **GERADOR DE SCRIPTS ATIVADO!**\n\nDescreva o que precisa e eu crio!\n\nExemplo:\n"Script bash para verificar se serviço Nginx está rodando e reiniciar se necessário"\n\n💻 O que quer gerar? (ou **sair**)`;
    }

    if (msg === 'problema' || msg === 'bug' || msg === 'troubleshoot') {
      setSuperMode('troubleshoot');
      return `🐛 **TROUBLESHOOTER ATIVADO!**\n\nDescreva seu problema:\n• Sintomas\n• Logs (se tiver)\n• O que já tentou\n\nVou diagnosticar e resolver! 🔧\n\n📝 Qual o problema? (ou **sair**)`;
    }

    if (msg === 'simular' || msg === 'treino' || msg === 'cenario') {
      setSuperMode('simulator');
      return `🎮 **SIMULADOR ATIVADO!**\n\nVou criar cenários REAIS para você treinar!\n\nEscolha dificuldade:\n• **fácil** - Problemas básicos\n• **médio** - Desafios intermediários\n• **difícil** - Cenários avançados\n\n🎲 Qual dificuldade? (ou **sair**)`;
    }

    if (msg === 'arquitetar' || msg === 'infra' || msg === 'arquiteto') {
      setSuperMode('architect');
      return `🏗️ **ARQUITETO ATIVADO!**\n\nDescreva sua necessidade:\n• Quantos servidores\n• Tipos de dispositivos\n• Aplicações\n• Requisitos especiais\n\nVou desenhar a arquitetura completa! 📐\n\n📝 Descreva a infra! (ou **sair**)`;
    }

    if (msg === 'tutorial' || msg === 'aprender') {
      setSuperMode('tutorial-gen');
      return `📚 **GERADOR DE TUTORIAL ATIVADO!**\n\nSobre qual tópico quer um tutorial completo?\n\nExemplo:\n"Integração Zabbix + Grafana"\n"Monitoramento de MySQL"\n"Low-Level Discovery"\n\n📖 Qual tópico? (ou **sair**)`;
    }

    if (msg === 'progresso' || msg === 'status') {
      const sessionTime = Math.floor((Date.now() - sessionData.startTime) / 60000);
      return `📊 **STATUS COMPLETO:**\n\n🏆 **XP:** ${xp}\n🔥 **Streak:** ${streak} dias\n⏱️ **Tempo:** ${sessionTime}min\n💬 **Interações:** ${sessionData.interactions}\n🤖 **IA Calls:** ${sessionData.aiCallsUsed}\n\n🧠 **Estado:**\n• Foco: ${learningProfile.focusLevel}%\n• Energia: ${learningProfile.energy}%\n\nContinue assim! 💪`;
    }

    if (msg === 'perfil') {
      return `🧠 **SEU PERFIL:**\n\n👤 ${userName}\n📚 Estilo: ${learningProfile.style}\n🎭 Personalidade: ${learningProfile.personality}\n💪 Motivação: ${learningProfile.motivationType}\n⭐ Nível: ${userLevel}\n\nDigite **menu** para ver poderes! 🦸‍♂️`;
    }

    if (msg === 'dica') {
      const tips = [
        '💡 Use IA Chat para dúvidas rápidas!',
        '💡 Analisador detecta problemas que você não vê!',
        '💡 Simulador te prepara para cenários reais!',
        '💡 Gerador de scripts economiza HORAS!',
        '💡 Arquiteto ajuda a planejar antes de implementar!',
        '💡 Troubleshooter é como ter um senior ao seu lado!',
        '💡 Quanto mais usar, mais a IA aprende sobre você!'
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    return `😅 Não entendi!\n\nDigite **menu** para ver todos os super poderes! 🦸‍♂️`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isAiThinking) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await smartRespond(input);
    addBotMessage(response, 100);
  };

  const handleReset = () => {
    setMessages([]);
    setUserLevel(null);
    setCurrentTool(null);
    setConversationState('greeting');
    setXp(0);
    setStreak(1);
    setUserName('');
    setSuperMode(null);
    setConversationHistory([]);
    setLearningProfile({
      style: null,
      personality: null,
      focusLevel: 100,
      energy: 100,
      frustrationLevel: 0,
      successStreak: 0,
      preferredPace: 'medium',
      motivationType: null,
    });
    setSessionData({
      startTime: Date.now(),
      interactions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      pomodoroCount: 0,
      lastBreakTime: Date.now(),
      aiCallsUsed: 0,
    });
    addBotMessage(`🔄 **RESET!**\n\nQual seu nome? 😊`, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Super */}
        <div className="bg-slate-950/95 backdrop-blur-xl rounded-t-3xl p-6 border-b-2 border-purple-500/60 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-4 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                  ZabbiBot 3.0
                </h1>
                <p className="text-purple-300 font-bold">🦸‍♂️ Super IA Tutor</p>
                {userName && (
                  <p className="text-sm text-blue-300 flex items-center gap-2 mt-1">
                    {userName}
                    {superMode && (
                      <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-1 rounded-full animate-pulse">
                        {superMode === 'ai-chat' ? '🤖 IA Chat' :
                         superMode === 'code-analyzer' ? '🔍 Analisador' :
                         superMode === 'script-gen' ? '🛠️ Gerador' :
                         superMode === 'troubleshoot' ? '🐛 Troubleshoot' :
                         superMode === 'simulator' ? '🎮 Simulador' :
                         superMode === 'architect' ? '🏗️ Arquiteto' :
                         superMode === 'tutorial-gen' ? '📚 Tutorial' : ''}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-center bg-gradient-to-br from-yellow-900/50 to-orange-900/50 px-4 py-2 rounded-xl border border-yellow-500/50 backdrop-blur">
                <div className="flex items-center gap-2 text-yellow-300">
                  <Trophy className="w-5 h-5" />
                  <span className="font-black text-lg">{xp}</span>
                </div>
                <p className="text-xs text-gray-400">XP</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-purple-900/50 to-pink-900/50 px-4 py-2 rounded-xl border border-purple-500/50 backdrop-blur">
                <div className="flex items-center gap-2 text-purple-300">
                  <Zap className="w-5 h-5" />
                  <span className="font-black text-lg">{sessionData.aiCallsUsed}</span>
                </div>
                <p className="text-xs text-gray-400">IA Calls</p>
              </div>
              
              <button
                onClick={handleReset}
                className="p-3 bg-red-600/30 hover:bg-red-600/50 rounded-xl transition-all border border-red-500/50 group backdrop-blur"
              >
                <RotateCcw className="w-5 h-5 text-red-300 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-slate-950/80 backdrop-blur-md h-[550px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse" />
              <p>Inicializando Super IA...</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xl backdrop-blur ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white border border-purple-500/30'
                    : message.type === 'system'
                    ? message.systemType === 'success' 
                      ? 'bg-green-900/70 text-green-200 border border-green-500/50'
                      : 'bg-blue-900/70 text-blue-200 border border-blue-500/50'
                    : 'bg-slate-900/90 text-gray-100 border border-slate-700/50'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('```')) return null;
                    if (line.trim().startsWith('sudo ') || line.trim().startsWith('wget ') || line.trim().startsWith('#')) {
                      return (
                        <code key={i} className="block bg-black/70 p-2 rounded my-2 text-green-400 font-mono text-xs border border-green-800/40">
                          {line}
                        </code>
                      );
                    }
                    return <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">{line}</p>;
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isAiThinking && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 rounded-2xl p-4 border border-purple-500/50 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Brain className="w-5 h-5 text-purple-300" />
                  </div>
                  <p className="text-purple-200">IA pensando...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Super */}
        <div className="bg-slate-950/95 backdrop-blur-xl rounded-b-3xl p-5 border-t-2 border-purple-500/60 shadow-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isAiThinking ? "Aguarde a IA..." : "Digite sua mensagem..."}
              disabled={isAiThinking}
              className="flex-1 bg-slate-900/90 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-800/50 placeholder-gray-500 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isAiThinking}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-2xl px-8 py-4 flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/50 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
          
          {/* Super Actions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => setInput('menu')} className="text-xs bg-gradient-to-r from-purple-800/50 to-pink-800/50 hover:from-purple-700/50 hover:to-pink-700/50 text-purple-200 px-3 py-2 rounded-lg transition-all border border-purple-600/50 flex items-center gap-1">
              <Rocket className="w-3 h-3" /> Menu
            </button>
            <button onClick={() => setInput('ia')} className="text-xs bg-gradient-to-r from-blue-800/50 to-cyan-800/50 hover:from-blue-700/50 hover:to-cyan-700/50 text-blue-200 px-3 py-2 rounded-lg transition-all border border-blue-600/50 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> IA Chat
            </button>
            <button onClick={() => setInput('analisar')} className="text-xs bg-gradient-to-r from-green-800/50 to-emerald-800/50 hover:from-green-700/50 hover:to-emerald-700/50 text-green-200 px-3 py-2 rounded-lg transition-all border border-green-600/50 flex items-center gap-1">
              <Search className="w-3 h-3" /> Analisar
            </button>
            <button onClick={() => setInput('gerar')} className="text-xs bg-gradient-to-r from-orange-800/50 to-red-800/50 hover:from-orange-700/50 hover:to-red-700/50 text-orange-200 px-3 py-2 rounded-lg transition-all border border-orange-600/50 flex items-center gap-1">
              <Code className="w-3 h-3" /> Gerar
            </button>
            <button onClick={() => setInput('simular')} className="text-xs bg-gradient-to-r from-pink-800/50 to-rose-800/50 hover:from-pink-700/50 hover:to-rose-700/50 text-pink-200 px-3 py-2 rounded-lg transition-all border border-pink-600/50 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Simular
            </button>
            <button onClick={() => setInput('progresso')} className="text-xs bg-gradient-to-r from-indigo-800/50 to-purple-800/50 hover:from-indigo-700/50 hover:to-purple-700/50 text-indigo-200 px-3 py-2 rounded-lg transition-all border border-indigo-600/50 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZabbiBotTutor;