# Landing Page de Experimentação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular `/` como uma landing executiva que apresenta os benefícios do ProjectFlow e leva o visitante diretamente ao dashboard, sem preço ou cadastro obrigatório.

**Architecture:** A alteração fica em um único componente de página e um teste de integração. `Landing.tsx` usa pequenos arrays locais para benefícios e passos, renderiza uma prévia decorativa em HTML/CSS e usa `Link` para navegação interna; nenhuma camada, dependência ou componente compartilhado novo será criado.

**Tech Stack:** React 18, React Router, TypeScript, Tailwind CSS, Lucide, componentes shadcn existentes, Vitest e Testing Library.

## Global Constraints

- Preservar `/` para a landing e `/dashboard` para o produto.
- Padronizar a marca como `ProjectFlow`.
- Remover preço, checkout, urgência promocional e renderização de `SignupPopup`.
- Não adicionar cadastro, autenticação, estado local, persistência, backend, imagens externas ou dependências.
- Todos os CTAs de experimentação e `Entrar` apontam para `/dashboard` na mesma aba.
- Usar âncoras `#beneficios` e `#como-funciona` para navegação interna.
- Usar linguagem executiva baseada em previsibilidade, riscos, alocação e decisões data-driven.
- Respeitar acessibilidade, foco visível e responsividade sem overflow.

---

## File Structure

- Modify `src/pages/Landing.tsx`: estrutura, conteúdo e apresentação completa da landing.
- Create `src/pages/Landing.test.tsx`: contrato público, navegação e remoção da experiência comercial anterior.

### Task 1: Entregar a landing orientada à experimentação

**Files:**
- Modify: `src/pages/Landing.tsx`
- Create: `src/pages/Landing.test.tsx`

**Interfaces:**
- Consumes: `Link` de `react-router-dom`, `Button` de `@/components/ui/button` e ícones Lucide já instalados.
- Produces: componente default `Landing`, renderizado pela rota `/` existente.

- [ ] **Step 1: Escrever os testes do contrato público**

Criar `src/pages/Landing.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Landing from './Landing';

const renderPage = () => render(<MemoryRouter><Landing /></MemoryRouter>);

describe('Landing', () => {
  it('apresenta a proposta de valor e os benefícios executivos', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Transforme projetos em decisões previsíveis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Previsibilidade do portfólio' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Riscos antecipados' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Alocação transparente' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Decisões data-driven' })).toBeInTheDocument();
  });

  it('leva todas as ações do produto diretamente ao dashboard', () => {
    renderPage();
    const links = screen.getAllByRole('link', { name: /Experimentar grátis|Entrar/ });
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach(link => expect(link).toHaveAttribute('href', '/dashboard'));
  });

  it('expõe navegação interna e o fluxo de três passos', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Benefícios' })).toHaveAttribute('href', '#beneficios');
    expect(screen.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '#como-funciona');
    const flow = screen.getByRole('region', { name: 'Como funciona' });
    expect(within(flow).getByText('Planeje')).toBeInTheDocument();
    expect(within(flow).getByText('Acompanhe')).toBeInTheDocument();
    expect(within(flow).getByText('Decida')).toBeInTheDocument();
  });

  it('remove preço, checkout, urgência e cadastro obrigatório', () => {
    renderPage();
    expect(screen.queryByText(/R\$|TEMPO LIMITADO|Plano de Inauguração/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText(/Cadastrar e Explorar/i)).not.toBeInTheDocument();
  });

  it('marca a prévia do produto como ilustração não interativa', () => {
    renderPage();
    expect(screen.getByRole('img', { name: 'Prévia do dashboard executivo do ProjectFlow' })).toHaveAttribute('aria-hidden', 'false');
    expect(screen.queryByRole('button', { name: /alerta|progresso|alocação/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Executar o teste para confirmar RED**

Run: `npm test -- src/pages/Landing.test.tsx`

Expected: FAIL porque a página atual usa outro título, preço, checkout e `SignupPopup`.

- [ ] **Step 3: Substituir a implementação da landing**

Em `src/pages/Landing.tsx`:

- remover `useState`, `useNavigate`, `SignupPopup`, preço e chamadas externas;
- importar `Link`, `Button` e somente os ícones necessários;
- definir arrays locais `benefits` e `steps` com os textos exatos da especificação;
- renderizar `header`, `main` e `footer` sem estado;
- usar `<Button asChild><Link to="/dashboard">Experimentar grátis</Link></Button>` em todos os CTAs;
- usar `<a href="#beneficios">Benefícios</a>` e `<a href="#como-funciona">Como funciona</a>`;
- adicionar `id="beneficios"` e `id="como-funciona"` nas seções;
- marcar a composição visual com `role="img"`, `aria-label="Prévia do dashboard executivo do ProjectFlow"` e `aria-hidden="false"`;
- usar somente elementos não interativos dentro da prévia;
- incluir `motion-reduce:animate-none` em qualquer animação CSS existente;
- manter o conteúdo principal dentro de larguras responsivas e usar `min-w-0` onde necessário.

Estrutura mínima do hero:

```tsx
<main>
  <section className="container grid items-center gap-12 py-16 lg:grid-cols-[1fr_0.95fr] lg:py-24">
    <div className="min-w-0">
      <p>Gestão de projetos orientada por dados</p>
      <h1>Transforme projetos em decisões previsíveis</h1>
      <p>Conecte prazos, riscos, progresso e alocação...</p>
      <Button asChild size="lg"><Link to="/dashboard">Experimentar grátis</Link></Button>
      <p>Explore agora, sem cadastro.</p>
    </div>
    <div role="img" aria-label="Prévia do dashboard executivo do ProjectFlow" aria-hidden="false">
      <p>Progresso do portfólio</p>
      <strong>68%</strong>
      <p>2 riscos exigem atenção</p>
      <p>6 profissionais alocados</p>
    </div>
  </section>
</main>
```

- [ ] **Step 4: Executar o teste e confirmar GREEN**

Run: `npm test -- src/pages/Landing.test.tsx`

Expected: 5 testes passam.

- [ ] **Step 5: Verificar acessibilidade estrutural e responsividade por contrato**

Adicionar ao teste existente:

```tsx
it('possui regiões estruturais e composição responsiva', () => {
  renderPage();
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  expect(screen.getByTestId('landing-hero')).toHaveClass('lg:grid-cols-[1fr_0.95fr]');
});
```

Run: `npm test -- src/pages/Landing.test.tsx`

Expected: 6 testes passam.

- [ ] **Step 6: Executar verificações completas**

Run: `npm test`

Expected: todos os testes passam.

Run: `npx --no-install eslint src/pages/Landing.tsx src/pages/Landing.test.tsx`

Expected: nenhuma saída e exit code 0.

Run: `npm run build`

Expected: build de produção concluído.

Run: `git diff --check -- src/pages/Landing.tsx src/pages/Landing.test.tsx`

Expected: nenhuma falha de whitespace.

- [ ] **Step 7: Verificar escopo e commit**

Run: `git status --short`

Expected: os arquivos da landing aparecem junto de eventuais alterações preexistentes, que não devem ser incluídas.

```bash
git add src/pages/Landing.tsx src/pages/Landing.test.tsx
git commit -m "feat: focus landing page on product experimentation"
```
