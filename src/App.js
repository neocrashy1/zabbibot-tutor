import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, RotateCcw, Trophy, Sparkles, Rocket, MessageSquare, TrendingUp } from 'lucide-react';

const ZabbiBotTutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationState, setConversationState] = useState('greeting');
  const [xp, setXp] = useState(0);
  const [userName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    addBotMessage(`🦸‍♂️ **ZabbiBot 3.0 - Tutor Especialista**

Olá! Sou especialista em Zabbix e Grafana!

Posso te ajudar com:
✅ Conceitos e definições
✅ Instalação e configuração
✅ Troubleshooting
✅ Tutoriais práticos
✅ Dicas e boas práticas

**Qual seu nome?** 😊`, 0);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (content, delay = 500) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content,
        timestamp: new Date()
      }]);
    }, delay);
  };

  const addSystemMessage = (content, type = 'success') => {
    setMessages(prev => [...prev, {
      type: 'system',
      content,
      timestamp: new Date(),
      systemType: type
    }]);
  };

  const addXP = (amount) => {
    setXp(prev => prev + amount);
    addSystemMessage(`✨ +${amount} XP!`);
  };

  // Base de conhecimento COMPLETA
  const getAnswer = (question) => {
    const q = question.toLowerCase();
    
    // ZABBIX - O que é
    if ((q.includes('zabbix') || q.includes('o que') || q.includes('que é')) && 
        (q.includes('zabbix') || q.includes('define') || q.includes('explica'))) {
      return `🔵 **O QUE É ZABBIX?**

Zabbix é uma **solução OPEN SOURCE** de monitoramento empresarial de classe mundial! 🌟

**O que faz:**
• 📊 Monitora TUDO: servidores, redes, aplicações, cloud, IoT
• 🔍 Coleta métricas em tempo real
• 🚨 Detecta problemas automaticamente  
• 📧 Alerta equipes via email, SMS, Slack, etc
• 📈 Gera relatórios e dashboards

**Por que usar?**
✅ 100% gratuito e open source
✅ Escala de 10 a 100.000+ devices
✅ Interface web intuitiva
✅ Comunidade gigante
✅ Plugins e integrações

**Usado por:** NASA, Dell, Sony, BMW, Siemens

**Quer aprender mais?** 
Digite: "conceitos zabbix" ou "como instalar zabbix"`;
    }

    // GRAFANA - O que é
    if ((q.includes('grafana') || q.includes('o que') || q.includes('que é')) && 
        (q.includes('grafana') || q.includes('define'))) {
      return `🟣 **O QUE É GRAFANA?**

Grafana é a **plataforma OPEN SOURCE líder** em visualização de dados! 📊✨

**O que faz:**
• 🎨 Cria dashboards LINDOS e interativos
• 🔌 Conecta com 100+ datasources
• 📱 Responsive (funciona no celular!)
• 🔔 Sistema de alertas integrado
• 🎯 Queries poderosas

**Datasources suportados:**
✅ Zabbix (nosso favorito!)
✅ Prometheus
✅ MySQL / PostgreSQL
✅ InfluxDB, Elasticsearch
✅ E muito mais!

**Por que usar?**
✅ Dashboards profissionais
✅ Grátis e open source
✅ Usado por Netflix, eBay, Paypal
✅ Plugins customizáveis

**Combo perfeito:** Zabbix (coleta) + Grafana (visualiza) = ❤️

Digite: "conceitos grafana" ou "como instalar grafana"`;
    }

    // HOST
    if (q.includes('host') && (q.includes('o que') || q.includes('que é') || q.includes('explica'))) {
      return `🖥️ **HOST NO ZABBIX**

HOST é qualquer **dispositivo ou sistema** que você quer monitorar!

**Pode ser:**
• 💻 Servidores (Linux, Windows, Unix)
• 🌐 Switches e roteadores
• 🖨️ Impressoras e scanners
• 🐳 Containers Docker
• ☁️ VMs na cloud (AWS, Azure, GCP)
• 📱 Dispositivos IoT
• 🔥 Firewalls e appliances

**Na prática:**
HOST = "QUEM" você vai monitorar

**Exemplo:**
Nome: Web-Server-Prod-01
IP: 192.168.1.100
Template: Linux by Zabbix agent

**Analogia:** Host é como um contato na sua agenda do celular - você precisa "cadastrar" cada dispositivo que vai monitorar!

**Próximo passo:** Digite "o que é item"`;
    }

    // ITEM
    if (q.includes('item') && (q.includes('o que') || q.includes('que é') || q.includes('explica'))) {
      return `📊 **ITEM NO ZABBIX**

ITEM é uma **métrica específica** que você coleta de um host!

**O que é:**
ITEM = "O QUÊ" você quer saber sobre o host

**Exemplos comuns:**
• system.cpu.util → % de uso da CPU
• vm.memory.size[available] → RAM livre
• vfs.fs.size[/,used] → Espaço em disco usado
• net.if.in[eth0] → Tráfego de rede entrada
• proc.num[nginx] → Quantos processos nginx rodando
• web.page.perf[http://site.com] → Tempo resposta site

**Como funciona:**
1. Item coleta dados periodicamente (ex: a cada 60s)
2. Valores ficam no banco de dados
3. Você vê em gráficos e dashboards

**Tipos de items:**
✅ Zabbix agent - Coleta do próprio agente
✅ SNMP - Via protocolo SNMP
✅ IPMI - Hardware sensors
✅ JMX - Java applications
✅ HTTP - Requisições web
✅ Script - Scripts customizados

**Dica:** Um host pode ter dezenas de items!

Digite: "o que é trigger"`;
    }

    // TRIGGER
    if (q.includes('trigger') && (q.includes('o que') || q.includes('que é') || q.includes('explica'))) {
      return `🚨 **TRIGGER NO ZABBIX**

TRIGGER define **quando você deve se preocupar**!

**O que é:**
TRIGGER = "QUANDO" alertar sobre um problema

**Como funciona:**
É uma expressão lógica que avalia items:
\`\`\`
{Host:item.função(tempo)}operador valor
\`\`\`

**Exemplos práticos:**

**1. CPU Alta:**
\`\`\`
{Web-Server:system.cpu.util.avg(5m)}>90
\`\`\`
Lê-se: "CPU média dos últimos 5min maior que 90%"

**2. Disco cheio:**
\`\`\`
{DB-Server:vfs.fs.size[/,pused].last()}>85
\`\`\`
Lê-se: "Uso do disco maior que 85%"

**3. Serviço parado:**
\`\`\`
{App-Server:proc.num[nginx].last()}=0
\`\`\`
Lê-se: "Número de processos nginx = 0"

**Severidades:**
🔵 Not classified
🟢 Information  
🟡 Warning
🟠 Average
🔴 High
🔥 Disaster

**Dica:** Configure trigger ANTES do problema virar crítico!
Ex: Warning em 80%, Critical em 90%

Digite: "o que é action"`;
    }

    // ACTION
    if (q.includes('action') && (q.includes('o que') || q.includes('que é') || q.includes('explica'))) {
      return `📧 **ACTION NO ZABBIX**

ACTION define **o que fazer** quando trigger dispara!

**O que é:**
ACTION = "O QUE FAZER" quando há problema

**Tipos de ação:**

**1. Send Message** 📧
• Email para equipe
• SMS para gerente
• Telegram, Slack, Teams
• Webhook customizado

**2. Remote Command** 🔧
• Reiniciar serviço automaticamente
• Executar script de correção
• Fazer backup de emergência
• Escalar recursos na cloud

**3. Add/Remove Host** 🔄
• Automação de inventário
• Manutenção programada

**Exemplo prático:**

**Cenário:** Nginx down
**Trigger:** proc.num[nginx]=0
**Action:**
1. Enviar email para DevOps
2. Executar: systemctl restart nginx
3. Se não resolver em 5min, escalar para gerente via SMS

**Escalation:**
Você pode configurar níveis:
• 0-5min: Email DevOps
• 5-15min: SMS Gerente
• 15min+: Ligar CEO! 😱

**Dica:** Teste actions em dev primeiro!

Fluxo completo: HOST → ITEM → TRIGGER → ACTION 🎯`;
    }

    // TEMPLATE
    if (q.includes('template') && (q.includes('o que') || q.includes('que é') || q.includes('explica'))) {
      return `📋 **TEMPLATE NO ZABBIX**

TEMPLATE é um **conjunto reutilizável** de configurações!

**O que é:**
TEMPLATE = Receita pronta de monitoramento

**Contém:**
✅ Items (o que coletar)
✅ Triggers (quando alertar)
✅ Graphs (gráficos)
✅ Discovery rules (descoberta automática)
✅ Macros (variáveis)

**Por que usar?**
🚀 Crie UMA VEZ, use SEMPRE
🚀 Aplique em centenas de hosts
🚀 Atualize em um lugar só
🚀 Padronização total

**Templates oficiais:**
• Template OS Linux
• Template OS Windows
• Template App MySQL
• Template Net Cisco
• Template App Docker
• E centenas mais!

**Exemplo:**
Você tem 50 servidores Linux.
❌ Sem template: Configure 50x manualmente
✅ Com template: Aplica template em 50 hosts (1 clique!)

**Community Templates:**
• Zabbix Share: share.zabbix.com
• GitHub: github.com/zabbix
• Milhares gratuitos!

**Herança:** Templates podem herdar de outros templates! 🎯

Digite: "como usar template"`;
    }

    // DASHBOARD
    if (q.includes('dashboard') && q.includes('grafana')) {
      return `📊 **DASHBOARD NO GRAFANA**

DASHBOARD é seu **centro de comando visual**!

**O que é:**
Coleção de painéis (panels) que exibem métricas em tempo real

**Anatomia de um dashboard:**
```
┌─────────────────────────────┐
│  TÍTULO DO DASHBOARD        │
├──────────┬──────────────────┤
│  Panel 1 │   Panel 2        │
│  (Graph) │   (Gauge)        │
├──────────┼──────────────────┤
│  Panel 3 │   Panel 4        │
│  (Stat)  │   (Table)        │
└──────────┴──────────────────┘
```

**Tipos de painéis:**
📈 **Graph/Time series** - Linhas, áreas, barras
🎯 **Gauge** - Medidor circular/linear  
🔢 **Stat** - Número grande e destacado
📋 **Table** - Dados tabulares
🗺️ **Heatmap** - Mapa de calor
📍 **Geomap** - Mapa geográfico

**Boas práticas:**
✅ 4-8 painéis por dashboard (não exagere!)
✅ Cores consistentes (vermelho=ruim, verde=bom)
✅ Conte uma história com os dados
✅ Dashboard deve responder: "Tá tudo ok?"
✅ Mobile-friendly

**Dashboards prontos:**
grafana.com/grafana/dashboards
• 10+ mil dashboards gratuitos
• Importa com 1 clique!

Digite: "tipos de painel grafana"`;
    }

    // INSTALAÇÃO ZABBIX
    if (q.includes('instalar') && q.includes('zabbix') || q.includes('instalação') && q.includes('zabbix')) {
      return `⚡ **INSTALAÇÃO ZABBIX SERVER (Ubuntu)**

**Pré-requisitos:**
• Ubuntu 22.04 ou 24.04
• 2GB RAM mínimo
• Acesso root/sudo

**PASSO 1: Preparar sistema**
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

**PASSO 2: Adicionar repositório Zabbix**
\`\`\`bash
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
sudo dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
sudo apt update
\`\`\`

**PASSO 3: Instalar componentes**
\`\`\`bash
sudo apt install zabbix-server-mysql zabbix-frontend-php zabbix-apache-conf zabbix-sql-scripts zabbix-agent
\`\`\`

**PASSO 4: Configurar MySQL**
\`\`\`bash
sudo apt install mysql-server
sudo mysql
mysql> create database zabbix character set utf8mb4 collate utf8mb4_bin;
mysql> create user zabbix@localhost identified by 'SenhaForte123!';
mysql> grant all privileges on zabbix.* to zabbix@localhost;
mysql> quit;
\`\`\`

**PASSO 5: Importar schema**
\`\`\`bash
zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix
\`\`\`

**PASSO 6: Editar config**
\`\`\`bash
sudo nano /etc/zabbix/zabbix_server.conf
# Descomente e configure:
DBPassword=SenhaForte123!
\`\`\`

**PASSO 7: Iniciar serviços**
\`\`\`bash
sudo systemctl restart zabbix-server zabbix-agent apache2
sudo systemctl enable zabbix-server zabbix-agent apache2
\`\`\`

**PASSO 8: Acessar interface**
• URL: http://seu-ip/zabbix
• User: Admin
• Pass: zabbix
• **MUDE A SENHA IMEDIATAMENTE!** 🔒

**Tempo total:** 15-30 minutos

Digite: "instalar zabbix agent" para instalar nos hosts`;
    }

    // INSTALAÇÃO GRAFANA
    if (q.includes('instalar') && q.includes('grafana') || q.includes('instalação') && q.includes('grafana')) {
      return `📊 **INSTALAÇÃO GRAFANA (Ubuntu)**

**PASSO 1: Adicionar repositório**
\`\`\`bash
sudo apt-get install -y apt-transport-https software-properties-common
sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
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
sudo systemctl status grafana-server
\`\`\`

**PASSO 4: Acessar**
• URL: http://seu-ip:3000
• User: admin
• Pass: admin
• Sistema pedirá para trocar senha!

**PASSO 5: Instalar plugin Zabbix**
\`\`\`bash
sudo grafana-cli plugins install alexanderzobnin-zabbix-app
sudo systemctl restart grafana-server
\`\`\`

**PASSO 6: Adicionar Zabbix datasource**
1. Grafana → Configuration → Data Sources
2. Add data source → Zabbix
3. Configure:
   - URL: http://zabbix-server/api_jsonrpc.php
   - Username: Admin
   - Password: sua-senha
4. Save & Test

**PASSO 7: Importar dashboard**
• Dashboards → Import
• ID: 1860 (exemplo popular)
• Selecione Zabbix datasource
• Import!

**Pronto!** Dashboard funcionando! 🎉

Digite: "criar dashboard grafana"`;
    }

    // DIFERENÇA ZABBIX GRAFANA
    if (q.includes('diferença') || q.includes('diferenca') && q.includes('zabbix') && q.includes('grafana')) {
      return `🆚 **ZABBIX vs GRAFANA - Qual a diferença?**

Não são concorrentes! São COMPLEMENTARES! ❤️

**ZABBIX:**
🔍 **FOCO: Coleta e Alertas**
✅ Coleta métricas dos devices
✅ Armazena dados históricos
✅ Detecta problemas automaticamente
✅ Envia alertas (email, SMS, etc)
✅ Executa ações corretivas
✅ Gestão de inventário
✅ Descoberta automática

**Analogia:** Zabbix é o SENSOR + CÉREBRO

**GRAFANA:**
🎨 **FOCO: Visualização**
✅ Cria dashboards bonitos
✅ Conecta múltiplas fontes de dados
✅ Gráficos interativos
✅ Alertas visuais
✅ Mobile-friendly
✅ Compartilhamento fácil
✅ Customização total

**Analogia:** Grafana é a TELA + ARTE

**COMBO PERFEITO:**
┌─────────┐      ┌──────────┐
│ DEVICES │ ───→ │  ZABBIX  │
└─────────┘      │ (coleta) │
                 └────┬─────┘
                      │
                      ↓
                 ┌──────────┐
                 │ GRAFANA  │
                 │(visualiza)│
                 └──────────┘

**Na prática:**
• Zabbix monitora 1000 servidores
• Coleta CPU, RAM, disco, rede
• Detecta: "Web-01 CPU 95%!"
• Grafana pega dados do Zabbix
• Mostra dashboard lindo para gerência
• Ambos alertam quando necessário

**Resumo:**
Zabbix = Backend (força bruta)
Grafana = Frontend (beleza)

Use os DOIS juntos! 💪

Digite: "como integrar zabbix grafana"`;
    }

    // TROUBLESHOOTING CPU ALTA
    if (q.includes('cpu') && (q.includes('alta') || q.includes('alto') || q.includes('100') || q.includes('problema'))) {
      return `🔧 **TROUBLESHOOTING: CPU ALTA**

**PASSO 1: Confirmar o problema** 🔍
\`\`\`bash
top
# ou
htop (mais bonito)
\`\`\`

**PASSO 2: Identificar processo culpado** 🕵️
\`\`\`bash
# Top 10 processos por CPU
ps aux --sort=-%cpu | head -10

# Processo específico
top -p $(pgrep nginx)
\`\`\`

**PASSO 3: Verificar há quanto tempo** ⏰
\`\`\`bash
uptime
# Load average: 8.5, 7.2, 5.1 = problema!
\`\`\`

**PASSO 4: Analisar logs** 📋
\`\`\`bash
# Logs do processo problemático
journalctl -u nome-do-servico --since "10 minutes ago"

# Logs do sistema
dmesg | tail -50
\`\`\`

**CAUSAS COMUNS:**

**1. Loop infinito no código**
• Solução: Fix code + deploy

**2. Muitas requisições (DDoS)**
• Solução: Implementar rate limit

**3. Backup rodando**
• Solução: Agendar fora de horário

**4. Memory leak**
• Solução: Restart + investigar

**5. Hardware insuficiente**
• Solução: Upgrade ou scale out

**AÇÕES IMEDIATAS:**

**Temporária:**
\`\`\`bash
# Limitar CPU do processo
cpulimit -p PID -l 50  # Limita a 50%

# Reiniciar serviço
sudo systemctl restart nome-servico
\`\`\`

**Preventiva:**
\`\`\`bash
# Nice (prioridade)
nice -n 10 comando  # Roda com prioridade baixa

# Cron para monitorar
*/5 * * * * /usr/bin/check_cpu.sh
\`\`\`

**NO ZABBIX:**
Configure triggers:
• Warning: CPU > 80% por 5min
• High: CPU > 95% por 3min
• Action: Email + Script auto-remediation

**Prevenção > Correção!** 🎯

Digite: "outros problemas" para mais troubleshooting`;
    }

    // CONCEITOS GERAIS
    if (q.includes('conceitos') || q.includes('fundamentos') || q.includes('básico')) {
      if (q.includes('zabbix')) {
        return `🎓 **CONCEITOS FUNDAMENTAIS - ZABBIX**

**Os 4 Pilares:**

**1. HOST** 🖥️
• O QUE: Dispositivo monitorado
• EXEMPLO: Web-Server-01, Switch-Core

**2. ITEM** 📊
• O QUE: Métrica coletada
• EXEMPLO: CPU, RAM, disco

**3. TRIGGER** 🚨
• O QUE: Condição de alerta
• EXEMPLO: Se CPU>90%

**4. ACTION** 📧
• O QUE: Ação quando alerta
• EXEMPLO: Enviar email

**Conceitos avançados:**

**5. TEMPLATE** 📋
• Conjunto reutilizável de config

**6. DISCOVERY** 🔍
• Descoberta automática de devices

**7. MACRO** 🔮
• Variáveis reutilizáveis

**8. PROXY** 🌐
• Coleta remota de dados

**9. MAINTENANCE** 🔧
• Períodos de manutenção programada

**Fluxo básico:**
HOST → coleta → ITEM → avalia → TRIGGER → dispara → ACTION

**Quer aprofundar?** Digite:
• "o que é host"
• "o que é item"
• "o que é trigger"
• "o que é action"`;
      }
      
      if (q.includes('grafana')) {
        return `🎓 **CONCEITOS FUNDAMENTAIS - GRAFANA**

**Os 5 Pilares:**

**1. DATASOURCE** 🔌
• Origem dos dados
• Ex: Zabbix, Prometheus, MySQL

**2. DASHBOARD** 📊
• Coleção de painéis
• Centro de comando visual

**3. PANEL** 📈
• Componente individual
• Ex: Gráfico, gauge, tabela

**4. QUERY** 🔍
• Pergunta ao datasource
• Ex: "CPU dos últimos 30min"

**5. VARIABLE** 🔮
• Torna dashboard dinâmico
• Ex: $servidor, $ambiente

**Conceitos avançados:**

**6. ALERT** 🚨
• Sistema de alertas

**7. PLUGIN** 🧩
• Extensões e customizações

**8. PROVISIONING** 📦
• Config como código

**9. ORGANIZATION** 🏢
• Multi-tenancy

**10. ANNOTATIONS** 📌
• Marcações em gráficos

**Hierarquia:**
DATASOURCE → QUERY → PANEL → DASHBOARD

**Aprofunde:** Digite "o que é dashboard" ou "o que é panel"`;
      }
    }

    // MENU / AJUDA
    if (q.includes('menu') || q.includes('ajuda') || q.includes('help') || q.includes('comandos')) {
      return `📚 **MENU DE AJUDA - ZABBIBOT 3.0**

**🔵 SOBRE ZABBIX:**
• "o que é zabbix"
• "o que é host/item/trigger/action"
• "conceitos zabbix"
• "instalar zabbix"
• "como usar template"

**🟣 SOBRE GRAFANA:**
• "o que é grafana"
• "o que é dashboard/panel"
• "conceitos grafana"
• "instalar grafana"
• "criar dashboard"

**🆚 COMPARAÇÕES:**
• "diferença zabbix grafana"
• "quando usar zabbix"
• "quando usar grafana"

**🔧 TROUBLESHOOTING:**
• "cpu alta"
• "disco cheio"
• "agente offline"
• "problemas comuns"

**📚 TUTORIAIS:**
• "tutorial completo zabbix"
• "tutorial completo grafana"
• "integrar zabbix grafana"

**💡 DICAS:**
• "boas práticas zabbix"
• "boas práticas grafana"
• "dicas profissionais"

**Digite qualquer pergunta acima!** 🎯`;
    }

    // Resposta genérica inteligente
    return `🤔 Hmm, sobre **"${question}"** especificamente não tenho resposta pronta.

**Mas posso te ajudar com:**

📚 Digite **menu** para ver todos os tópicos

**Tópicos populares:**
• "o que é zabbix"
• "o que é grafana"  
• "como instalar zabbix"
• "diferença zabbix grafana"
• "cpu alta" (troubleshooting)

**Ou reformule sua pergunta!** 
Exemplo: Em vez de "como funciona", tente "o que é..."

Tô aqui para ajudar! 💪`;
  };

  const smartRespond = (userMsg) => {
    const msg = userMsg.toLowerCase().trim();

    // Estado: Nome
    if (conversationState === 'greeting') {
      setUserName(userMsg.trim());
      setConversationState('choosing_level');
      addXP(10);
      return `Prazer, **${userMsg.trim()}**! 🤝

Seu nível de experiência?

🌱 **1** - Iniciante (nunca usei)
🌿 **2** - Básico (já mexi um pouco)
🌳 **3** - Intermediário (uso no trabalho)
🚀 **4** - Avançado (sou expert!)

**Digite o número:** 👆`;
    }

    // Estado: Nível
    if (conversationState === 'choosing_level') {
      if (['1', '2', '3', '4'].includes(msg)) {
        const levels = { '1': 'iniciante', '2': 'basico', '3': 'intermediario', '4': 'avancado' };
        setUserLevel(levels[msg]);
        setConversationState('ready');
        addXP(20);
        return `✨ **Pronto, ${userName}!**

Agora pode me fazer QUALQUER pergunta sobre Zabbix ou Grafana! 🎯

**Sugestões para começar:**
• "o que é zabbix"
• "o que é grafana"
• "como instalar zabbix"
• "menu" (ver todos os tópicos)

**Sua pergunta:** 👇`;
      }
      return 'Digite **1**, **2**, **3** ou **4**! 😊';
    }

    // Estado: Pronto - responde perguntas
    if (conversationState === 'ready') {
      const answer = getAnswer(userMsg);
      addXP(5);
      return answer;
    }

    return 'Digite seu nome para começar! 😊';
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    const response = smartRespond(input);
    setInput('');
    addBotMessage(response, 300);
  };

  const handleReset = () => {
    setMessages([]);
    setConversationState('greeting');
    setXp(0);
    setUserName('');
    setUserLevel(null);
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ZabbiBot 3.0
                </h1>
                <p className="text-purple-300 font-bold">
                  🧠 Tutor Especialista • {userName && `${userName}`}
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
                onClick={handleReset}
                className="p-3 bg-red-600/30 hover:bg-red-600/50 rounded-xl transition-all border border-red-500/50"
              >
                <RotateCcw className="w-5 h-5 text-red-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-slate-950/80 h-[550px] overflow-y-auto p-6 space-y-4">
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
                    ? 'bg-green-900/70 text-green-200 border border-green-500/50'
                    : 'bg-slate-900/90 text-gray-100 border border-slate-700/50'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <p className="text-xs text-gray-500 mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
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
              placeholder="Digite sua pergunta..."
              className="flex-1 bg-slate-900/90 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-800/50"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl px-8 py-4 flex items-center gap-2 font-bold"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => setInput('menu')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <Rocket className="w-3 h-3 inline mr-1" /> Menu
            </button>
            <button onClick={() => setInput('o que é zabbix')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <MessageSquare className="w-3 h-3 inline mr-1" /> Zabbix
            </button>
            <button onClick={() => setInput('o que é grafana')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              <TrendingUp className="w-3 h-3 inline mr-1" /> Grafana
            </button>
            <button onClick={() => setInput('instalar zabbix')} className="text-xs bg-slate-800/60 hover:bg-slate-700 text-gray-300 px-3 py-2 rounded-lg border border-slate-700/50">
              ⚡ Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZabbiBotTutor;