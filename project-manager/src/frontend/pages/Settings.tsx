import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, Bell, User, Palette, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApiConfig } from '@/contexts/ApiConfigContext';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { config, setConfig } = useApiConfig();
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Sync with context changes
  useEffect(() => {
    setBaseUrl(config.baseUrl);
    setApiKey(config.apiKey);
  }, [config]);

  const handleSave = () => {
    setConfig({ baseUrl, apiKey });
    alert('Configurações de API salvas.');
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie as preferências do seu workspace
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue="Usuário Athena" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="usuario@empresa.com" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Aparência</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Tema</p>
              <p className="text-xs text-muted-foreground">
                Alternar entre modo claro e escuro
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <><Sun className="h-4 w-4 mr-2" /> Claro</>
              ) : (
                <><Moon className="h-4 w-4 mr-2" /> Escuro</>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email de alertas</p>
                <p className="text-xs text-muted-foreground">Receber alertas de risco por email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Resumo semanal</p>
                <p className="text-xs text-muted-foreground">Receber relatório semanal de projetos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Notificações push</p>
                <p className="text-xs text-muted-foreground">Notificações no navegador</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Integração API */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Integração API</h2>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input id="baseUrl" placeholder="http://localhost:20128/v1" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" placeholder="Sua API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar alterações</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
