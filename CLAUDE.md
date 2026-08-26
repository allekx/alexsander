# CLAUDE.md — Identidade Web

Guia de desenvolvimento do site institucional da **Identidade Web** (criação de sites profissionais, link na bio e presença digital para pequenas empresas no Brasil). Deploy via **GitHub Pages** em `identidadeweb.com`.

---

## Visão geral do projeto

- **Stack:** HTML5 + CSS3 + JavaScript puro. **Sem build tooling, sem package.json, sem dependências.**
  - `index.html` e `bio/index.html`: CSS e JS **embutidos**.
  - Páginas de case em `projetos/`: CSS e JS **compartilhados** (`projetos/case.css` + `projetos/case.js`).
- **Deploy:** GitHub Pages (arquivo `CNAME` aponta para `identidadeweb.com`).
- **Fontes:** Google Fonts, **Inter** (corpo) + **Sora** (títulos).
- **Sem imagens de background na seção de logos** (decisão deliberada).

### Estrutura de arquivos

```
identidade web/
├── index.html                 ← Página principal (site + widget Bob)
├── bio/index.html              ← Link na bio (navy + azul, compacta)
├── projetos/
│   ├── shekinah.html
│   ├── celus.html
│   ├── loja-lm.html
│   ├── case.css
│   └── case.js
├── assets/
│   ├── bob/
│   │   ├── bob-acenando.png
│   │   └── bob-beleza.png
│   ├── Logo celus (1).png
│   ├── anadem.png
│   ├── elite corte.png
│   ├── identidadeweb modelo.png
│   ├── logo identidade web.png
│   ├── logo_seguremed.png
│   ├── mariana-costa.jpg
│   ├── odonto prime.png
│   ├── carrossel celus.png
│   └── telas shekinah.png
├── prints/
└── CNAME                      ← identidadeweb.com
```

> Arquivos com espaços/parênteses usam URL-encoding no HTML (ex.: `assets/elite%20corte.png`). Preserve esse padrão.

---

## O que já foi implementado

### Header / Menu
- Header fixo com faixa azul de 3px.
- Sem rolagem: barra branca full-width, 2rem de margem, cantos retos.
- Scrolled: `.header-inner` vira pill. Header `z-index: 100`.
- Menu: Solução, Projetos, Serviços, Resultados, Contato.
- CTA WhatsApp: `.main-nav .nav-cta` (especificidade maior que `.main-nav a`).
- Mobile (<900px): drawer + overlay. Overlay `z-index: 80`, drawer `90`.

### Hero, logos, portfólio, cases, seções
- Hero navy, CTA único.
- Logos em marquee CSS + JS (espaçamento em `margin-right` nos itens).
- Portfólio `#projetos`: Shekinah, Celus, Loja LM. Sem Trendy Geek.
- Cases em `projetos/` com a mesma identidade.
- Problema, solução, serviços, depoimentos, stats.
- **Oferta `#oferta`:** 4 soluções (não tabela SaaS).
  1. Landing Page: R$ 400 a R$ 600. Domínio/hospedagem **não** inclusos.
  2. Site Institucional: R$ 900 a R$ 1.400. Domínio/hospedagem **não** inclusos.
  3. Estrutura Completa (destaque): R$ 3,90 no 1º mês, depois R$ 89/mês. Anual R$ 890 (de R$ 1.068, economia R$ 178). Domínio/hospedagem **inclusos**.
  4. Projetos Sob Medida: a combinar.
- Layout da oferta: 1 coluna no celular, **2×2 no notebook (≥700px)**. Não usar 4 colunas estreitas.
- CTA final + iframe Zoho.

### Bio (`bio/index.html`)
- Link na bio **navy + azul**, alinhada à marca. Sem ciano/verde.
- Fundo `#0A2540`, accent `#3B82F6`, Sora + Inter.
- Compacta, pensada para caber na tela do celular, **sem rolagem**.
- Ações: entrar no site, ver projetos (`#projetos`), soluções (`#servicos`), WhatsApp.
- Logo sem fundo branco, nome **Identidade** branco + **Web** azul.
- Linha azul animada sob o subtítulo (sai do centro, depois vai e volta só no miolo da frase, lenta).
- Rodapé: "Fale conosco" + ícones circulares (WhatsApp, Instagram, e-mail).
- Número WhatsApp da bio: `5592992534622` (mesmo do site).

