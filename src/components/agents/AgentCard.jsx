import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, MessageSquare, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AgentForm from './AgentForm';

const AgentCard = ({ agent, onEdit, onDelete, onChat, isUnavailable, playSound }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleOpenEditModal = () => {
    playSound?.('openModal');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    playSound?.('closeModal');
    setIsEditModalOpen(false);
  };

  const handleSave = (updatedData) => {
    onEdit(updatedData); // This should now be coming from DashboardPage context or similar
    handleCloseEditModal();
  };


  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "circOut" }}
        className={`bg-card p-5 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-border/30 flex flex-col group relative ${isUnavailable ? 'opacity-60' : ''}`}
      >
        {agent.isCustom && !isUnavailable && (
          <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 rounded-md" onClick={handleOpenEditModal}>
              <Edit3 className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 rounded-md" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        <div className="text-5xl mb-4 text-center py-2">{agent.avatar}</div>
        <h4 className="text-xl font-semibold mb-1 text-center truncate">{agent.name}</h4>
        <p className="text-sm text-muted-foreground mb-4 h-16 overflow-hidden text-center line-clamp-3">{agent.description}</p>
        
        {agent.promptBase && agent.isCustom && (
            <div className="mb-3 text-center">
                <Button variant="link" size="sm" onClick={() => setShowPrompt(!showPrompt)} className="text-xs">
                    {showPrompt ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                    {showPrompt ? 'Ocultar Prompt' : 'Ver Prompt'}
                </Button>
                {showPrompt && (
                    <motion.p 
                        initial={{ opacity: 0, height: 0}}
                        animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                        className="text-xs bg-muted/30 p-2 rounded-md whitespace-pre-wrap font-mono text-left max-h-24 overflow-y-auto"
                    >
                        {agent.promptBase}
                    </motion.p>
                )}
            </div>
        )}

        <Button 
          onClick={onChat} 
          className="w-full mt-auto bg-primary/90 hover:bg-primary transition-colors rounded-lg disabled:bg-muted disabled:text-muted-foreground"
          disabled={isUnavailable}
        >
          {isUnavailable ? <Lock className="mr-2 h-4 w-4" /> : <MessageSquare className="mr-2 h-4 w-4" />}
          {isUnavailable ? 'Upgrade Necessário' : 'Conversar'}
        </Button>
      </motion.div>

      {/* Modal de Edição para AgentCard */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border/50 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Editar Agente: {agent.name}</DialogTitle>
            <DialogDescription>Modifique os detalhes do seu agente personalizado.</DialogDescription>
          </DialogHeader>
          <AgentForm agent={agent} onSave={handleSave} onCancel={handleCloseEditModal} playSound={playSound}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Expondo o modal de edição para ser usado externamente se necessário (como no DashboardPage)
AgentCard.EditModal = ({ agent, isOpen, onClose, onSave, playSound }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[525px] bg-card border-border/50 rounded-xl shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">Editar Agente: {agent?.name}</DialogTitle>
        <DialogDescription>Modifique os detalhes do seu agente personalizado.</DialogDescription>
      </DialogHeader>
      <AgentForm agent={agent} onSave={onSave} onCancel={onClose} playSound={playSound} />
    </DialogContent>
  </Dialog>
);


export default AgentCard;