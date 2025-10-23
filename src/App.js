import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, RotateCcw, Trophy, Zap, Sparkles, Code, Search, Rocket, Wand2, TrendingUp, Lightbulb, Award, MessageSquare, Activity, Settings, Key, CheckCircle, XCircle } from 'lucide-react';

const ZabbiBotTutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationState, setConversationState] = useState('greeting');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [userName, setUserName] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '');
  const [apiMode, setApiMode] = useState(localStorage.getItem('groq_api_key') ? 'ai' : 'embedded');
  
  const [superMode, setSuperMode] = useState(null);
  
  const [learningProfile, setLearningProfile] = useState({
    style: null,
    personality: null,
    focusLevel: 100,
    energy: 100,
    motivationType: null,
  });
  
  const [sessionData, setSessionData] = useState({
    startTime: Date.now(),
    interactions: 0,
    aiCallsUsed: 0,
  });

  const [conversationHistory, setConversationHistory] = useState([]);
  const [userLevel, setUserLevel] = useState(null);
  const messagesEndRef = useRef(null);

  // Base de conhecimento embutida
  const knowledgeBase = {
    zabbix: {
      definicao: "Zabbix é uma solução OPEN SOURCE de monitoramento empresarial para redes e aplicações. Monitora servidores, VMs, redes, cloud e serviços. Coleta métricas, detecta problemas e alerta equipes em tempo real!",
      conceitos: {
        host: "HOST é qualquer dispositivo/sistema que você quer monitorar. Pode ser: servidor Linux/Windows, switch, roteador, impressora, container Docker, VM, até IoT! É o 'QUEM' você monitora.",
        item: "ITEM é a métrica específica que você coleta de um host. Exemplos: CPU usage, RAM livre, espaço em disco, temperatura, latência de rede. É o 'O QUÊ' você quer saber.",
        trigger: "TRIGGER é a condição que define quando alertar. Exemplo: 'Se CPU > 90% por 5 minutos, ALERTA!'. É o 'QUANDO' você deve se preocupar.",
        action: "ACTION é o que fazer quando trigger dispara. Pode enviar email, SMS, executar script, reiniciar serviço. É o 'O QUE FAZER' quando há problema.",
        template: "TEMPLATE é um conjunto reutilizável de items, triggers e graphs. Crie uma vez, aplique em vários hosts! É como receita de bolo - use quantas vezes quiser!"
      },
      instalacao: "1) Atualize sistema: sudo apt update && sudo apt upgrade -y\n2) Adicione repo Zabbix: wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb && sudo dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb\n3) Instale: sudo apt update && sudo apt install zabbix-server-mysql zabbix-frontend-php zabbix-agent\n4) Configure database e inicie!",
      troubleshooting: {
        "cpu alta": "1) Verifique processos: top ou htop\n2) Identifique processo problemático\n3) Analise logs do processo\n4) Considere: restart, otimização, ou upgrade de hardware\n5) Configure trigger no Zabbix para alertar antes de 100%",
        "agente offline": "1) Verifique se serviço está rodando: systemctl status zabbix-agent\n2) Teste conectividade: telnet <server> 10050\n3) Verifique firewall: sudo ufw status\n4) Confira logs: tail -f /var/log/zabbix/zabbix_agentd.log\n5) Valide config: /etc/zabbix/zabbix_agentd.conf",
        "dados não coletam": "1) Verifique se item está habilitado\n2) Confirme que host está ativo\n3) Teste item manualmente: zabbix_get -s <host> -k <key>\n4) Verifique permissões\n5) Analise logs do servidor"
      }
    },
    grafana: {
      definicao: "Grafana é uma plataforma OPEN SOURCE de analytics e visualização. Transforma dados brutos em dashboards LINDOS e interativos! Conecta com Zabbix, Prometheus, MySQL, PostgreSQL e 100+ datasources!",
      conceitos: {
        dashboard: "DASHBOARD é uma coleção de painéis (panels) que exibem dados visualmente. É seu 'centro de comando' com gráficos, tabelas, gauges mostrando métricas em tempo real!",
        panel: "PANEL é um componente individual do dashboard. Pode ser: gráfico de linha, gauge, stat, tabela, heatmap. Cada panel mostra uma métrica específica.",
        datasource: "DATASOURCE é a origem dos dados. Pode ser: Zabbix, Prometheus, MySQL, InfluxDB, Elasticsearch. Grafana busca dados de lá e exibe nos dashboards.",
        query: "QUERY é a pergunta que você faz ao datasource. Exemplo: 'Me dê CPU dos últimos 30 minutos' ou 'Mostre requests/segundo agora'. Usa linguagem específica do datasource.",
        variable: "VARIABLE deixa dashboard dinâmico! Em vez de criar dashboard para cada servidor, crie UMA variável $servidor e selecione qual ver. Reutilização máxima!"
      },
      instalacao: "1) Adicione repo: sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key\n2) Echo repo: echo 'deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main' | sudo tee /etc/apt/sources.list.d/grafana.list\n3) Instale: sudo apt update && sudo apt install grafana\n4) Inicie: sudo systemctl start grafana-server\n5) Acesse: http://localhost:3000 (user: admin, pass: admin)"
    }
  };

  const scriptTemplates = {
    "monitor docker": `#!/bin/bash
# Monitor Docker Containers
# Autor: ZabbiBot 3.0

# Verifica se Docker está rodando
if ! systemctl is-active --quiet docker; then
    echo "Docker não está rodando!"
    exit 1
fi

# Lista containers e status
echo "=== CONTAINERS ATIVOS ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.CPUPerc}}\t{{.MemPerc}}"

# Alerta se algum container parou
STOPPED=$(docker ps -a --filter "status=exited" --format "{{.Names}}")
if [ ! -z "$STOPPED" ]; then
    echo "⚠️  ALERTA: Containers parados: $STOPPED"
fi`,
    
    "check nginx": `#!/bin/bash
# Verifica e reinicia Nginx se necessário
# Autor: ZabbiBot 3.0

SERVICE="nginx"
if systemctl is-active --quiet $SERVICE; then
    echo "✅ $SERVICE está rodando"
    # Testa config
    nginx -t 2>&1
else
    echo "❌ $SERVICE parado! Reiniciando..."
    systemctl start $SERVICE
    if systemctl is-active --quiet $SERVICE; then
        echo "✅ $SERVICE reiniciado com sucesso!"
    else
        echo "🚨 FALHA ao reiniciar $SERVICE!"
        exit 1
    fi
fi`,

    "disk space alert": `#!/bin/bash
# Alerta de espaço em disco
# Autor: ZabbiBot 3.0

THRESHOLD=80

df -H | grep -vE '^Filesystem|tmpfs|cdrom' | awk '{ print $5 " " $1 }' | while read output;
do
  usage=$(echo $output | awk '{ print $1}' | cut -d'%' -f1)
  partition=$(echo $output | awk '{ print $2 }')
  
  if [ $usage -ge $THRESHOLD ]; then
    echo "🚨 ALERTA: Partição $partition está em ${usage}%!"
  else
    echo "✅ $partition: ${usage}% (OK)"
  fi
done`
  };

  useEffect(() => {
    addBotMessage(`🦸‍♂️ **ZabbiBot 3.0 - Sistema Híbrido**

${apiMode === 'ai' ? '🤖 **MODO IA ATIVADO!**' : '🧠 **MODO INTELIGENTE EMBUTIDO**'}

Eu tenho:
${apiMode === 'ai' ? '✅ IA Real conectada (Groq)' : '✅ Base de conhecimento completa'}
✅ Análise de código
✅ Gerador de scripts
✅ Troubleshooting
✅ Simulador de cenários
✅ Tutoriais interativos

${apiMode === 'embedded' ? '💡 **Dica:** Quer respostas ainda melhores? Configure sua API key gratuita no ícone ⚙️!' : ''}

**Qual seu nome?** 😊`, 0);
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
    addSystemMessage(`✨ +${amount} XP ${reason ? `- ${reason}` : ''}! 🔥`, 'success');
  };

  // Sistema híbrido de resposta
  const getSmartResponse = async (userQuestion, context = '') => {
    // Se tem API key, usa IA
    if (apiMode === 'ai' && apiKey) {
      return await callGroqAPI(userQuestion, context);
    }
    
    // Senão, usa sistema embutido inteligente
    return getEmbeddedResponse(userQuestion, context);
  };

  // IA Real com Groq API (gratuita e sem CORS!)
  const callGroqAPI = async (userQuestion, context = '') => {
    setIsAiThinking(true);
    setSessionData(prev => ({ ...prev, aiCallsUsed: prev.aiCallsUsed + 1 }));
    
    try {
      const systemPrompt = `Você é o ZabbiBot 3.0, tutor especialista em Zabbix e Grafana.

Perfil do aluno:
- Nome: ${userName}
- Nível: ${userLevel}
- Estilo: ${learningProfile.style}
- Personalidade: ${learningProfile.personality}

Seja divertido, use emojis, explique claramente e motive o aluno!`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: userQuestion }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: userQuestion },
        { role: "assistant", content: aiResponse }
      ]);
      
      setIsAiThinking(false);
      return aiResponse;
      
    } catch (error) {
      setIsAiThinking(false);
      return `❌ Erro na API: ${error.message}\n\n💡 Verifique sua API key ou use modo embutido!\n\n(Clique em ⚙️ para configurar)`;
    }
  };

  // Sistema inteligente embutido
  const getEmbeddedResponse = (userQuestion, context = '') => {
    const q = userQuestion.toLowerCase();
    
    // Detecção inteligente de tópicos
    if (q.includes('zabbix') && (q.includes('o que') || q.includes('oque') || q.includes('que é') || q.includes('define'))) {
      return `🔵 **O QUE É ZABBIX?**\n\n${knowledgeBase.zabbix.definicao}\n\n**Por que usar?**\n✅ Open source e gratuito\n✅ Monitora TUDO\n✅ Escalável (10 a 100.000+ devices)\n✅ Interface web intuitiva\n✅ Alertas inteligentes\n\n**Quer saber mais?** Pergunte sobre: host, item, trigger, action, template!`;
    }
    
    if (q.includes('grafana') && (q.includes('o que') || q.includes('oque') || q.includes('que é') || q.includes('define'))) {
      return `🟣 **O QUE É GRAFANA?**\n\n${knowledgeBase.grafana.definicao}\n\n**Por que usar?**\n✅ Dashboards LINDOS\n✅ 100+ datasources\n✅ Alerting integrado\n✅ Mobile-friendly\n✅ Plugins customizados\n\n**Quer saber mais?** Pergunte sobre: dashboard, panel, query, variable!`;
    }
    
    // Conceitos
    if (q.includes('host')) {
      return `🖥️ **HOST NO ZABBIX:**\n\n${knowledgeBase.zabbix.conceitos.host}\n\n**Exemplos práticos:**\n• Web-Server-01 (Linux)\n• DB-Prod-MySQL (banco)\n• Switch-Core-01 (rede)\n• Docker-Host (containers)\n\n**Analogia:** Host é como contato na agenda - você precisa "cadastrar" quem vai monitorar!`;
    }
    
    if (q.includes('item')) {
      return `📊 **ITEM NO ZABBIX:**\n\n${knowledgeBase.zabbix.conceitos.item}\n\n**Exemplos de keys:**\n• system.cpu.util - CPU usage\n• vm.memory.size[available] - RAM livre\n• vfs.fs.size[/,used] - Disco usado\n• net.if.in[eth0] - Tráfego entrada\n\n**Dica:** Items são coletados periodicamente (ex: a cada 60 segundos)!`;
    }
    
    if (q.includes('trigger')) {
      return `🚨 **TRIGGER NO ZABBIX:**\n\n${knowledgeBase.zabbix.conceitos.trigger}\n\n**Exemplo prático:**\n\`\`\`\n{Host:system.cpu.util.avg(5m)}>90\n\`\`\`\nLê-se: "Se CPU média dos últimos 5min > 90%"\n\n**Severidades:**\n🔵 Not classified\n🟢 Information\n🟡 Warning\n🟠 Average\n🔴 High\n🔥 Disaster`;
    }
    
    if (q.includes('action')) {
      return `📧 **ACTION NO ZABBIX:**\n\n${knowledgeBase.zabbix.conceitos.action}\n\n**Tipos de ação:**\n1. **Send message** - Email/SMS\n2. **Remote command** - Executa script\n3. **Add/Remove host** - Automação\n\n**Exemplo:**\nTrigger: "Nginx down"\nAction: Email + restart nginx remotamente!\n\n**Dica:** Configure escalations para alertas críticos!`;
    }
    
    if (q.includes('template')) {
      return `📋 **TEMPLATE NO ZABBIX:**\n\n${knowledgeBase.zabbix.conceitos.template}\n\n**Templates populares:**\n• Linux by Zabbix agent\n• Windows by Zabbix agent\n• MySQL by Zabbix agent\n• Docker by Zabbix agent\n• Nginx by HTTP\n\n**Como usar:**\n1. Crie/Importe template\n2. Aplique em hosts\n3. Personalize se necessário\n\n**Pro tip:** Templates community no Zabbix Share!`;
    }
    
    if (q.includes('dashboard') && q.includes('grafana')) {
      return `📊 **DASHBOARD NO GRAFANA:**\n\n${knowledgeBase.grafana.conceitos.dashboard}\n\n**Boas práticas:**\n✅ Organize por função (Overview, Details, Troubleshoot)\n✅ Use cores consistentes\n✅ Menos é mais (4-8 panels ideal)\n✅ Conte uma história com os dados\n✅ Mobile-first thinking\n\n**Templates prontos:** grafana.com/dashboards`;
    }
    
    // Instalação
    if ((q.includes('instalar') || q.includes('instalação') || q.includes('install')) && q.includes('zabbix')) {
      return `⚡ **INSTALAÇÃO ZABBIX (Ubuntu):**\n\n${knowledgeBase.zabbix.instalacao}\n\n**Pós-instalação:**\n5) Acesse: http://seu-ip/zabbix\n6) Configure database\n7) Login: Admin / zabbix\n8) MUDE A SENHA!\n\n**Dica:** Use Docker para testes: docker run --name zabbix zabbix/zabbix-server-mysql`;
    }
    
    if ((q.includes('instalar') || q.includes('instalação') || q.includes('install')) && q.includes('grafana')) {
      return `📊 **INSTALAÇÃO GRAFANA:**\n\n${knowledgeBase.grafana.instalacao}\n\n**Próximos passos:**\n1. Adicione Zabbix como datasource\n2. Importe dashboard\n3. Configure alertas\n4. Customize!\n\n**Plugin Zabbix:**\ngrafana-cli plugins install alexanderzobnin-zabbix-app`;
    }
    
    // Troubleshooting
    if (q.includes('cpu') && (q.includes('alta') || q.includes('alto') || q.includes('100'))) {
      return `🔧 **TROUBLESHOOT: CPU ALTA**\n\n${knowledgeBase.zabbix.troubleshooting["cpu alta"]}\n\n**Comandos úteis:**\n\`\`\`bash\ntop -o %CPU\nps aux --sort=-%cpu | head\n\`\`\`\n\n**Prevenção:**\n• Configure trigger para 80% (warning)\n• Configure trigger para 95% (critical)\n• Use gráficos para ver tendência`;
    }
    
    if (q.includes('agente') && (q.includes('offline') || q.includes('down') || q.includes('não conecta'))) {
      return `🔧 **TROUBLESHOOT: AGENTE OFFLINE**\n\n${knowledgeBase.zabbix.troubleshooting["agente offline"]}\n\n**Checklist rápido:**\n☐ Serviço rodando?\n☐ Porta 10050 aberta?\n☐ Server configurado no agentd.conf?\n☐ Firewall liberado?\n☐ Hostname correto?\n\n**Teste final:**\ntelnet <zabbix-server> 10050`;
    }
    
    // Respostas genéricas inteligentes
    if (q.includes('diferença') || q.includes('diferenca')) {
      if (q.includes('zabbix') && q.includes('grafana')) {
        return `🆚 **ZABBIX vs GRAFANA:**\n\n**ZABBIX:**\n✅ Coleta dados\n✅ Detecta problemas\n✅ Alerta equipes\n✅ Solução completa\n\n**GRAFANA:**\n✅ Visualiza dados\n✅ Dashboards bonitos\n✅ Multi-datasource\n✅ Especialista em viz\n\n**JUNTOS:** Zabbix coleta, Grafana visualiza = ❤️ COMBO PERFEITO!`;
      }
    }
    
    if (q.includes('como') && q.includes('começar')) {
      return `🚀 **COMO COMEÇAR:**\n\n**Passo 1:** Instale Zabbix Server\n**Passo 2:** Instale Zabbix Agent nos hosts\n**Passo 3:** Configure primeiro host\n**Passo 4:** Aplique template\n**Passo 5:** Crie dashboards no Grafana\n\n**Tempo:** 1-2 horas para setup básico\n\n**Quer tutorial passo a passo?** Digite: **tutorial instalação**`;
    }
    
    // Se não encontrou resposta específica
    return `🤔 Interessante! Sobre esse tópico específico, posso te ajudar de outras formas:\n\n• Digite **menu** para ver super poderes\n• Digite **tutorial [tópico]** para aprender\n• Digite **exemplo [conceito]** para ver prática\n\n${apiMode === 'embedded' ? '💡 **Quer respostas mais personalizadas?** Configure API key gratuita no ⚙️!' : ''}\n\nOu reformule sua pergunta! 😊`;
  };

  // Gerador de scripts
  const generateScript = (description) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('docker')) {
      return `🛠️ **SCRIPT: MONITOR DOCKER**\n\n${scriptTemplates["monitor docker"]}\n\n**Como usar:**\n1. Salve como monitor_docker.sh\n2. chmod +x monitor_docker.sh\n3. Execute: ./monitor_docker.sh\n4. Agende no cron se quiser!\n\n**Integração Zabbix:**\nUserParameter=docker.check,/path/to/monitor_docker.sh`;
    }
    
    if (desc.includes('nginx')) {
      return `🛠️ **SCRIPT: CHECK NGINX**\n\n${scriptTemplates["check nginx"]}\n\n**Como usar:**\n1. Salve como check_nginx.sh\n2. chmod +x check_nginx.sh\n3. Execute: ./check_nginx.sh\n\n**Auto-healing!** Script reinicia automaticamente se serviço cair!`;
    }
    
    if (desc.includes('disco') || desc.includes('disk')) {
      return `🛠️ **SCRIPT: ALERTA DISCO**\n\n${scriptTemplates["disk space alert"]}\n\n**Customização:**\n• Mude THRESHOLD=80 para seu limite\n• Adicione notificação (email, Slack)\n• Agende no cron: */5 * * * *\n\n**Integração Zabbix:**\nUserParameter=disk.check,/path/to/disk_alert.sh`;
    }
    
    return `🛠️ **TEMPLATE DE SCRIPT PERSONALIZADO**\n\n\`\`\`bash\n#!/bin/bash\n# ${description}\n# Autor: ${userName}\n\n# Seu código aqui\necho "Script para: ${description}"\n\n# Adicione lógica\n# Adicione alertas\n# Adicione logs\n\`\`\`\n\n**Próximos passos:**\n1. Implemente lógica específica\n2. Teste em ambiente dev\n3. Adicione error handling\n4. Documente!\n\n**Precisa de ajuda?** Seja mais específico sobre o que quer fazer!`;
  };

  // Analisador de código
  const analyzeCode = (code) => {
    let analysis = '🔍 **ANÁLISE DE CÓDIGO:**\n\n';
    
    // Análise básica por padrões
    if (code.includes('sudo rm -rf')) {
      analysis += '🚨 **PERIGO:** Comando destrutivo detectado!\n';
    }
    
    if (!code.includes('#!/bin/bash') && !code.includes('#!/usr/bin/env')) {
      analysis += '⚠️ **Falta shebang:** Adicione #!/bin/bash no início\n';
    }
    
    if (!code.includes('set -e') && !code.includes('set -eu')) {
      analysis += '💡 **Sugestão:** Adicione `set -e` para parar em erros\n';
    }
    
    if (code.split('\n').filter(l => l.trim().startsWith('#')).length < 3) {
      analysis += '📝 **Documentação:** Adicione mais comentários\n';
    }
    
    if (code.includes('password') || code.includes('apikey')) {
      analysis += '🔒 **SEGURANÇA:** Não hardcode senhas! Use variáveis de ambiente\n';
    }
    
    analysis += '\n✅ **Boas práticas:**\n';
    analysis += '• Use variáveis para valores repetidos\n';
    analysis += '• Adicione validação de entrada\n';
    analysis += '• Implemente logging\n';
    analysis += '• Teste em ambiente dev primeiro\n';
    
    return analysis;
  };

  const profileQuestions = {
    learning_style: {
      question: `**Como você aprende melhor?**\n\nA) 📊 Visual (gráficos)\nB) 🎧 Auditivo (explicações)\nC) 📝 Leitura (textos)\nD) 🛠️ Prático (mão na massa)`,
      profiles: { A: 'visual', B: 'auditivo', C: 'reading', D: 'kinesthetic' }
    },
    personality: {
      question: `**Seu estilo:**\n\nA) 🗺️ Explorador\nB) 📋 Estrategista\nC) ⚡ Pragmático\nD) 👥 Social`,
      profiles: { A: 'explorador', B: 'estrategista', C: 'pragmatico', D: 'social' }
    },
    motivation: {
      question: `**O que te motiva?**\n\nA) 🏆 Conquistar\nB) 🎓 Dominar\nC) 🔓 Criar\nD) 🌟 Ajudar`,
      profiles: { A: 'achievement', B: 'mastery', C: 'autonomy', D: 'purpose' }
    }
  };

  const smartRespond = async (userMsg) => {
    const msg = userMsg.toLowerCase().trim();
    setSessionData(prev => ({ ...prev, interactions: prev.interactions + 1 }));

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
        addXP(15, 'Perfil');
        return profileQuestions.personality.question;
      }
      return 'Digite **A**, **B**, **C** ou **D**! 😊';
    }

    if (conversationState === 'profiling_personality') {
      const answer = msg.toUpperCase().replace(/[^ABCD]/g, '');
      if (['A', 'B', 'C', 'D'].includes(answer)) {
        setLearningProfile(prev => ({ ...prev, personality: profileQuestions.personality.profiles[answer] }));
        setConversationState('profiling_motivation');
        addXP(15, 'Personalidade');
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
        return `🎉 **PERFIL COMPLETO!**\n\nSeu nível?\n\n🌱 **1** - Iniciante\n🌿 **2** - Básico\n🌳 **3** - Intermediário\n🚀 **4** - Avançado`;
      }
      return 'Digite **A**, **B**, **C** ou **D**! 😊';
    }

    if (conversationState === 'choosing_level') {
      if (['1', '2', '3', '4'].includes(msg)) {
        const levels = { '1': 'iniciante', '2': 'basico', '3': 'intermediario', '4': 'avancado' };
        setUserLevel(levels[msg]);
        setConversationState('super_menu');
        addXP(30, 'Pronto!');
        return `✨ **CONFIGURADO, ${userName}!**\n\nDigite **menu** para ver opções!`;
      }
      return 'Digite **1**, **2**, **3** ou **4**! 😊';
    }

    // Super modos
    if (superMode === 'ai-chat') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Voltando! Digite **menu**! 🎯';
      }
      
      const response = await getSmartResponse(userMsg, 'Chat livre');
      addXP(10, 'Chat');
      return `${apiMode === 'ai' ? '🤖' : '🧠'} **Resposta:**\n\n${response}\n\n💬 Continue ou **sair**!`;
    }

    if (superMode === 'code-analyzer') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo! Digite **menu**! 🎯';
      }
      
      if (msg.length < 20) {
        return '📋 Cole seu código/config aqui!\n\nOu **sair** para voltar.';
      }
      
      const analysis = analyzeCode(userMsg);
      addXP(30, 'Análise');
      return `${analysis}\n\n📋 Outro código ou **sair**!`;
    }

    if (superMode === 'script-gen') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo! Digite **menu**! 🎯';
      }
      
      if (msg.length < 10) {
        return '💡 Descreva o que precisa!\n\nExemplo: "monitorar docker"\n\n**sair** para voltar.';
      }
      
      const script = generateScript(userMsg);
      addXP(50, 'Script');
      return `${script}\n\n💻 Outro ou **sair**!`;
    }

    if (superMode === 'troubleshoot') {
      if (msg === 'sair' || msg === 'voltar') {
        setSuperMode(null);
        return '👍 Saindo! Digite **menu**! 🎯';
      }
      
      const solution = await getSmartResponse(userMsg, 'Troubleshooting');
      addXP(40, 'Problema resolvido');
      return `🐛 **SOLUÇÃO:**\n\n${solution}\n\n🔧 Outro ou **sair**!`;
    }

    // Menu
    if (msg === 'menu' || msg === 'ajuda' || msg === 'help') {
      return `🦸‍♂️ **SUPER PODERES:**\n\n**1️⃣ CHAT ${apiMode === 'ai' ? '🤖' : '🧠'}**\n   Comando: **chat** ou **ia**\n\n**2️⃣ ANALISADOR 🔍**\n   Comando: **analisar**\n\n**3️⃣ GERADOR 🛠️**\n   Comando: **gerar**\n\n**4️⃣ TROUBLESHOOT 🐛**\n   Comando: **problema**\n\n**Outros:**\n• **progresso** - Ver status\n• **config** - Configurar API\n\n${apiMode === 'embedded' ? '💡 Configure API key (gratuita!) para respostas IA reais!' : '✅ IA ativada!'}`;
    }

    // Ativar modos
    if (msg === 'ia' || msg === 'chat') {
      setSuperMode('ai-chat');
      return `${apiMode === 'ai' ? '🤖 **IA REAL' : '🧠 **SISTEMA INTELIGENTE'} ATIVADO!**\n\nPergunte sobre Zabbix, Grafana, etc!\n\n💬 Sua pergunta! (**sair** para voltar)`;
    }

    if (msg === 'analisar' || msg === 'analise') {
      setSuperMode('code-analyzer');
      return `🔍 **ANALISADOR ATIVADO!**\n\nCole código/config do Zabbix/Grafana!\n\n📋 Cole aqui! (**sair**)`;
    }

    if (msg === 'gerar' || msg === 'script') {
      setSuperMode('script-gen');
      return `🛠️ **GERADOR ATIVADO!**\n\nDescreva o que precisa!\n\nExemplo: "monitorar nginx"\n\n💻 Descreva! (**sair**)`;
    }

    if (msg === 'problema' || msg === 'bug' || msg === 'troubleshoot') {
      setSuperMode('troubleshoot');
      return `🐛 **TROUBLESHOOTER ATIVADO!**\n\nDescreva seu problema!\n\n📝 Qual problema? (**sair**)`;
    }

    if (msg === 'config' || msg === 'configurar' || msg === 'api') {
      setShowApiConfig(true);
      return `⚙️ **CONFIGURAÇÃO DE API**\n\nAbri o painel de configuração! Configure sua API key Groq gratuita para respostas IA reais!\n\n**Como obter:**\n1. Acesse: https://console.groq.com\n2. Crie conta grátis\n3. Gere API key\n4. Cole aqui!\n\nDigite **fechar** para voltar.`;
    }

    if (msg === 'fechar') {
      setShowApiConfig(false);
      return 'Configuração fechada! Digite **menu**! 🎯';
    }

    if (msg === 'progresso') {
      return `📊 **STATUS:**\n\n🏆 XP: ${xp}\n🔥 Streak: ${streak}\n💬 Interações: ${sessionData.interactions}\n${apiMode === 'ai' ? `🤖 IA Calls: ${sessionData.aiCallsUsed}` : '🧠 Modo: Embutido'}\n\nContinue! 💪`;
    }

    return `😅 Não entendi!\n\nDigite **menu** para opções! 🦸‍♂️`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isAiThinking) return;

    const userMessage = { type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await smartRespond(input);
    addBotMessage(response, 100);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey);
      setApiMode('ai');
      setShowApiConfig(false);
      addSystemMessage('✅ API Key salva! Modo IA ativado! 🤖', 'success');
    }
  };

  const removeApiKey = () => {
    localStorage.removeItem('groq_api_key');
    setApiKey('');
    setApiMode('embedded');
    setShowApiConfig(false);
    addSystemMessage('🧠 Voltando para modo embutido!', 'info');
  };

  const handleReset = () => {
    setMessages([]);
    setConversationState('greeting');
    setXp(0);
    setUserName('');
    setSuperMode(null);
    setConversationHistory([]);
    addBotMessage(`🔄 **RESET!**\n\nQual seu nome? 😊`, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
                <p className="text-purple-300 font-bold flex items-center gap-2">
                  {apiMode === 'ai' ? '🤖 Modo IA' : '🧠 Modo Embutido'}
                  {userName && <span className="text-sm">• {userName}</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-center bg-gradient-to-br from-yellow-900/50 to-orange-900/50 px-4 py-2 rounded-xl border border-yellow-500/50">
                <div className="flex items-center gap-2 text-yellow-300">
                  <Trophy className="w-5 h-5" />
                  <span className="font-black text-lg">{xp}</span>
                </div>
                <p className="text-xs text-gray-400">XP</p>
              </div>
              
              <button
                onClick={() => setShowApiConfig(!showApiConfig)}
                className="p-3 bg-blue-600/30 hover:bg-blue-600/50 rounded-xl transition-all border border-blue-500/50"
                title="Configurações"
              >
                <Settings className="w-5 h-5 text-blue-300" />
              </button>
              
              <button
                onClick={handleReset}
                className="p-3 bg-red-600/30 hover:bg-red-600/50 rounded-xl transition-all border border-red-500/50"
              >
                <RotateCcw className="w-5 h-5 text-red-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Config Panel */}
        {showApiConfig && (
          <div className="bg-slate-900/95 backdrop-blur-xl p-6 border-b-2 border-blue-500/60">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-6 h-6 text-blue-400" />
              Configuração API (Opcional)
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Configure uma API key Groq <strong>GRATUITA</strong> para respostas IA reais!<br/>
              Sem API: Sistema embutido funciona perfeitamente! ✅
            </p>
            <div className="flex gap-3 mb-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API key Groq aqui..."
                className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700"
              />
              <button
                onClick={saveApiKey}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Salvar
              </button>
              {apiMode === 'ai' && (
                <button
                  onClick={removeApiKey}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Remover
                </button>
              )}
            </div>
            <a 
              href="https://console.groq.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              🔗 Obter API key gratuita no Groq →
            </a>
          </div>
        )}

        {/* Chat */}
        <div className="bg-slate-950/80 h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white'
                    : message.type === 'system'
                    ? message.systemType === 'success' 
                      ? 'bg-green-900/70 text-green-200 border border-green-500/50'
                      : 'bg-blue-900/70 text-blue-200 border border-blue-500/50'
                    : 'bg-slate-900/90 text-gray-100 border border-slate-700/50'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {message.content}
                </div>
                <p className="text-xs text-gray-500 mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isAiThinking && (
            <div className="flex justify-start">
              <div className="bg-purple-900/80 rounded-2xl p-4 border border-purple-500/50">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Brain className="w-5 h-5 text-purple-300" />
                  </div>
                  <p className="text-purple-200">Pensando...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-slate-950/95 rounded-b-3xl p-5 border-t-2 border-purple-500/60">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              disabled={isAiThinking}
              className="flex-1 bg-slate-900/90 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-800/50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isAiThinking}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl px-8 py-4 flex items-center gap-2 font-bold disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => setInput('menu')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <Rocket className="w-3 h-3 inline mr-1" /> Menu
            </button>
            <button onClick={() => setInput('chat')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <MessageSquare className="w-3 h-3 inline mr-1" /> Chat
            </button>
            <button onClick={() => setInput('analisar')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <Search className="w-3 h-3 inline mr-1" /> Analisar
            </button>
            <button onClick={() => setInput('gerar')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <Code className="w-3 h-3 inline mr-1" /> Gerar
            </button>
            <button onClick={() => setInput('progresso')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <TrendingUp className="w-3 h-3 inline mr-1" /> Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZabbiBotTutor;