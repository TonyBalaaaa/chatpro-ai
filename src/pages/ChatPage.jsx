import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/chat/Sidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents } from '@/contexts/AgentsContext';
import { usePlan } from '@/contexts/PlanContext';
import { motion } from 'framer-motion'; // Importação adicionada

const ChatPage = ({ theme, toggleTheme }) => {
  const { user } = useAuth();
  const { agents: customAgents, loading: agentsLoading } = useAgents();
  const { currentPlan, features, loading: planLoading } = usePlan();
  
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [availableAgents, setAvailableAgents] = useState([]);
  const [currentAgent, setCurrentAgent] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(() => {
    const savedCount = localStorage.getItem(`chatpro_messageCount_${user?.id}_${new Date().toISOString().split('T')[0]}`); // Daily count
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showVoiceVisualizer, setShowVoiceVisualizer] = useState(false);

  const scrollAreaRef = useRef(null);
  const { toast } = useToast();

  const maxMessages = currentPlan?.maxMessages === Infinity ? Infinity : currentPlan?.maxMessages || 0;

  const playSound = (type = 'click') => {
    console.log(`Simulating sound: ${type}`);
    if (navigator.vibrate) {
      navigator.vibrate(50); // Vibração leve
    }
  };


  useEffect(() => {
    if (agentsLoading || planLoading || !currentPlan) return;

    const updatedAgents = customAgents.map(agent => ({
      ...agent,
      unavailable: !(currentPlan.allowedAgents.includes(agent.id) || currentPlan.allowedAgents.includes('all') || agent.isCustom),
    }));
    setAvailableAgents(updatedAgents);

    const agentIdFromNav = location.state?.agentId;
    let initialAgent = null;

    if (agentIdFromNav) {
      initialAgent = updatedAgents.find(a => a.id === agentIdFromNav && !a.unavailable);
    }
    
    if (!initialAgent) {
      initialAgent = updatedAgents.find(a => !a.unavailable);
    }
    
    if (initialAgent) {
      setCurrentAgent(initialAgent);
    } else if (updatedAgents.length > 0) {
      const firstAvailable = updatedAgents.find(a => !a.unavailable);
      setCurrentAgent(firstAvailable || updatedAgents[0]);
    } else {
       toast({ title: "Nenhum agente disponível", description: "Crie um agente ou verifique seu plano.", variant: "destructive"});
       navigate('/dashboard');
    }

  }, [customAgents, agentsLoading, currentPlan, planLoading, location.state, navigate, toast]);


  useEffect(() => {
    localStorage.setItem(`chatpro_messageCount_${user?.id}_${new Date().toISOString().split('T')[0]}`, messageCount.toString());
  }, [messageCount, user?.id]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isTyping]);
  
  const handleSendMessage = async (textInput = input) => {
    if (!currentAgent || textInput.trim() === '') return;
    playSound('send');

    if (messageCount >= maxMessages && maxMessages !== Infinity) {
      toast({
        title: "Limite Atingido",
        description: `Você atingiu o limite de ${maxMessages} mensagens para o plano ${currentPlan.name}. Considere um upgrade!`,
        variant: "destructive",
      });
      return;
    }

    const newMessage = { 
      id: Date.now(), 
      text: textInput, 
      sender: 'user', 
      timestamp: new Date(), 
      userEmail: user?.email 
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    if (maxMessages !== Infinity) {
        setMessageCount(prev => prev + 1);
    }
    setIsTyping(true);

    setTimeout(() => {
      let aiText = `Olá, ${user?.email?.split('@')[0] || 'usuário'}! Sou ${currentAgent.name}. `;
      if (currentAgent.promptBase) {
        aiText += `Seguindo minhas instruções: "${currentAgent.promptBase.substring(0,50)}...", como posso te ajudar com: "${newMessage.text.substring(0,30)}..."?`;
      } else {
        aiText += `Como ${currentAgent.name} (Plano ${currentPlan.name}), posso te ajudar com: "${newMessage.text.substring(0,30)}..."?`;
      }
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: aiText, 
        sender: 'ai', 
        timestamp: new Date(),
        agent: currentAgent 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      playSound('receive');
    }, 1500 + Math.random() * 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    playSound('newChat');
    toast({ title: "Novo Chat", description: "A conversa foi reiniciada." });
  };

  const selectAgent = (agentId) => {
    const selected = availableAgents.find(a => a.id === agentId);
    if (selected && !selected.unavailable) {
      setCurrentAgent(selected);
      setMessages([]);
      playSound('selectAgent');
      toast({ title: "Agente Alterado", description: `Agora você está conversando com ${selected.name}.` });
    } else if (selected && selected.unavailable) {
       toast({
        title: "Agente Indisponível",
        description: `${selected.name} não está disponível no seu plano atual (${currentPlan.name}). Faça um upgrade!`,
        variant: "destructive",
      });
       playSound('error');
    }
  };

  const handleGenerateImage = () => {
    if (!features.imageGeneration) {
      toast({ title: "Recurso Bloqueado", description: "Geração de imagem requer plano Plus ou superior.", variant: "destructive" });
      playSound('error');
      return;
    }
    playSound('click');
    setShowImagePreview(true);
    const promptText = input.trim() || "um gato cyberpunk em uma cidade chuvosa de neon";
    setMessages(prev => [...prev, { id: Date.now(), text: `Gerando imagem com prompt: "${promptText}"`, sender: 'system', timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const imgMessage = {
        id: Date.now() + 1,
        type: 'image_preview',
        imageUrl: `https://dummyimage.com/400x300/7d28e7/fff.png&text=Prévia+IA:+${promptText.substring(0,20)}...`,
        altText: `Prévia de imagem gerada por IA: ${promptText}`,
        sender: 'ai',
        timestamp: new Date(),
        agent: currentAgent,
      };
      setMessages(prev => [...prev, imgMessage]);
      setIsTyping(false);
      setShowImagePreview(false); 
      playSound('receive');
    }, 2500);
  };
  
  const handleVoiceInput = () => {
    if (!features.voice) {
      toast({ title: "Recurso Bloqueado", description: "Entrada de voz requer plano Pro ou superior.", variant: "destructive" });
      playSound('error');
      return;
    }
    playSound('click');
    setShowVoiceVisualizer(true);
    setMessages(prev => [...prev, { id: Date.now(), text: "Ouvindo...", sender: 'system', timestamp: new Date() }]);
    setTimeout(() => {
      const spokenText = "Olá, este é um texto simulado falado.";
      setInput(spokenText); 
      handleSendMessage(spokenText); 
      setShowVoiceVisualizer(false);
    }, 3000);
  };
  
  if (agentsLoading || planLoading || !currentAgent) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-md">Carregando interface do chat...</p>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen antialiased text-foreground bg-gradient-to-br from-background to-secondary/10 transition-colors duration-300">
      <Sidebar 
        agents={availableAgents}
        currentAgent={currentAgent}
        selectAgent={selectAgent}
        handleNewChat={handleNewChat}
        theme={theme}
        toggleTheme={toggleTheme}
        messageCount={messageCount}
        maxMessages={maxMessages}
        currentPlanName={currentPlan.name}
        onNavigateToDashboard={() => navigate('/dashboard')}
        onNavigateToManageAgents={() => navigate('/manage-agents')}
        onNavigateToExplore={() => navigate('/explore')}
        features={features}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader currentAgent={currentAgent} />
        <MessageList 
            messages={messages} 
            isTyping={isTyping} 
            currentAgent={currentAgent} 
            scrollAreaRef={scrollAreaRef} 
        />
         {showVoiceVisualizer && (
          <div className="p-4 border-t border-border/30 bg-card/70 flex items-center justify-center">
            <div className="flex space-x-1 items-end h-10">
              {[0.4, 0.7, 1, 0.6, 0.3].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: '0.5rem' }}
                  animate={{ height: [`${h*2}rem`, '0.5rem', `${h*2.5}rem`] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  className="w-2 bg-primary rounded-full"
                />
              ))}
            </div>
            <p className="ml-3 text-sm text-muted-foreground">Simulando entrada de voz...</p>
          </div>
        )}
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
          messageCount={messageCount}
          maxMessages={maxMessages}
          currentAgentName={currentAgent.name}
          currentPlanName={currentPlan.name}
          features={features}
          onGenerateImage={handleGenerateImage}
          onVoiceInput={handleVoiceInput}
          playSound={playSound}
        />
      </main>
    </div>
  );
};

export default ChatPage;