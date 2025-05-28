import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import { DialogFooter, DialogClose } from '@/components/ui/dialog'; // Import DialogClose

const AgentForm = ({ agent, onSave, onCancel, playSound }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [promptBase, setPromptBase] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (agent) {
      setName(agent.name || '');
      setAvatar(agent.avatar || '🤖');
      setDescription(agent.description || '');
      setPromptBase(agent.promptBase || '');
    } else {
      setName('');
      setAvatar('🤖');
      setDescription('');
      setPromptBase('');
    }
  }, [agent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !avatar.trim()) {
      toast({ title: "Erro de Validação", description: "Nome e Avatar são obrigatórios.", variant: "destructive" });
      playSound?.('error');
      return;
    }
    onSave({ name, avatar, description, promptBase });
    playSound?.('save');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div>
        <Label htmlFor="agent-name" className="text-sm font-medium">Nome do Agente</Label>
        <Input id="agent-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Especialista em Marketing" className="mt-1 bg-input/70 focus:bg-input rounded-lg border-border/70 focus:border-primary/70" />
      </div>
      <div>
        <Label htmlFor="agent-avatar" className="text-sm font-medium">Avatar (Emoji)</Label>
        <Input id="agent-avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Ex: ✨" className="mt-1 bg-input/70 focus:bg-input rounded-lg border-border/70 focus:border-primary/70" />
      </div>
      <div>
        <Label htmlFor="agent-description" className="text-sm font-medium">Descrição Curta</Label>
        <Textarea id="agent-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Ajuda a criar campanhas de marketing eficazes." className="mt-1 bg-input/70 focus:bg-input rounded-lg min-h-[80px] border-border/70 focus:border-primary/70" />
      </div>
      <div>
        <Label htmlFor="agent-prompt" className="text-sm font-medium">Instruções Base (Prompt do Sistema)</Label>
        <Textarea id="agent-prompt" value={promptBase} onChange={(e) => setPromptBase(e.target.value)} placeholder="Ex: Você é um especialista em marketing digital com 10 anos de experiência. Responda de forma concisa e direta..." className="mt-1 bg-input/70 focus:bg-input rounded-lg min-h-[120px] border-border/70 focus:border-primary/70" />
      </div>
      <DialogFooter className="sm:justify-end gap-2 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={() => { onCancel(); playSound?.('cancel'); }} className="rounded-md">Cancelar</Button>
        </DialogClose>
        <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-primary-foreground rounded-md">
          <Save className="mr-2 h-4 w-4" /> Salvar Agente
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AgentForm;