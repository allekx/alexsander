# CLAUDE.md — Identidade Web

Guia de desenvolvimento do site institucional da **Identidade Web** (criação de sites profissionais, link na bio e presença digital para pequenas empresas no Brasil). Deploy via **GitHub Pages** em `identidadeweb.com`.

---

## Visão geral do projeto

- **Stack:** HTML5 + CSS3 + JavaScript puro. **Sem build tooling, sem package.json, sem dependências.**
  - `index.html` e `bio/index.html`: CSS e JS **embutidos**.
  - Páginas de case em `projetos/`: CSS e JS **compartilhados** (`projetos/case.css` + `projetos/case.js`).
- **Deploy:** GitHub Pages (arquivo `CNAME` aponta para `identidadeweb.com`).
- **Fontes:** Google Fonts, **Inter** (corpo) + **Sora** (títulos). Sora substituiu Poppins.
- **Sem imagens de background na seção de logos** (decisão deliberada).

### Estrutura de arquivos

```
identidade web/
├── index.html                 ← Página principal (~2.093 linhas)
├── bio/index.html              ← Página "link na bio" (ciano/verde, ainda destoa)
├── projetos/
│   ├── shekinah.html          ← Case Sítio Shekinah
│   ├── celus.html             ← Case Escola Celus
│   ├── loja-lm.html            ← Case Loja LM
│   ├── case.css               ← Estilos das páginas de case (header, layout, CTA)
│   └── case.js                ← WhatsApp, menu mobile, header scrolled, reveal
├── assets/
│   ├── Logo celus (1).png
│   ├── anadem.png
│   ├── elite corte.png
│   ├── identidadeweb modelo.png   ← banner/imagem do hero
│   ├── logo identidade web.png    ← logo da marca (referenciada no HTML)
│   ├── logo_seguremed.png
│   ├── mariana-costa.jpg            ← avatar de depoimento
│   ├── odonto prime.png
│   ├── carrossel celus.png          ← mockup do case Celus
│   └── telas shekinah.png          ← telas do sistema Shekinah
├── prints/                    ← Screenshots de verificação
└── CNAME                      ← identidadeweb.com
```

> Arquivos com espaços/parênteses usam URL-encoding no HTML (ex.: `assets/elite%20corte.png`, `assets/Logo%20celus%20(1).png`, `assets/telas%20shekinah.png`). Preserve esse padrão.

> Imagem ainda pendente: `assets/loja lm.png` (card e case da Loja LM). Sem o arquivo, o overlay navy + texto permanece via `onerror="this.hidden=true"`.

---

## O que já foi implementado

### Header / Menu de navegação
- **Header fixo** com faixa azul de 3px no topo e dois estados:
  - **Sem rolagem:** barra branca full-width, conteúdo com `width: calc(100% - 4rem)` (2rem de margem). Cantos retos.
  - **Scrolled:** `.header.scrolled` fica transparente e `.header-inner` vira **pill** (`border-radius: 999px`, blur, sombra) limitada pelo `.container`.
- **CTA WhatsApp** (`.nav-cta`): pill suave. Usa `.main-nav .nav-cta` para vencer `.main-nav a`.
- **Menu mobile** (<900px): drawer, overlay, fecha por X, link, overlay ou Escape.
- **Itens do menu:** Solução, **Projetos**, Serviços, Resultados, Contato.

### Hero
- Fundo navy (`#0B1F38 → #0A2540 → #0D2B4E`), textos claros, destaque em gradiente no trecho "no Google".
- No mobile (≤899px): imagem (`.hero-visual`) antes do texto (`.hero-copy`).
- CTA único: "Quero minha estrutura digital".

### Carrossel de logos (`.logos-strip`)
- Entre o hero e a seção problema.
- 5 logos: Anadem, Elite Corte, Celus, Seguremed, Odonto Prime.
- Loop CSS + duplicação do track no JS. Espaçamento em `margin-right` nos `.logo-item` (não `gap`).
- Sem card/background nas logos; pause no hover.

### Portfólio (`.portfolio-section`, `id="projetos"`)
- Entre **Solução/benefícios** e **Serviços**.
- 3 cards editoriais (não cards pequenos):
  1. **Sítio Shekinah** — Sistema Web · Gestão → `projetos/shekinah.html`
  2. **Escola Celus** — Site Institucional · Web Design → `projetos/celus.html`
  3. **Loja LM** — Catálogo Online · Web Design (bolsas personalizadas) → `projetos/loja-lm.html`
