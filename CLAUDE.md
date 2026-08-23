# CLAUDE.md — Identidade Web

Guia de desenvolvimento do site institucional da **Identidade Web** (criação de sites profissionais, link na bio e presença digital para pequenas empresas no Brasil). Deploy via **GitHub Pages** em `identidadeweb.com`.

---

## Visão geral do projeto

- **Stack:** HTML5 + CSS3 (embutido em `<style>`) + JavaScript puro (embutido em `<script>`). **Sem build tooling, sem package.json, sem dependências.**
- **Deploy:** GitHub Pages (arquivo `CNAME` aponta para `identidadeweb.com`).
- **Fontes:** Google Fonts — **Inter** (corpo) + **Sora** (títulos/títulos de seção). Sora substituiu Poppins para um visual mais premium.
- **Sem imagens de background na seção de logos** (decisão deliberada — ver abaixo).

### Estrutura de arquivos

```
identidade web/
├── index.html          ← Página principal (site completo, ~1.799 linhas)
├── bio/index.html      ← Página "link na bio" (identidade visual própria, ciano/verde)
├── assets/             ← Imagens (logos de clientes, banner do hero, logo da marca)
│   ├── Logo celus (1).png
│   ├── anadem.png
│   ├── elite corte.png
│   ├── identidadeweb modelo.png   ← banner/imagem do hero
│   ├── logo identidade web.png     ← logo da marca
│   ├── logo_seguremed.png
│   ├── mariana-costa.jpg           ← avatar de depoimento
│   └── odonto prime.png
├── prints/             ← Screenshots de verificação (top, scrolled, bottom, logos-strip)
└── CNAME               ← identidadeweb.com
```

> ⚠️ **Arquivos com espaços/parênteses** são referenciados com URL-encoding no HTML (ex.: `assets/elite%20corte.png`, `assets/Logo%20celus%20(1).png`). Preserve esse padrão ao adicionar novas imagens.

---

## O que já foi implementado

### Header / Menu de navegação
- **Header fixo** com faixa azul de 3px no topo (sempre visível) e transição entre dois estados:
  - **Estado inicial (sem rolagem):** barra branca **full-width** (100% da tela), conteúdo com `width: calc(100% - 4rem)` → **2rem de margem** em cada lado. Cantos retos (`border-radius: 0`). A logo fica ~2rem da borda esquerda e o botão WhatsApp ~2rem da direita.
  - **Estado scrolled:** a barra full-width some (`.header.scrolled` volta a `background: transparent`), e o `.header-inner` colapsa suavemente para uma **pill branca arredondada** (`border-radius: 999px`, blur, sombra) limitada pelo `.container` (max 1120px).
  - Transições animadas: `width`, `margin`, `border-radius` (0.5s), `background`, `box-shadow`.
- **CTA do WhatsApp no menu** (`.nav-cta`): pill suave — fundo azul-claro translúcido, borda fina azul, texto navy, ícone WhatsApp verde. No hover preenche com o gradiente da marca e fica branco. **Importante:** usa o seletor `.main-nav .nav-cta` (especificidade maior) porque `.main-nav a` sobrescreveria o padding.
- **Menu mobile** (drawer lateral, <900px): abre com hambúrguer, tem **cabeçalho próprio** com rótulo "Menu" e **botão X de fechar** (`.nav-close`, rotaciona 90° no hover). Overlay com escurecimento, fecha por X, link, overlay ou tecla Escape. `visibility: hidden` quando fechado (corrige vazamento de barra branca).

### Hero
- **Fundo escuro navy sofisticado** (`#0B1F38 → #0A2540 → #0D2B4E`) com radiais azuis de profundidade.
- Textos invertidos para legibilidade: h1 branco, trecho destacado "no Google" com gradiente azul-claro (text-clip), subtítulo cinza-claro, badge azul-claro, trust items claros.
- Elementos flutuantes: chip "Online e no Google" (branco) e "Sites que convertem" (**glass escuro** — branco 10% + blur).
- **No mobile (≤899px):** a imagem (`.hero-visual`, `order: -1`) aparece **antes** do texto (`.hero-copy`, `order: 2`).
- CTAs: botão primário único ("Quero minha estrutura digital"). O botão secundário "Falar no WhatsApp" foi removido (ficava comentado).

### Carrossel de logos de clientes (`.logos-strip`)
- Seção entre o hero e a seção "problema".
- **5 logos:** Anadem, Elite Corte, Celus, Seguremed, Odonto Prime.
- **Animação CSS pura** (`@keyframes logos-scroll`, `translateX(0) → -50%`, 30s linear infinite), da direita para a esquerda.
- **Loop infinito perfeito:** o JS duplica o track (`logosTrack.innerHTML += logosTrack.innerHTML`) e o espaçamento vive em `margin-right` nos `.logo-item` (não em `gap` do track) para que `-50%` coincida exatamente com o início da segunda cópia.
- **Sem background/card** nas logos: imagens soltas, sempre coloridas (sem grayscale, sem hover de cor). Fundo com fade nas laterais via `mask-image`.
- Pausa no hover (`animation-play-state: paused`).

### Seções do corpo
- **Problema** (fundo navy): 3 cards — Sem site profissional, Invisível no Google, Clientes escapando.
- **Solução** — "Tudo o que seu negócio precisa, em um só lugar." + caixa de solução + "O que você ganha" com 4 benefícios.
- **Serviços** (fundo cinza): 6 cards — Site profissional, Link na bio, SEO para Google, Domínio, Hospedagem, E-mail profissional.
- **Depoimentos**: 3 cards (2 com fotos do Unsplash, 1 local `mariana-costa.jpg`).
- **Stats**: contadores animados (100+ clientes, 300+ sites, 95%) via IntersectionObserver.
- **Oferta**: 2 cards de preço (R$ 3,90/mês e R$ 890/ano) + "valor percebido do pacote".
- **CTA final** + **formulário Zoho** (iframe embutido em `.form-wrap`).

