import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Para IDs únicos
import { initialAgentsData } from '@/config/chatConfig'; // Agentes padrão

const AgentsContext = createContext(null);

export const AgentsProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar agentes do localStorage ou usar os iniciais + customizados
  useEffect(() => {
    setLoading(true);
    try {
      const storedCustomAgents = JSON.parse(localStorage.getItem('chatpro_custom_agents') || '[]');
      // Combinar agentes padrão com customizados, garantindo que os padrão não sejam sobrescritos por custom com mesmo ID
      const combinedAgents = [...initialAgentsData];
      storedCustomAgents.forEach(customAgent => {
        const existingIndex = combinedAgents.findIndex(agent => agent.id === customAgent.id);
        if (existingIndex !== -1 && !combinedAgents[existingIndex].isCustom) {
          // Se ID colide com um padrão, não adiciona (ou poderia dar um novo ID ao custom)
          console.warn(`Custom agent ID ${customAgent.id} conflicts with a default agent. Skipping.`);
        } else if (existingIndex !== -1 && combinedAgents[existingIndex].isCustom) {
           combinedAgents[existingIndex] = customAgent; // Atualiza custom existente
        }
        else {
          combinedAgents.push(customAgent);
        }
      });
      setAgents(combinedAgents);
    } catch (error) {
      console.error("Failed to load agents from localStorage:", error);
      setAgents([...initialAgentsData]); // Fallback para os padrões
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar agentes customizados no localStorage sempre que 'agents' mudar
  useEffect(() => {
    if (!loading) { // Só salva depois do carregamento inicial
      const customAgentsToStore = agents.filter(agent => agent.isCustom);
      localStorage.setItem('chatpro_custom_agents', JSON.stringify(customAgentsToStore));
    }
  }, [agents, loading]);

  const addAgent = useCallback((agentData) => {
    setAgents(prevAgents => {
      const newAgent = { ...agentData, id: uuidv4(), isCustom: true };
      return [...prevAgents, newAgent];
    });
  }, []);

  const updateAgent = useCallback((agentId, updatedData) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId && agent.isCustom ? { ...agent, ...updatedData } : agent
      )
    );
  }, []);

  const deleteAgent = useCallback((agentId) => {
    setAgents(prevAgents => prevAgents.filter(agent => !(agent.id === agentId && agent.isCustom)));
  }, []);

  const getAgentById = useCallback((agentId) => {
    return agents.find(agent => agent.id === agentId);
  }, [agents]);

  const value = {
    agents,
    loading,
    addAgent,
    updateAgent,
    deleteAgent,
    getAgentById,
  };

  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
};

export const useAgents = () => {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return context;
};