- Layout desktop: mídia + conteúdo lado a lado; o 2º card usa `.portfolio-card--reverse`.
- Visual da mídia: chrome de navegador + foto de fundo + overlay navy + título/rótulo no centro (`.portfolio-placeholder--photo`).
- Sem a imagem, o card permanece navy com o texto. `onerror` esconde o `<img>` quebrado.
- **Trendy Geek foi removido** e substituído pela Loja LM. Não reintroduzir.

### Páginas de case (`projetos/`)
- Páginas objetivas, mesma identidade do site (navy `#0A2540`, azul `#3B82F6`, Sora + Inter).
- Conteúdo: breadcrumb, contexto, desafio, solução, características, resultado, tags, CTA WhatsApp, links para os outros cases.
- Header/footer/WhatsApp flutuante equivalentes ao index; o menu aponta para `../index.html#...`.
- Copy **sem travessão (—)**.

### Seções do corpo (index)
- **Problema** (navy): 3 cards.
- **Solução** + benefícios (4 cards).
- **Serviços** (cinza): 6 cards.
- **Depoimentos**: 3 cards (2 Unsplash, 1 `mariana-costa.jpg`).
- **Stats**: 100+ / 300+ / 95% via IntersectionObserver.
- **Oferta**: R$ 3,90 no 1º mês e R$ 890/ano.
- **CTA final** + **formulário Zoho** (iframe).

### Responsividade
- `html`/`body`: `overflow-x: hidden` + `overflow-x: clip`.
- Botões full-width ≤640px.
- Portfólio em uma coluna no mobile (imagem primeiro).

---

## Decisões de design

| Tema | Decisão |
|------|---------|
| **Paleta** | Navy `#0A2540` + accent `#3B82F6` no index e nos cases. Bio ainda usa ciano/verde. |
| **Tipografia** | Sora (títulos) + Inter (corpo). |
| **Menu** | Full-width reto no topo; ao rolar, pill. Item **Projetos** no menu. |
| **Portfólio** | Cards grandes, chrome + overlay + texto. Foto de fundo quando existir. |
| **Cases** | Páginas curtas e comerciais, não longas. CSS/JS em arquivos à parte só nessa pasta. |
| **Copy** | Curta, premium, **sem travessão (—)**. |
| **Logos** | Sem card, sempre coloridas. |

---

## Problemas conhecidos / observações

1. **`bio/index.html`** ainda destoa (ciano/verde). Não foi alinhado à identidade navy/Sora.
2. **`assets/loja lm.png`** ainda não está no repo. Card e case da Loja LM usam placeholder até o arquivo existir.
3. **Código morto / linhas em branco** no `index.html` e bloco comentado no `bio`.
4. **Depoimentos Unsplash** dependem de CDN externa.
5. **`prints/`** são screenshots de diagnóstico commitados, não fazem parte do produto.
6. **Formulário Zoho**: iframe com altura fixa.
7. **Logo da marca** é referenciada como `assets/logo identidade web.png` no HTML; conferir se o arquivo está presente no deploy.

---

## O que ainda falta fazer

- [ ] **Adicionar `assets/loja lm.png`** e conferir o card + a página `projetos/loja-lm.html`.
- [ ] **Unificar o `bio/index.html`** com Sora, navy/azul e copy premium.
- [ ] **Revisar código morto** no `index.html` e no `bio`.
- [ ] **Decidir sobre o formulário Zoho** (iframe vs. link direto).
- [ ] **Conferir o deploy** no GitHub Pages (caminhos com `%20`).
- [ ] **Decidir sobre `prints/`** no repo.
- [ ] Confirmar o **favicon** (`logo identidade web.png`).

---

## Instruções importantes para continuar o desenvolvimento

- **Nada de build/bundlers.** Index: CSS/JS embutidos. Cases: edite `projetos/case.css` e `projetos/case.js` (vale para as 3 páginas).
- **Não redesenhar o index** ao mexer em cases. No index, altere só o necessário (ex.: um novo card de portfólio + link).
- **Novo case:** criar `projetos/nome.html` no mesmo molde, incluir no grid de `#projetos` e nos blocos "Mais projetos" das outras páginas.
- **Especificidade CSS** no index: `.main-nav .nav-cta` vence `.main-nav a`.
- **Imagens com espaços:** URL-encoding nos `src`. Conferir o nome exato em `assets/`.
- **Marquee de logos:** `margin-right` nos `.logo-item` + duplicação do track no JS.
- **Copy:** não usar travessão (—). Preferir vírgula ou dois-pontos.
- **Verificação mobile:** viewport ~390px e `overflow-x: clip`.
- **Commit:** o usuário comita manualmente, mensagens curtas em pt-BR. Não force push.
- **Diagnóstico:** `python -m http.server <porta>` e abrir `index.html` e `projetos/*.html`.
