import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PlusCircle, ChevronDown, Settings2, Sun, Moon, LayoutDashboard, Users, Lock, Compass } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = ({ 
  agents, currentAgent, selectAgent, handleNewChat, 
  theme, toggleTheme, messageCount, maxMessages, currentPlanName,
  onNavigateToDashboard, onNavigateToManageAgents, onNavigateToExplore, features
}) => {
  return (
    <aside className="w-72 bg-card/80 backdrop-blur-xl p-4 flex flex-col border-r border-border/30 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
          ChatPro <span className="text-lg">AI ✨</span>
        </h1>
      </div>

      <Button variant="outline" onClick={handleNewChat} className="w-full justify-start hover:bg-primary/5 hover:border-primary/50 transition-colors rounded-lg">
        <PlusCircle className="mr-2 h-4 w-4" /> Novo Chat
      </Button>

      <div className="flex-grow flex flex-col min-h-0">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Agentes</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left h-auto py-2.5 px-3 hover:bg-accent/50 transition-colors rounded-lg">
              <div className="flex items-center overflow-hidden">
                <span className="text-3xl mr-3 shrink-0">{currentAgent?.avatar || '🤖'}</span>
                <span className="truncate font-medium">{currentAgent?.name || 'Nenhum Agente'}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-popover border-border/50 shadow-xl rounded-lg" side="bottom" align="start">
            <DropdownMenuLabel className="px-3 py-2">Escolha um Agente</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <ScrollArea className="max-h-[250px]">
              {agents.map(agent => (
                <DropdownMenuItem 
                  key={agent.id} 
                  onClick={() => selectAgent(agent.id)} 
                  disabled={agent.unavailable}
                  className="px-3 py-2.5 cursor-pointer hover:bg-accent/80 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                >
                  <span className="text-2xl mr-2.5">{agent.avatar}</span>
                  <span className="truncate">{agent.name}</span>
                  {agent.unavailable && <Lock className="ml-auto h-3 w-3 text-muted-foreground" />}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-auto space-y-1 pt-2 border-t border-border/30">
        <p className="text-xs text-muted-foreground px-2 pb-1">
          Plano: <span className="font-medium text-primary">{currentPlanName}</span> | {maxMessages === Infinity ? 'Msg: Ilimitadas' : `Msg: ${messageCount}/${maxMessages}`}
        </p>
        <Button variant="ghost" onClick={onNavigateToDashboard} className="w-full justify-start text-sm hover:bg-accent/50 transition-colors rounded-lg">
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </Button>
        <Button variant="ghost" onClick={onNavigateToManageAgents} className="w-full justify-start text-sm hover:bg-accent/50 transition-colors rounded-lg">
          <Users className="mr-2 h-4 w-4" /> Gerenciar Agentes
        </Button>
        <Button variant="ghost" onClick={onNavigateToExplore} className="w-full justify-start text-sm hover:bg-accent/50 transition-colors rounded-lg">
          <Compass className="mr-2 h-4 w-4" /> Explorar Recursos
        </Button>
        <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start text-sm hover:bg-accent/50 transition-colors rounded-lg">
          {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent/50 transition-colors rounded-lg" disabled>
          <Settings2 className="mr-2 h-4 w-4 opacity-50" /> Configurações
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;