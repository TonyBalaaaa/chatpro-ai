import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePlan } from '@/contexts/PlanContext';
import { ArrowLeft, Zap, Star, Lock, CheckCircle, Youtube, FileText, Share2, Puzzle, Database, Bot, Palette, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, planRequired, currentPlanName, onClick, isAvailable, playSound }) => {
  const planHierarchy = { 'Gratuito': 0, 'Plus': 1, 'Pro': 2, 'Interplase': 3 };
  const requiredLevel = planHierarchy[planRequired] ?? 4;
  const currentLevel = planHierarchy[currentPlanName] ?? 0;
  
  const canAccess = isAvailable || (currentLevel >= requiredLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "circOut" }}
      className={`bg-card p-6 rounded-2xl shadow-lg border border-border/30 flex flex-col items-start justify-between transition-all duration-300 hover:shadow-primary/20 ${!canAccess ? 'opacity-70' : ''}`}
    >
      <div>
        <div className={`mb-4 p-3 rounded-full inline-block ${canAccess ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{description}</p>
      </div>
      {canAccess ? (
        <Button onClick={() => { onClick?.(); playSound?.('featureClick'); }} className="w-full mt-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-primary-foreground rounded-lg">
          <CheckCircle className="mr-2 h-5 w-5" /> Acessar Recurso
        </Button>
      ) : (
        <Button variant="outline" onClick={() => { onClick?.(); playSound?.('upgradePrompt'); }} className="w-full mt-auto border-primary/50 text-primary hover:bg-primary/10 rounded-lg">
          <Lock className="mr-2 h-4 w-4" /> Upgrade para {planRequired}
        </Button>
      )}
    </motion.div>
  );
};


const ExplorePage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { currentPlan, cyclePlan } = usePlan();

  const playSound = (type = 'click') => {
    console.log(`Simulating sound: ${type} on explore page`);
     if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const premiumFeatures = [
    { icon: Palette, title: "Geração Avançada de Imagens", description: "Crie imagens únicas e de alta qualidade com modelos de IA de ponta.", planRequired: "Pro", featureKey: "imageGeneration" },
    { icon: Bot, title: "Múltiplas IAs Externas", description: "Acesse e combine o poder de diversos modelos de IA (GPT-4, Claude, etc.).", planRequired: "Interplase", featureKey: "multipleIA" },
    { icon: Video, title: "Geração de Vídeo com IA", description: "Transforme texto e imagens em vídeos curtos com APIs como RunwayML.", planRequired: "Interplase", featureKey: "videoGeneration" },
    { icon: FileText, title: "Upload e Análise de Arquivos", description: "Envie PDFs, DOCX e TXTs para que a IA analise e resuma.", planRequired: "Interplase", featureKey: "fileUpload" },
    { icon: Share2, title: "Integração com APIs Externas", description: "Conecte seus próprios serviços e dados via Webhooks ou REST APIs.", planRequired: "Interplase", featureKey: "apiIntegration" },
    { icon: Puzzle, title: "Automação com Make.com", description: "Crie fluxos de trabalho automatizados e conecte centenas de apps.", planRequired: "Pro", featureKey: "makeIntegration" },
    { icon: Database, title: "Plugins e Comandos Inteligentes", description: "Use comandos como /criar-video ou /analisar-pdf para ações rápidas.", planRequired: "Interplase", featureKey: "plugins" },
  ];

  const simulatedIntegrations = [
    { name: "YouTube", icon: Youtube, color: "text-red-500", description: "Resumir vídeos, encontrar informações." },
    { name: "Notion", icon: FileText, color: "text-gray-700 dark:text-gray-300", description: "Criar páginas, organizar notas." },
    { name: "Google Docs", icon: FileText, color: "text-blue-500", description: "Escrever textos, colaborar em documentos." },
  ];


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
                Explorar Recursos Premium
              </h1>
            </div>
             <Button onClick={() => { cyclePlan(); playSound('cyclePlan'); }} size="sm" variant="outline" className="rounded-md">
               Simular Upgrade: {currentPlan.name === 'Interplase' ? 'Gratuito' : currentPlan.name === 'Gratuito' ? 'Plus' : currentPlan.name === 'Plus' ? 'Pro' : 'Interplase'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <Zap size={48} className="mx-auto mb-4 text-primary opacity-80" />
            <h2 className="text-3xl font-semibold mb-2">Desbloqueie Todo o Potencial do ChatPro AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossos planos premium oferecem ferramentas avançadas para levar sua produtividade e criatividade a novos patamares.
              Seu plano atual é: <span className="font-semibold text-primary">{currentPlan.name}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {premiumFeatures.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                planRequired={feature.planRequired}
                currentPlanName={currentPlan.name}
                isAvailable={currentPlan.features[feature.featureKey]}
                onClick={() => { if (!(currentPlan.features[feature.featureKey] || (currentPlan.name === 'Interplase' && feature.planRequired === 'Interplase'))) cyclePlan(); }}
                playSound={playSound}
              />
            ))}
          </div>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">Integrações (Simulação Visual)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {simulatedIntegrations.map((integration) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.3, delay:0.1 * simulatedIntegrations.indexOf(integration)}}
                  className="bg-card p-6 rounded-2xl shadow-lg border border-border/30 flex flex-col items-center text-center hover:shadow-primary/10"
                >
                  <integration.icon size={40} className={`mb-3 ${integration.color}`} />
                  <h4 className="text-lg font-medium mb-1">{integration.name}</h4>
                  <p className="text-xs text-muted-foreground">{integration.description}</p>
                  <Button variant="link" size="sm" className="mt-3 text-primary/80" disabled>Conectar (Em breve)</Button>
                </motion.div>
              ))}
            </div>
             <p className="text-center text-sm text-muted-foreground mt-6">
                Estas são simulações visuais. A integração real com estas plataformas será adicionada em futuras atualizações para planos específicos.
            </p>
          </section>


        </motion.div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/30 mt-10">
        © {new Date().getFullYear()} ChatPro Interplase AI. Explore o futuro da IA.
      </footer>
    </div>
  );
};

export default ExplorePage;