### Copy encurtada (redesign "clean/premium")
Todos os textos foram reduzidos para versões curtas e diretas. Exemplos:
- Hero h1: "Seu negócio no Google e no Instagram, com autoridade."
- Hero sub: "Site, link na bio, SEO e domínio em um só lugar, pronto para atrair clientes."
- Seção serviços: cards de 1 frase (ex.: "SEO para Google — Otimização para buscas locais e mais relevância com o tempo.").
- Value-stack: quebras de linha estranhas corrigidas ("Comece por apenas R$ 3,90 no primeiro mês · depois R$ 89/mês.").

### Responsividade / correções de overflow
- `html` e `body` têm `overflow-x: hidden` + `overflow-x: clip` (corta qualquer transbordo lateral).
- `.section-lead` com `margin-inline: auto` (margem direita fixa removida).
- `.hero-grid` sem margins negativos no mobile.
- Botões full-width em telas ≤640px.
- `.offer-card` com padding reduzido em ≤480px.
- iframe Zoho envolto em `.form-wrap` (`overflow: hidden`).

---

## Decisões de design

| Tema | Decisão |
|------|---------|
| **Paleta** | Navy `#0A2540` + accent azul `#3B82F6` no index. Bio usa ciano `#06B6D4` + verde `#10B981`. |
| **Tipografia** | Sora (títulos) + Inter (corpo). Sora substituiu Poppins por um visual mais premium/geométrico. |
| **Menu inicial** | Barra branca full-width com cantos retos e margem de 2rem; só ao rolar vira pill arredondada. |
| **Carrossel de logos** | Logos **sem card/background**, sempre **coloridas**, loop infinito via CSS + duplicação do track. Sem efeito hover de cor. |
| **Hero** | Fundo navy escuro, textos claros, destaque em gradiente. No mobile a imagem vem antes do texto. |
| **Botões** | Pill arredondados (999px). Primário com gradiente azul. `.nav-cta` com estilo suave translúcido. |
| **Copy** | Textos curtos e diretos, tom premium. |

---

## Problemas conhecidos / observações

1. **`bio/index.html`** tem identidade visual **diferente** do index (ciano/verde vs. navy/azul). Se o objetivo é unificar a marca, falta alinhar o `bio` ao novo padrão (fonte Sora, paleta, copy curta). **Não foi tocado nesta rodada.**
2. **Código morto / linhas em branco extras** no `index.html`: há linhas vazias isoladas (ex.: ~1402, ~1583, ~1440-1444) e um bloco de serviços comentado no `bio`. Não quebram nada, mas sujam o arquivo.
3. **Depoimentos usam fotos do Unsplash** (externas) — dependem de CDN de terceiros.
4. **`prints/` contém screenshots de diagnóstico** (top, scrolled, bottom, logos-strip) que foram commitados. São utilitários de verificação, não fazem parte do produto.
5. **Formulário Zoho** é um iframe de terceiros (500px de altura fixa). Qualquer mudança de layout do form é externa.
6. **Testes/verificação** foram feitos com **Chrome headless via puppeteer-core** (instalado ad-hoc, removido depois — não deixar `package.json`/`node_modules` no repo).

---

## O que ainda falta fazer

- [ ] **Unificar o `bio/index.html`** com a nova identidade (Sora, navy/azul, copy premium) — hoje destoa do site principal.
- [ ] **Revisar e remover código morto**: linhas em branco extras no `index.html` e bloco de portfólio comentado no `bio`.
- [ ] **Decidir sobre o formulário Zoho**: manter iframe ou substituir por link direto (o iframe tem altura fixa e pode não ser responsivo idealmente).
- [ ] **Conferir o deploy em produção** (GitHub Pages) após os últimos commits para garantir que nada quebrou (especialmente os caminhos de imagens com espaços).
- [ ] **Decidir se os screenshots em `prints/`** devem continuar no repo ou ser movidos para fora/gitignore.
- [ ] Considerar **favicon/apple-touch-icon** já referenciados — confirmar que `logo identidade web.png` funciona bem como ícone (é usado em várias resoluções).

---

## Instruções importantes para continuar o desenvolvimento

- **Nada de build/bundlers**: edite direto os HTMLs. CSS e JS são embutidos no `<head>` e no fim do `<body>`.
- **Especificidade CSS importa muito** aqui: seletores como `.main-nav .nav-cta` foram usados para vencer `.main-nav a`. Ao estilizar elementos dentro de containers existentes, verifique a especificidade antes de assumir que a regra será aplicada.
- **Imagens com espaços**: sempre use URL-encoding nos `src` (`%20` para espaços, parênteses literais funcionam). Confira nomes exatos em `assets/`.
- **Loop infinito do marquee**: se ajustar espaçamento, mantenha o `margin-right` nos `.logo-item` (não `gap` no track) e a duplicação do track no JS — é o que garante o `translateX(-50%)` sem salto.
- **Verificação mobile**: o projeto já teve problemas de overflow lateral no mobile (barra branca). Ao adicionar elementos, confira em viewport ~390px e lembre dos guards `overflow-x: clip`.
- **Commit**: o usuário comita manualmente com mensagens curtas em pt-BR (ex.: "section empresas", "correção da barra lateral mobile"). Não force push.
- **Diagnóstico rápido**: pode-se usar `python -m http.server <porta>` + Chrome headless com puppeteer-core (instalar ad-hoc e remover depois) para validar imagens carregando, animações e overflow.
