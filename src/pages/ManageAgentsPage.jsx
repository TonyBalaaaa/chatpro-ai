import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAgents } from '@/contexts/AgentsContext';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AgentForm from '@/components/agents/AgentForm';
import AgentList from '@/components/agents/AgentList';

const ManageAgentsPage = ({ theme, toggleTheme }) => {
  const { agents, addAgent, updateAgent, deleteAgent, loading } = useAgents();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const playSound = (type = 'click') => {
    console.log(`Simulating sound: ${type} on manage agents page`);
     if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  };


  useEffect(() => {
    if (location.state?.openCreateModal) {
      setEditingAgent(null);
      setIsModalOpen(true);
      playSound('openModal');
      navigate(location.pathname, { replace: true, state: {} }); 
    }
    if (location.state?.editingAgentId) {
      const agentToEdit = agents.find(a => a.id === location.state.editingAgentId && a.isCustom);
      if (agentToEdit) {
        setEditingAgent(agentToEdit);
        setIsModalOpen(true);
        playSound('openModal');
      }
      navigate(location.pathname, { replace: true, state: {} }); 
    }
  }, [location.state, agents, navigate, playSound]);

  const handleOpenModal = (agent = null) => {
    setEditingAgent(agent);
    setIsModalOpen(true);
    playSound('openModal');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAgent(null);
    playSound('closeModal');
  };

  const handleSaveAgent = (agentData) => {
    if (editingAgent) {
      updateAgent(editingAgent.id, agentData);
      toast({ title: "Agente Atualizado", description: `O agente "${agentData.name}" foi atualizado com sucesso.` });
    } else {
      addAgent(agentData);
      toast({ title: "Agente Criado", description: `O agente "${agentData.name}" foi adicionado com sucesso.` });
    }
    handleCloseModal();
  };

  const handleDeleteAgent = (agentId, agentName) => {
    deleteAgent(agentId);
    toast({ title: "Agente Excluído", description: `O agente "${agentName}" foi removido.` });
    playSound('delete');
  };
  
  const handleChatWithAgent = (agentId) => {
    playSound('navigate');
    navigate('/chat', { state: { agentId: agentId } });
  };

  const customAgents = agents.filter(agent => agent.isCustom);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/10 text-foreground transition-colors duration-300">
      <nav className="bg-card/80 backdrop-blur-lg shadow-lg border-b border-border/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => { navigate('/dashboard'); playSound('navigate'); }} className="mr-2 hover:bg-primary/10 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Gerenciar Agentes
              </h1>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-primary-foreground rounded-lg">
                  <PlusCircle className="mr-2 h-5 w-5" /> Criar Novo Agente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] bg-card border-border/50 rounded-xl shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">
                    {editingAgent ? 'Editar Agente' : 'Criar Novo Agente'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAgent ? 'Modifique os detalhes do seu agente personalizado.' : 'Configure um novo agente de IA para suas conversas.'}
                  </DialogDescription>
                </DialogHeader>
                <AgentForm agent={editingAgent} onSave={handleSaveAgent} onCancel={handleCloseModal} playSound={playSound} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="max-w-4xl mx-auto"
        >
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="ml-3 text-muted-foreground">Carregando agentes...</p>
            </div>
          )}

          {!loading && (
            <AgentList
              agents={customAgents}
              onEdit={handleOpenModal}
              onDelete={handleDeleteAgent}
              onChat={handleChatWithAgent}
              onOpenCreateModal={() => handleOpenModal()}
              playSound={playSound}
            />
          )}
        </motion.div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/30 mt-10">
        © {new Date().getFullYear()} ChatPro Interplase AI. Gerenciamento de Agentes.
      </footer>
    </div>
  );
};

export default ManageAgentsPage;