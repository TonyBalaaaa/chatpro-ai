import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Send, Mic, Image as ImageIcon, Paperclip, Lock } from 'lucide-react'; // Removido Sparkles não usado

const ChatInput = ({ 
  input, setInput, handleSendMessage, isTyping, 
  messageCount, maxMessages, currentAgentName, currentPlanName, features,
  onGenerateImage, onVoiceInput, playSound
}) => {
  
  const canSendMessage = !isTyping && input.trim() !== '' && (maxMessages === Infinity || messageCount < maxMessages);
  const atMessageLimit = maxMessages !== Infinity && messageCount >= maxMessages;

  const getFooterText = () => {
    let planInfo = `ChatPro Interplase AI. Plano ${currentPlanName}.`;
    if (maxMessages !== Infinity) {
      planInfo += ` ${Math.max(0, maxMessages - messageCount)} mensagens restantes hoje.`;
    }
    return planInfo;
  };

  const FeatureButton = ({ icon: Icon, label, featureFlag, action, planNameRequired = "Pro" }) => {
    const planHierarchy = { 'Gratuito': 0, 'Plus': 1, 'Pro': 2, 'Interplase': 3 };
    
    let isDisabledByPlan = false;
    if (planNameRequired === "Plus" && planHierarchy[currentPlanName] < planHierarchy.PLUS) {
        isDisabledByPlan = true;
    } else if (planNameRequired === "Pro" && planHierarchy[currentPlanName] < planHierarchy.PRO) {
        isDisabledByPlan = true;
    } else if (planNameRequired === "Interplase" && planHierarchy[currentPlanName] < planHierarchy.INTERPLASE) {
        isDisabledByPlan = true;
    }
    
    const finalDisabledState = isTyping || atMessageLimit || !featureFlag || isDisabledByPlan;

    return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { playSound?.('featureButton'); action?.(); }} 
            disabled={finalDisabledState}
            className={`relative rounded-lg hover:bg-primary/10 ${finalDisabledState ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icon className={`h-5 w-5 ${(!featureFlag || isDisabledByPlan) ? 'text-muted-foreground/50' : 'text-primary/80'}`} />
            {(!featureFlag || isDisabledByPlan) && (
              <Lock className="absolute bottom-0 right-0 h-2.5 w-2.5 text-amber-500 bg-card p-0.5 rounded-full" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-card text-card-foreground border-border/50 shadow-lg rounded-md">
          <p>{label} {(!featureFlag || isDisabledByPlan) ? `(Plano ${planNameRequired}+ Necessário)` : ''}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )};


  return (
    <footer className="p-3 sm:p-4 border-t border-border/30 bg-card/70 backdrop-blur-lg shadow- ऊपर-lg">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end space-x-2">
          <div className="flex items-center space-x-1">
            <FeatureButton icon={Mic} label="Entrada de Voz" featureFlag={features?.voice} action={onVoiceInput} planNameRequired="Pro" />
            <FeatureButton icon={ImageIcon} label="Gerar Imagem" featureFlag={features?.imageGeneration} action={onGenerateImage} planNameRequired="Plus"/>
            <FeatureButton icon={Paperclip} label="Anexar Arquivo" featureFlag={features?.fileUpload} action={() => {playSound?.('attachFile'); alert("Simulação: Anexar Arquivo (Plano Interplase)");}} planNameRequired="Interplase"/>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={atMessageLimit ? `Limite de mensagens atingido para o plano ${currentPlanName}.` : `Mensagem para ${currentAgentName}... (Enter para enviar)`}
            className="flex-1 resize-none bg-input/50 focus:bg-input rounded-xl border-border/50 focus:border-primary/70 transition-all shadow-inner"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSendMessage) {
                  handleSendMessage();
                } else {
                  playSound?.('error');
                }
              }
            }}
            disabled={isTyping || atMessageLimit}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
          />
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div> 
                <Button 
                  onClick={() => {if(canSendMessage) handleSendMessage(); else playSound?.('error');}}
                  size="icon" 
                  disabled={!canSendMessage} 
                  className="rounded-lg bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:transform-none"
                >
                  <Send className="h-5 w-5" />
                </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-card text-card-foreground border-border/50 shadow-lg rounded-md">
                <p>{canSendMessage ? 'Enviar Mensagem' : atMessageLimit ? 'Limite de mensagens atingido' : 'Digite uma mensagem'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 px-2">
          {getFooterText()}
        </p>
      </div>
    </footer>
  );
};

export default ChatInput;