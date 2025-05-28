import React from 'react';
import AgentCard from './AgentCard'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Importar Button

const AgentList = ({ agents, onEdit, onDelete, onChat, onOpenCreateModal, playSound }) => {
  if (!agents || agents.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl shadow-lg border border-border/30">
        <Users size={64} className="mx-auto mb-6 text-muted-foreground opacity-40" />
        <h2 className="text-2xl font-semibold mb-2">Nenhum Agente Personalizado</h2>
        <p className="text-muted-foreground mb-6">Comece criando seu primeiro agente de IA!</p>
        <Button onClick={onOpenCreateModal} size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-primary-foreground rounded-lg">
           Criar Agente Agora
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onEdit={() => onEdit(agent)}
            onDelete={() => onDelete(agent.id, agent.name)}
            onChat={() => onChat(agent.id)}
            isUnavailable={false}
            playSound={playSound}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AgentList;