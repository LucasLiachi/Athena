import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Rocket } from 'lucide-react';

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'guerrillamail.net',
  'mailinator.com', 'yopmail.com', 'tempail.com', 'fakeinbox.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'dispostable.com',
  'trashmail.com', 'trashmail.net', 'trashmail.org', 'trashmail.me',
  'mailnesia.com', 'maildrop.cc', 'discard.email', 'tempmailo.com',
  'mohmal.com', 'burnermail.io', 'temp-mail.org', 'temp-mail.io',
  'emailondeck.com', 'getnada.com', 'mintemail.com', 'tempr.email',
  'throwawaymail.com', '10minutemail.com', '10minutemail.net',
  'mailcatch.com', 'tempinbox.com', 'fakemailgenerator.com',
  'crazymailing.com', 'mailscrap.com', 'harakirimail.com',
  'jetable.org', 'spamgourmet.com', 'mytemp.email', 'tmpmail.net',
  'tmpmail.org', 'bupmail.com', 'mailtemp.net', 'tempmail.ninja',
  'spam4.me', 'grr.la', 'guerrillamail.info', 'guerrillamail.de',
  'tmail.ws', 'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com',
  'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com',
  'superrito.com', 'teleworm.us',
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.includes(domain);
}

const STORAGE_KEY = 'athena_signup_done';

const SignupPopup = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    if (isDisposableEmail(email)) {
      setError('E-mails temporários não são aceitos. Use um e-mail real.');
      return;
    }

    localStorage.setItem(STORAGE_KEY, 'true');
    setSubmitted(true);
  };

  const handleClose = () => {
    if (submitted) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => !submitted && e.preventDefault()} onEscapeKeyDown={(e) => !submitted && e.preventDefault()}>
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">Bem-vindo ao Athena!</DialogTitle>
              <DialogDescription className="text-center">
                Cadastre-se para explorar a plataforma gratuitamente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nome</Label>
                <Input
                  id="signup-name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mail</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button type="submit" className="w-full" size="lg">
                Cadastrar e Explorar
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Sem spam. Seus dados estão seguros.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Cadastro realizado! 🎉</DialogTitle>
              <DialogDescription className="text-center">
                Bem-vindo, {name.split(' ')[0]}! Agora você pode explorar o Athena.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)} className="w-full" size="lg">
              Explorar a Plataforma
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignupPopup;
