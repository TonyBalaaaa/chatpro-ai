export const initialAgentsData = [
  { id: 'coach', name: 'Coach', description: 'Seu coach pessoal para metas e desenvolvimento.', avatar: '🧠', promptBase: 'Você é um coach motivacional e experiente. Ajude o usuário a definir metas claras e a superar obstáculos com conselhos práticos e encorajadores.', isCustom: false },
  { id: 'redator', name: 'Redator', description: 'Assistente de escrita criativa e profissional.', avatar: '✍️', promptBase: 'Você é um redator publicitário e de conteúdo altamente criativo. Ajude o usuário a criar textos persuasivos, originais e gramaticalmente corretos para diversas finalidades.', isCustom: false },
  { id: 'dev', name: 'Dev', description: 'Auxiliar de desenvolvimento de software.', avatar: '💻', promptBase: 'Você é um desenvolvedor sênior full-stack. Forneça explicações claras sobre conceitos de programação, ajude a depurar código e sugira as melhores práticas de desenvolvimento.', isCustom: false },
  { id: 'terapeuta', name: 'Terapeuta', description: 'Apoio emocional e bem-estar.', avatar: '❤️', promptBase: 'Você é um terapeuta compassivo e atencioso. Ofereça um espaço seguro para o usuário expressar seus sentimentos, valide suas emoções e sugira técnicas de coping e bem-estar. Lembre-se que você não substitui um profissional de saúde mental.', isCustom: false },
  { id: 'estrategista', name: 'Estrategista', description: 'Consultor para negócios e planejamento.', avatar: '📈', promptBase: 'Você é um estrategista de negócios experiente. Ajude o usuário a analisar cenários, desenvolver planos de negócios, identificar oportunidades e tomar decisões estratégicas informadas.', isCustom: false },
];

export const USER_PLANS = {
  FREE: {
    name: 'Gratuito',
    maxMessages: 10,
    allowedAgents: ['coach'], // Only coach by default
    maxCustomAgents: 1,
    features: {
      history: false, // No history
      voice: false,
      imageGeneration: false,
      customAgents: true, // Can create 1 custom agent
      exportChat: false,
    }
  },
  PLUS: {
    name: 'Plus',
    maxMessages: 50, // Changed from 100 to 50 as per user request
    allowedAgents: ['coach', 'redator', 'dev', 'terapeuta', 'estrategista'], // All default agents
    maxCustomAgents: 5,
    features: {
      history: 'local', // Local history
      voice: false,
      imageGeneration: true, // DALL-E access
      customAgents: true,
      exportChat: false,
    }
  },
  PRO: {
    name: 'Pro',
    maxMessages: Infinity,
    allowedAgents: ['all'], // All default agents
    maxCustomAgents: Infinity,
    features: {
      history: 'supabase', // Supabase history
      voice: true,
      imageGeneration: true,
      customAgents: true,
      exportChat: true, // Export to PDF
      makeIntegration: true, // Make.com integration
    }
  },
  INTERPLASE: {
    name: 'Interplase',
    maxMessages: Infinity,
    allowedAgents: ['all'],
    maxCustomAgents: Infinity,
    features: {
      history: 'supabase',
      voice: true,
      imageGeneration: true, // Advanced image generation
      customAgents: true,
      exportChat: true,
      makeIntegration: true,
      fileUpload: true, // PDF, DOCX, TXT
      videoGeneration: true, // RunwayML or Pictory
      apiIntegration: true, // Webhook/REST
      automationDashboard: true, // Panel for flows
      plugins: true, // Smart commands
      multipleIA: true, // Access to multiple external IAs
    }
  }
};