### Bob (assistente no `index.html`)
Widget flutuante comercial. Classes só com prefixo `.bob-`. IIFE próprio, separado do JS do site.

**Fluxo atual**
1. Aparece após **6 segundos**.
2. "Oi, eu sou o Bob! Qual seu nome?"
3. Nome (Enter ou Enviar). Vazio: "Me conta seu nome primeiro."
4. Troca para `bob-beleza.png` (fade).
5. Pede WhatsApp com máscara `(00) 00000-0000` (11 dígitos).
6. Incompleto: "Esse número parece incompleto. Confere pra mim?"
7. Válido: "Perfeito, [NOME]! Obrigado! Já tenho seu contato." e **fecha sozinho**.
8. **Não abre WhatsApp.** Nome e telefone ficam só na memória da página, para enviar a um sistema no futuro.
9. X fecha o Bob. Não usa `sessionStorage` (recarregar a página faz ele voltar após 6s).

**Posição**
- **Mobile:** canto **superior direito**, `top: 5.5rem` (abaixo do menu). `z-index: 90` (header é 100, Bob não cobre o menu). Balão **ao lado esquerdo** do personagem, não embaixo do pé. WhatsApp flutuante continua embaixo à direita (`z-index: 200`).
- **Desktop (≥900px):** canto inferior direito, à esquerda do `.wa-float` (`right: 6.25rem`, `bottom: 1.5rem`, `z-index: 190`).

**Assets:** `assets/bob/bob-acenando.png` (início), `assets/bob/bob-beleza.png` (depois do nome).

---

## WhatsApp do site

- Número: `5592992534622`
- URL: `https://wa.me/5592992534622?text=...`
- Classe: `.wa-link`
- Mensagem padrão: `Olá, quero criar minha estrutura digital com a Identidade Web`
- Mensagem por CTA: `data-wa-message`
- Botão flutuante: `.wa-float` (`bottom: 1.5rem`, `right: 1.5rem`, `z-index: 200`)

---

## Decisões de design

| Tema | Decisão |
|------|---------|
| Paleta | Navy `#0A2540` + azul `#3B82F6` (index, cases e bio). |
| Tipografia | Sora (títulos) + Inter (corpo). |
| Copy | Curta, premium, **sem travessão**. |
| Oferta | 4 soluções. Completa em destaque. Mobile 1 coluna, notebook 2×2. |
| Bio | Mini landing de decisão, sem scroll. |
| Bob | Assistente visual. Não envia dados ainda. Não abre WA. |

---

## Problemas conhecidos / pendências

- [ ] Enviar nome/telefone do Bob para o sistema do cliente (ainda não há backend).
- [ ] Conferir `assets/loja lm.png` / telas da Loja LM no portfólio.
- [ ] Revisar código morto no `index.html`.
- [ ] Decidir sobre o iframe Zoho.
- [ ] Conferir deploy (caminhos com `%20`).
- [ ] Decidir sobre `prints/` no repo.
- [ ] Confirmar favicon (`logo identidade web.png`).

---

## Instruções para continuar

- **Nada de build.** Index e bio: CSS/JS no HTML. Cases: `projetos/case.css` e `projetos/case.js`.
- **Bob:** só classes `.bob-`. Não usar `input {}` / `button {}` globais. Não ligar ao `.reveal`. Não cobrir o header no mobile.
- **Não redesenhar o index** ao mexer em cases ou na bio.
- **Oferta:** não alterar valores. Completa inclui domínio/hospedagem; as outras não.
- **Copy:** sem travessão. Vírgula ou dois-pontos.
- **Commit:** o usuário comita. Mensagens curtas em pt-BR. Não force push.
- **Diagnóstico:** `python -m http.server <porta>`.
