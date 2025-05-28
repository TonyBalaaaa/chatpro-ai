import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents } from '@/contexts/AgentsContext';
import { usePlan } from '@/contexts/PlanContext';
import { LogOut, MessageSquare, Settings, Sun, Moon, UserCircle, Zap, Star, FileText, Users, PlusCircle, Edit3, Trash2, Compass, Image as ImageIcon, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import AgentCard from '@/components/agents/AgentCard';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DashboardPage = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const { agents, deleteAgent, updateAgent, loading: agentsLoading } = useAgents();
  const { currentPlan, features, loading: planLoading, cyclePlan } = usePlan();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [agentToDelete, setAgentToDelete] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null); // For inline editing modal
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [showVoiceSimulatorModal, setShowVoiceSimulatorModal] = useState(false);


  const playSound = (type = 'click') => {
    console.log(`Simulating sound: ${type} on dashboard`);
    if (navigator.vibrate) {
      navigator.vibrate(30); 
    }
  };

  const handleLogout = async () => {
    playSound('logout');
    await logout();
    navigate('/login');
  };

  const confirmDeleteAgent = (agent) => {
    playSound('openModal');
    setAgentToDelete(agent);
  };

  const handleDeleteAgent = () => {
    if (agentToDelete) {
      deleteAgent(agentToDelete.id);
      toast({ title: "Agente Excluído", description: `O agente "${agentToDelete.name}" foi removido.` });
      playSound('delete');
    }
    setAgentToDelete(null);
  };

  const handleEditAgent = (agent) => {
    playSound('openModal');
    setEditingAgent(agent);
  };

  const handleSaveEditedAgent = (updatedData) => {
    if (editingAgent) {
      updateAgent(editingAgent.id, { ...editingAgent, ...updatedData });
      toast({ title: "Agente Atualizado", description: `Agente "${updatedData.name}" salvo.` });
      playSound('save');
    }
    setEditingAgent(null);
  };
  
  const handleSimulateImageGeneration = () => {
    playSound('click');
    if (!features.imageGeneration) {
      toast({ title: "Recurso Bloqueado", description: "Geração de imagem requer plano Plus ou superior.", variant: "destructive" });
      playSound('error');
      return;
    }
    setShowImagePreviewModal(true);
  };

  const handleSimulateVoiceInput = () => {
    playSound('click');
    if (!features.voice) {
      toast({ title: "Recurso Bloqueado", description: "Comando de voz requer plano Pro ou superior.", variant: "destructive" });
      playSound('error');
      return;
    }
    setShowVoiceSimulatorModal(true);
  };


  const availableAgentsToDisplay = agents.filter(agent => 
    currentPlan.allowedAgents.includes('all') || 
    currentPlan.allowedAgents.includes(agent.id) ||
    (agent.isCustom && currentPlan.features.customAgents) 
  );

  if (agentsLoading || planLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg font-medium">Carregando Dashboard...</p>
      </div>
    );
  }
  
  const planCycleButtonText = () => {
    if (currentPlan.name === 'Gratuito') return 'Testar Plano Plus';
    if (currentPlan.name === 'Plus') return 'Testar Plano Pro';
    if (currentPlan.name === 'Pro') return 'Testar Plano Interplase';
    return 'Testar Plano Gratuito';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/10 text-foreground transition-colors duration-300">
      <nav className="bg-card/80 backdrop-blur-lg shadow-lg border-b border-border/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex-shrink-0 group" onClick={() => playSound('navigate')}>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 group-hover:opacity-80 transition-opacity">
                ChatPro AI ✨
              </h1>
            </Link>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="ghost" size="icon" onClick={() => { toggleTheme(); playSound('themeToggle');}} aria-label="Mudar tema" className="hover:bg-primary/10 rounded-full">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { navigate('/chat'); playSound('navigate'); }} aria-label="Novo Chat" className="hover:bg-primary/10 rounded-full">
                 <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { navigate('/manage-agents'); playSound('navigate'); }} aria-label="Gerenciar Agentes" className="hover:bg-primary/10 rounded-full">
                 <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { navigate('/explore'); playSound('navigate'); }} aria-label="Explorar Recursos" className="hover:bg-primary/10 rounded-full">
                 <Compass className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" disabled aria-label="Configurações" className="hover:bg-primary/10 rounded-full">
                <Settings className="h-5 w-5 opacity-50" />
              </Button>
              <Button variant="outline" onClick={handleLogout} size="sm" className="border-primary/50 hover:bg-primary/10 hover:text-primary rounded-lg">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-8 p-6 bg-card rounded-2xl shadow-xl border border-border/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 -z-10 rounded-2xl"></div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold">Bem-vindo(a), <span className="text-primary">{user?.email?.split('@')[0] || 'Usuário'}</span>!</h2>
                <p className="text-muted-foreground mt-1">Pronto para interagir com nossos agentes de IA?</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-muted-foreground">Seu plano atual:</p>
                <p className="text-xl font-semibold text-primary">{currentPlan.name}</p>
                {currentPlan.maxMessages !== Infinity && (
                  <p className="text-xs text-muted-foreground">Mensagens restantes hoje: {currentPlan.maxMessages - (parseInt(localStorage.getItem(`chatpro_messageCount_${user?.id}_${new Date().toISOString().split('T')[0]}`) || '0'))}/{currentPlan.maxMessages}</p>
                )}
                 <Button onClick={() => { cyclePlan(); playSound('cyclePlan'); }} size="sm" variant="outline" className="mt-2 text-xs rounded-md">
                  {planCycleButtonText()}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Botões de Simulação de Recursos Avançados */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full py-6 text-left justify-start hover:bg-primary/5 hover:border-primary/30 rounded-xl transition-all"
              onClick={handleSimulateImageGeneration}
              disabled={!features.imageGeneration && currentPlan.name !== 'Gratuito'} 
            >
              <ImageIcon className={`mr-3 h-6 w-6 ${features.imageGeneration ? 'text-primary' : 'text-muted-foreground/70'}`} />
              <div>
                <span className={`font-semibold ${features.imageGeneration ? 'text-foreground' : 'text-muted-foreground/80'}`}>Gerar Imagem com IA</span>
                <p className="text-xs text-muted-foreground">
                  {features.imageGeneration ? 'Transforme texto em visuais incríveis.' : 'Disponível no plano Plus e superiores.'}
                </p>
              </div>
              {!features.imageGeneration && <Star className="ml-auto h-4 w-4 text-amber-500" />}
            </Button>
             <Button 
              variant="outline" 
              className="w-full py-6 text-left justify-start hover:bg-primary/5 hover:border-primary/30 rounded-xl transition-all"
              onClick={handleSimulateVoiceInput}
              disabled={!features.voice && (currentPlan.name !== 'Gratuito' && currentPlan.name !== 'Plus')}
            >
              <Mic className={`mr-3 h-6 w-6 ${features.voice ? 'text-primary' : 'text-muted-foreground/70'}`} />
               <div>
                <span className={`font-semibold ${features.voice ? 'text-foreground' : 'text-muted-foreground/80'}`}>Falar com Agente</span>
                <p className="text-xs text-muted-foreground">
                   {features.voice ? 'Interaja usando comandos de voz.' : 'Disponível no plano Pro e superiores.'}
                </p>
              </div>
              {!features.voice && <Star className="ml-auto h-4 w-4 text-amber-500" />}
            </Button>
          </div>


          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Agentes Disponíveis</h3>
              <Button onClick={() => { navigate('/manage-agents', { state: { openCreateModal: true }}); playSound('navigate'); }} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-primary-foreground rounded-lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Criar Agente
              </Button>
            </div>
            {availableAgentsToDisplay.length === 0 && !agentsLoading ? (
              <div className="bg-card p-10 rounded-2xl shadow-lg border border-border/30 text-center text-muted-foreground">
                <Users size={52} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg">Nenhum agente disponível ou criado ainda.</p>
                <p className="text-sm">Clique em "Criar Agente" para começar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {availableAgentsToDisplay.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onEdit={() => handleEditAgent(agent)}
                    onDelete={() => confirmDeleteAgent(agent)}
                    onChat={() => { navigate('/chat', { state: { agentId: agent.id } }); playSound('navigate'); }}
                    isUnavailable={agent.unavailable}
                    playSound={playSound}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-6">Histórico de Conversas</h3>
            <div className="bg-card p-10 rounded-2xl shadow-lg border border-border/30 text-center">
              <FileText size={52} className="mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground">Seu histórico de conversas aparecerá aqui.</p>
              <p className="text-xs text-muted-foreground mt-1">
                {features.history === 'supabase' ? '(Salvo na nuvem com Supabase)' : features.history === 'local' ? '(Salvo localmente)' : '(Recurso indisponível neste plano)'}
              </p>
              {!features.history && (
                <Button size="sm" variant="link" className="mt-2" onClick={() => { cyclePlan(); playSound('cyclePlan');}}>Faça upgrade para salvar o histórico</Button>
              )}
            </div>
          </section>

           <section>
            <h3 className="text-2xl font-semibold mb-6">Seu Plano Atual: {currentPlan.name}</h3>
            <div className="bg-card p-8 rounded-2xl shadow-xl border border-border/30 text-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/20 to-transparent -z-10 rounded-2xl"></div>
              <Zap size={52} className="mx-auto mb-4 text-primary opacity-80" />
              <p className="text-xl font-medium">Explore mais funcionalidades!</p>
              <p className="text-muted-foreground mb-6">Visite a aba "Explorar" ou faça upgrade do seu plano para desbloquear recursos avançados.</p>
              <Button variant="default" size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-primary-foreground shadow-lg rounded-lg" onClick={() => { cyclePlan(); playSound('cyclePlan'); }}>
                {currentPlan.name === 'Interplase' ? 'Ver Detalhes do Plano Interplase' : `Upgrade para ${currentPlan.name === 'Gratuito' ? 'Plus' : currentPlan.name === 'Plus' ? 'Pro' : 'Interplase'}`}
                <Star className="ml-2 h-5 w-5" />
              </Button>
               <p className="text-xs text-muted-foreground mt-3">(Clique para simular a troca de plano e ver os recursos)</p>
            </div>
          </section>
        </motion.div>
      </main>
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/30 mt-10">
        © {new Date().getFullYear()} ChatPro Interplase AI. Todos os direitos reservados.
      </footer>

      {/* Modal de Exclusão */}
      <AlertDialog open={!!agentToDelete} onOpenChange={() => setAgentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o agente "{agentToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => playSound('cancel')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAgent} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Edição Inline (simplificado) */}
      {editingAgent && (
         <AgentCard.EditModal
            agent={editingAgent}
            isOpen={!!editingAgent}
            onClose={() => { setEditingAgent(null); playSound('closeModal'); }}
            onSave={handleSaveEditedAgent}
         />
      )}
      
      {/* Modal de Simulação de Geração de Imagem */}
      {showImagePreviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => {setShowImagePreviewModal(false); playSound('closeModal');}}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card p-6 rounded-xl shadow-2xl max-w-md w-full text-center border border-primary/30"
          >
            <h3 className="text-xl font-semibold mb-4 text-primary">Prévia da Imagem Gerada por IA</h3>
            <img  
                src="https://dummyimage.com/300x200/7d28e7/fff.png&text=IA+Image+Preview" 
                alt="Prévia de imagem gerada por IA" 
                className="rounded-lg mx-auto mb-4 shadow-md border border-border"
             src="https://images.unsplash.com/photo-1546791302-6cc48602ecfc" />
            <p className="text-sm text-muted-foreground mb-4">Isto é uma simulação. No plano Plus ou superior, você poderá gerar imagens reais com base no seu prompt.</p>
            <Button onClick={() => {setShowImagePreviewModal(false); playSound('closeModal');}} className="w-full">Fechar Prévia</Button>
          </motion.div>
        </div>
      )}

      {/* Modal de Simulação de Voz */}
      {showVoiceSimulatorModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => {setShowVoiceSimulatorModal(false); playSound('closeModal');}}>
           <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card p-6 rounded-xl shadow-2xl max-w-md w-full text-center border border-primary/30"
          >
            <h3 className="text-xl font-semibold mb-4 text-primary">Simulador de Comando de Voz</h3>
            <div className="flex space-x-2 items-end justify-center h-16 my-4">
              {[0.5, 0.8, 1.2, 0.7, 0.4, 0.9, 0.6].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: '0.5rem' }}
                  animate={{ height: [`${h*1.5}rem`, '0.5rem', `${h*2}rem`] }}
                  transition={{ duration: 0.3 + (i*0.05), repeat: Infinity, repeatType: "mirror", delay: i * 0.08 }}
                  className="w-3 bg-primary rounded-full"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">"Olá ChatPro, como está o tempo hoje?"</p>
            <p className="text-xs text-muted-foreground mb-4">Isto é uma simulação. No plano Pro ou superior, você poderá usar comandos de voz reais.</p>
            <Button onClick={() => {setShowVoiceSimulatorModal(false); playSound('closeModal');}} className="w-full">Fechar Simulador</Button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;