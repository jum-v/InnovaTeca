import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, GraduationCap } from "lucide-react";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (data: any, type: 'company' | 'university') => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal = ({ open, onOpenChange, onRegister, onSwitchToLogin }: RegisterModalProps) => {
  const [userType, setUserType] = useState<'company' | 'university'>('company');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnpj: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData, userType);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar conta</DialogTitle>
          <DialogDescription>
            Junte-se à maior plataforma de inovação tecnológica do Brasil.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="company" onValueChange={(v) => setUserType(v as 'company' | 'university')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="university" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Universidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  placeholder="Sua Empresa S.A."
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">E-mail Corporativo</Label>
                <Input
                  id="company-email"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-cnpj">CNPJ (Opcional)</Label>
                <Input
                  id="company-cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-password">Senha</Label>
                <Input
                  id="company-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="hero" className="w-full">
                Criar Conta
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="university" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uni-name">Nome da Universidade</Label>
                <Input
                  id="uni-name"
                  placeholder="Universidade Federal de..."
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uni-email">E-mail Institucional</Label>
                <Input
                  id="uni-email"
                  type="email"
                  placeholder="nit@universidade.edu.br"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uni-password">Senha</Label>
                <Input
                  id="uni-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="hero" className="w-full">
                Criar Conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Entrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
