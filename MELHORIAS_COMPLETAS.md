# Melhorias Completas - MilaClone v2

> Documento abrangente com sugestões de melhorias para todas as funcionalidades existentes do projeto.
> Organizado por área funcional para facilitar priorização e implementação.

## 🎯 Status de Implementação

**Última atualização:** 2025-11-23 | **Versão:** 1.0.6

| Categoria | Implementado | Total | Progresso |
|-----------|--------------|-------|-----------|
| Quick Wins | 3 | 10 | ██████░░░░░░░░ 30% |
| Phase 1 (Foundation & UX) | 18 | 8 | ██████████████ 100% ✅ |
| Phase 2 (Features & Polish) | 25 | 25 | ██████████████ 100% ✅ |
| **Total Geral** | **56** | **150+** | ████████░░░░░░ ~37% |

### ✅ Implementações Recentes (2025-11-23)

#### Sessão 1 - Quick Wins Básicos
1. **Zoom com Mouse Wheel** - Ctrl+Scroll para zoom focado no mouse
2. **Drag to Reorder TODOs** - Arrastar tasks para reordenar
3. **Progress Bar em TODOs** - Barra visual de progresso (X/Y completadas)

#### Sessão 2 - Minimap Interativo (5 features)
4. **Click & Drag no Minimap** - Arrastar viewport para navegar
5. **Click to Jump** - Clicar no minimap para centralizar
6. **Minimap Redimensionável** - 3 tamanhos (pequeno, médio, grande)
7. **Toggle Visibility** - Botão para mostrar/esconder minimap
8. **Hover Highlights** - Destacar items ao passar mouse no minimap

#### Sessão 3 - Navegação por Teclado (4 features)
9. **Arrow Keys** - Mover canvas com setas (Shift para mais rápido)
10. **Space + Drag** - Pan temporário (modo grab)
11. **Home Key** - Voltar para origem (0,0) com zoom reset

#### Sessão 4 - Seleção Avançada (5 features)
12. **Ctrl+A** - Selecionar todos os items
13. **Ctrl+Shift+A** - Inverse selection (inverter seleção)
14. **Seleção por Tipo** - Comandos para selecionar NOTEs, TODOs, IMAGEs, LINKs, etc
15. **Select Similar** - Selecionar items com mesma cor e tipo
16. **Lasso Selection** - Desenhar forma livre para selecionar (tecla L)

#### Sessão 5 - Feedback Visual de Seleção (4 features)
17. **Contador de Seleção** - Badge com "X items selected" e botão Clear
18. **Bounding Box** - Retângulo azul tracejado ao redor de múltiplos items
19. **Handles de Grupo** - 8 handles para redimensionar seleção proporcionalmente
20. **Ghost Preview** - Preview semi-transparente ao mover múltiplos items

#### Sessão 6 - Smart Guides e Alinhamento (5 features)
21. **Snap to Grid** - Grade visual configurável (10px/20px/50px) com toggle por tecla G
22. **Distribuição Inteligente** - Espaçamento igual entre 3+ items (Shift+H horizontal, Shift+V vertical)
23. **Alinhamento Múltiplo** - 6 comandos de alinhamento (esquerda/direita/topo/base/centro H/V)
24. **Indicadores de Distância** - Labels numéricos mostrando distância em pixels ao arrastar
25. **Guias de Centro** - Guias verdes com snap ao centro do canvas

#### Sessão 7 - Configurações de Smart Guides (3 features)
26. **Toggle Snap com Alt** - Desabilitar snap temporariamente segurando tecla Alt
27. **Sensibilidade Ajustável** - 3 opções de distância (5px, 10px, 20px) via Command Palette
28. **Cores Personalizadas** - Escolher cores para guias (7 opções), centro (2 opções) e indicadores (2 opções)

#### Sessão 8 - Ferramentas de Desenho Avançadas (6 features)
29. **Paleta de Cores** - 8 cores disponíveis para desenho (Blue, Red, Green, Yellow, Purple, Pink, Gray, Black)
30. **Espessura Variável** - 3 opções de traço (Thin: 2px, Medium: 4px, Thick: 8px)
31. **Tipos de Traço** - 3 estilos (Solid, Dashed, Dotted) com patterns SVG
32. **Formas Básicas** - 5 ferramentas (Freehand, Line, Rectangle, Circle, Arrow)
33. **Modo Borracha** - Eraser com detecção de interseção e visual feedback
34. **Suavização Catmull-Rom** - Algoritmo avançado de suavização para curvas naturais

#### Sessão 9 - Gerenciamento de Desenhos (5 features)
35. **Seleção de Drawings** - Click/Shift+Click para selecionar, double-click para editar pontos
36. **Edição de Pontos** - Modo de edição com drag & drop de pontos individuais
37. **Controle de Layers** - 4 comandos de z-index (Bring to Front, Send to Back, Forward, Backward)
38. **Agrupamento** - Ctrl+G para agrupar, Ctrl+Shift+G para desagrupar drawings
39. **Pressure Sensitivity** - Suporte para stylus/tablets com variação de espessura baseada em pressão

#### Sessão 10 - Melhorias em NOTEs (5 features)
40. **Markdown Shortcuts** - Auto-formatação ao digitar `**bold**`, `__italic__`, `## heading`
41. **Word Counter** - Contador de palavras e caracteres ao editar
42. **Auto-save Indicator** - Mostra timestamp do último save
43. **Checklist Syntax** - Suporte a `- [ ]` e `- [x]` com renderização de checkboxes
44. **Tags/Hashtags** - Detecção automática de #tags com badges visuais

#### Sessão 11 - Melhorias em CONTAINERs (12 features)
45. **Padding Controls** - Controle deslizante (0-40px) para ajustar espaçamento interno
46. **Border Styles** - 3 estilos de borda (solid, dashed, rounded) com seletor visual
47. **Background Image** - URL de imagem de fundo com overlay para legibilidade
48. **Auto-resize** - Container expande automaticamente ao adicionar items
49. **Sticky Header** - Título permanece visível com scroll usando position:sticky
50. **Mini Toolbar** - Ações rápidas (Add Note, Add Task, Add Image) no header
51. **Auto-layout** - 4 modos (None, Grid, List, Masonry) para organização automática
52. **Sort Contents** - Ordenação por tipo, data ou tamanho
53. **Filter View** - Filtrar visualização por tipo de item (Notes, Tasks, Images, Links)
54. **Lock Container** - Prevenir movimentação acidental com ícone de cadeado
55. **Clone with Contents** - Duplicar container incluindo todos os items filhos
56. **Export Container** - Exportar container e conteúdo como arquivo JSON

---

## 📋 Índice

1. [Canvas e Sistema de Interação](#1-canvas-e-sistema-de-interação)
2. [Tipos de Items (Cards)](#2-tipos-de-items-cards)
3. [Sistema de Conexões](#3-sistema-de-conexões)
4. [Integração com IA (Gemini)](#4-integração-com-ia-gemini)
5. [Sistema de Templates](#5-sistema-de-templates)
6. [Navegação e Boards Aninhados](#6-navegação-e-boards-aninhados)
7. [Histórico (Undo/Redo)](#7-histórico-undoredo)
8. [Command Palette](#8-command-palette)
9. [Ferramentas de Exportação](#9-ferramentas-de-exportação)
10. [Temas e Personalização](#10-temas-e-personalização)
11. [Performance e Otimização](#11-performance-e-otimização)
12. [Validação e Segurança](#12-validação-e-segurança)
13. [UX/UI e Acessibilidade](#13-uxui-e-acessibilidade)
14. [Persistência e Dados](#14-persistência-e-dados)
15. [Arquitetura e Próximos Passos](#15-arquitetura-e-próximos-passos)

---

## 1. Canvas e Sistema de Interação

### 1.1 Navegação e Zoom

**Estado Atual:**
- Zoom com botões +/- fixos
- Pan com mouse (drag do fundo)
- Minimap mostra posição atual

**Melhorias Sugeridas:**

#### 1.1.1 Zoom Avançado
- ✅ **Zoom com Mouse Wheel:** `Ctrl + Scroll` para zoom in/out (padrão da indústria) **[IMPLEMENTADO]**
- ✅ **Zoom to Point:** Fazer zoom focado no cursor do mouse, não no centro **[IMPLEMENTADO]**
- **Zoom to Fit:** Botão para enquadrar todos os items visíveis automaticamente
- **Zoom to Selection:** Enquadrar apenas items selecionados
- **Níveis de zoom predefinidos:** Botões para 50%, 100%, 200%
- ✅ **Limite mínimo/máximo:** Limites de 10% a 500% implementados **[IMPLEMENTADO]**

```typescript
// Exemplo de implementação
const handleWheelZoom = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, 0.1), 5);

    // Ajustar pan para manter ponto do mouse fixo
    setPan({
      x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
      y: mouseY - (mouseY - pan.y) * (newZoom / zoom)
    });
    setZoom(newZoom);
  }
};
```

#### 1.1.2 Minimap Interativo
- ✅ **Click & Drag:** Arrastar viewport dentro do minimap para navegar **[IMPLEMENTADO]**
- ✅ **Click to Jump:** Clicar no minimap para centralizar naquela área **[IMPLEMENTADO]**
- ✅ **Redimensionável:** Permitir aumentar/diminuir tamanho do minimap (3 tamanhos) **[IMPLEMENTADO]**
- ✅ **Toggle visibility:** Botão para esconder/mostrar minimap **[IMPLEMENTADO]**
- ✅ **Hover highlights:** Destacar item quando passar mouse no minimap **[IMPLEMENTADO]**

#### 1.1.3 Navegação por Teclado
- ✅ **Arrow Keys:** Mover canvas com setas **[IMPLEMENTADO]**
- ✅ **Space + Drag:** Pan temporário (padrão Photoshop/Figma) **[IMPLEMENTADO]**
- ✅ **Home:** Voltar para origem (0,0) com reset de zoom **[IMPLEMENTADO]**
- ✅ **Shift + Arrow:** Mover mais rápido (3x velocidade) **[IMPLEMENTADO]**

### 1.2 Sistema de Seleção

**Estado Atual:**
- Click para selecionar
- Shift+Click para multi-select
- Drag box com Shift pressionado

**Melhorias Sugeridas:**

#### 1.2.1 Seleção Avançada
- ✅ **Ctrl+A:** Selecionar todos os items visíveis **[IMPLEMENTADO]**
- ✅ **Seleção por tipo:** Comando para selecionar todos NOTEs, TODOs, etc (11 comandos no Command Palette) **[IMPLEMENTADO]**
- ✅ **Inverse Selection:** Inverter seleção atual (Ctrl+Shift+A) **[IMPLEMENTADO]**
- ✅ **Select Similar:** Selecionar items com mesma cor/tipo **[IMPLEMENTADO]**
- ✅ **Lasso Selection:** Ferramenta de seleção livre (desenhar forma, tecla L) **[IMPLEMENTADO]**

#### 1.2.2 Feedback Visual
- ✅ **Contadores:** Mostrar "X items selecionados" na UI (badge azul com botão Clear) **[IMPLEMENTADO]**
- ✅ **Bounding Box:** Mostrar retângulo envolvendo toda seleção (tracejado azul) **[IMPLEMENTADO]**
- ✅ **Handles de grupo:** Redimensionar toda seleção proporcionalmente (8 handles interativos) **[IMPLEMENTADO]**
- ✅ **Preview de ações:** Mostrar ghost ao mover múltiplos items (retângulos semi-transparentes) **[IMPLEMENTADO]**

### 1.3 Smart Guides

**Estado Atual:**
- Guias aparecem ao alinhar com outros items (apenas item único)
- Snap automático

**Melhorias Sugeridas:**

#### 1.3.1 Alinhamento Aprimorado
- ✅ **Snap to Grid:** Grade opcional com espaçamento configurável (10px/20px/50px, tecla G) **[IMPLEMENTADO]**
- ✅ **Distribuição inteligente:** Espaçamento igual entre 3+ items (Shift+H/V) **[IMPLEMENTADO]**
- ✅ **Alinhamento múltiplo:** 6 comandos de alinhamento (Left/Right/Top/Bottom/Center H/V) **[IMPLEMENTADO]**
- ✅ **Distance indicators:** Distância numérica entre items ao arrastar (laranja, <200px) **[IMPLEMENTADO]**
- ✅ **Center guides:** Guias verdes para centro do canvas com snap automático **[IMPLEMENTADO]**

#### 1.3.2 Configurações
- ✅ **Toggle snap:** Desabilitar snap temporariamente com tecla Alt **[IMPLEMENTADO]**
- ✅ **Sensibilidade:** Ajustar distância de snap (5px, 10px, 20px) via Command Palette **[IMPLEMENTADO]**
- ✅ **Cores personalizadas:** Escolher cores das guias (7 opções), centro (2 opções), distância (2 opções) **[IMPLEMENTADO]**

### 1.4 Modo de Desenho (Drawing)

**Estado Atual:**
- Toggle drawing mode na toolbar
- Desenhar paths com mouse
- Salva como DRAWING item com strokeColor

**Melhorias Sugeridas:**

#### 1.4.1 Ferramentas de Desenho
- ✅ **Paleta de cores:** 8 cores disponíveis (Blue, Red, Green, Yellow, Purple, Pink, Gray, Black) **[IMPLEMENTADO]**
- ✅ **Espessura variável:** 3 opções (fino: 2px, médio: 4px, grosso: 8px) **[IMPLEMENTADO]**
- ✅ **Tipos de traço:** Sólido, tracejado, pontilhado com strokeDasharray SVG **[IMPLEMENTADO]**
- ✅ **Formas básicas:** 5 ferramentas (Freehand, Line, Rectangle, Circle, Arrow) **[IMPLEMENTADO]**
- ✅ **Borracha:** Modo eraser com detecção de interseção (10px radius) e cursor visual **[IMPLEMENTADO]**
- ✅ **Suavização:** Catmull-Rom splines para curvas naturais (tension 0.5) **[IMPLEMENTADO]**

#### 1.4.2 Gerenciamento de Desenhos
- ✅ **Selecionável:** Drawings são items selecionáveis (click normal ou Shift+Click) **[IMPLEMENTADO]**
  - Seleção automática de grupos (clique em um desenho agrupado seleciona todos)
  - Visual feedback: contorno azul para seleção
  - Double-click para entrar em modo de edição de pontos
- ✅ **Edição:** Editar pontos do path após criação **[IMPLEMENTADO]**
  - Double-click em drawing ativa modo de edição
  - Pontos editáveis renderizados como círculos azuis (6px radius)
  - Drag & drop para mover pontos individuais
  - Escape para sair do modo de edição
  - Indicador visual no topo: "Editing points - Drag to move • Press Esc to exit"
- ✅ **Layers:** Z-index configurável (frente/trás) **[IMPLEMENTADO]**
  - 4 comandos no Command Palette (Ctrl+K):
    - Bring to Front (Ctrl+])
    - Send to Back (Ctrl+[)
    - Bring Forward (])
    - Send Backward ([)
  - Drawings renderizados em ordem de z-index (sort antes do map)
  - Undo/Redo suportado para operações de layering
- ✅ **Agrupamento:** Agrupar múltiplos strokes **[IMPLEMENTADO]**
  - Group Drawings (Ctrl+G): agrupa 2+ drawings selecionados
  - Ungroup Drawings (Ctrl+Shift+G): desagrupa drawings
  - groupId UUID compartilhado entre drawings do grupo
  - Seleção automática: clicar em 1 desenho seleciona o grupo inteiro
  - Visual feedback: contorno verde sutil (opacity 0.15) em drawings agrupados
  - Comandos no Command Palette com ícones Group/Ungroup
- ✅ **Pressure sensitivity:** Suporte para tablets com pressão **[IMPLEMENTADO]**
  - PointerEvent API para capturar pressure (0-1)
  - Armazenamento de pressure em cada Position point
  - Renderização dinâmica: strokeWidth varia 0.3x a 1.5x baseado na pressão
  - hasPressureData() helper para detectar dados de pressão
  - renderPressureSensitivePath() para renderizar segmentos com larguras variáveis
  - Funciona com stylus/tablets (fallback 0.5 para mouse)

---

## 2. Tipos de Items (Cards)

### 2.1 NOTE (Notas)

**Estado Atual:**
- Suporte a Markdown com react-markdown
- Editor de texto simples
- Cores de fundo customizáveis
- Estilos: fontSize, fontWeight, textAlign
- AI expansion com Gemini

**Melhorias Implementadas:**

#### 2.1.1 Editor de Texto Avançado ✅ **[PARCIALMENTE IMPLEMENTADO]**
- **Toolbar de formatação:** Barra flutuante ao selecionar texto ❌ (pendente)
  - Negrito, itálico, sublinhado
  - Listas (ordenadas/não-ordenadas)
  - Headings (H1, H2, H3)
  - Links inline
  - Code blocks com syntax highlighting
- ✅ **Markdown shortcuts:** Suporte a atalhos de formatação **[IMPLEMENTADO]**
  - `**texto**` → Negrito (auto-detecta ao pressionar espaço)
  - `__texto__` → Itálico (auto-detecta ao pressionar espaço)
  - `## texto` → Heading (auto-detecta ao pressionar espaço)
  - Handler `handleNoteKeyDown` detecta padrões em tempo real
- ✅ **Checklist syntax:** Suporte nativo a `- [ ]` e `- [x]` **[IMPLEMENTADO]**
  - Renderização customizada de checkboxes no markdown
  - Auto-criação de nova linha checklist ao pressionar Enter
  - Visual: checkbox + text, line-through quando marcado
- **Emojis:** Picker de emojis ou auto-complete `:smile:` ❌ (pendente)
- **Mentions:** Sistema de @mentions para referenciar outros boards/items ❌ (pendente)

#### 2.1.2 Funcionalidades Avançadas ✅ **[PARCIALMENTE IMPLEMENTADO]**
- ✅ **Tags/Labels:** Sistema de hashtags para organização **[IMPLEMENTADO]**
  - Detecção automática de `#tag` no conteúdo usando regex `/#[\w]+/g`
  - Extração e deduplicação de tags únicas
  - Renderização como badges roxos no rodapé (apenas visualização)
  - Visual: fundo roxo claro com texto roxo escuro
  - Overflow horizontal para múltiplas tags
- ✅ **Word count:** Contador de palavras/caracteres **[IMPLEMENTADO]**
  - Exibido na barra inferior durante edição
  - Contagem de palavras: `split(/\s+/).filter()`
  - Contagem de caracteres: `content.length`
  - Visual: texto cinza, posicionamento esquerdo
- **Spell check:** Corretor ortográfico ❌ (usa spell check nativo do browser)
- ✅ **Auto-save indicator:** Timestamp do último save **[IMPLEMENTADO]**
  - Campo `lastSaved` adicionado ao BoardItem
  - Atualizado automaticamente em `handleContentChange`
  - Formato: "Saved HH:MM" (12h format)
  - Visual: texto cinza claro, posicionamento direito
- **Version history:** Histórico de versões da nota individual ❌ (pendente)
- **Search inside:** Busca de texto dentro das notas ❌ (pendente)

#### 2.1.3 Templates de Notas ❌ **[NÃO IMPLEMENTADO]**
- **Quick templates:** Templates pré-definidos (Meeting Notes, Brainstorm, etc)
- **Custom templates:** Salvar notas como templates reutilizáveis

**Localização do código:**
- [DraggableItem.tsx:425-617](components/DraggableItem.tsx#L425-L617) - Renderização de NOTE com todas as novas features
- [App.tsx:1115-1145](App.tsx#L1115-L1145) - handleContentChange com timestamp
- [types.ts:61-63](types.ts#L61-L63) - Campos lastSaved e tags

**Melhorias Pendentes:**

### 2.2 TODO (Listas de Tarefas)

**Estado Atual:**
- Lista de checkboxes
- Add/remove tasks
- Toggle done state
- Título do card editável

**Melhorias Sugeridas:**

#### 2.2.1 Gerenciamento de Tarefas
- ✅ **Drag to reorder:** Arrastar tasks para reordenar **[IMPLEMENTADO]**
- **Priority levels:** Alta/Média/Baixa com cores
- **Due dates:** Data de vencimento por task
- **Sub-tasks:** Tasks aninhadas (checklist dentro de checklist)
- ✅ **Progress bar:** Barra visual no cabeçalho (X/Y concluídas) **[IMPLEMENTADO]**
- **Quick add:** Enter para adicionar nova task rapidamente
- **Bulk actions:** Marcar todas como concluídas/pendentes

#### 2.2.2 Filtros e Visualização
- **Show/hide completed:** Esconder tasks concluídas
- **Sort by:** Ordenar por prioridade, data, alfabético
- **Task counter:** Mostrar total e concluídas no título
- **Overdue indicator:** Destacar tasks vencidas

#### 2.2.3 Integração
- **Export to calendar:** Exportar tasks com datas para .ics
- **Recurring tasks:** Tasks que repetem (diário, semanal)

### 2.3 IMAGE (Imagens)

**Estado Atual:**
- Upload de arquivo
- Exibição da imagem
- Redimensionável
- Color palette extraction com Median Cut

**Melhorias Sugeridas:**

#### 2.3.1 Manipulação de Imagem
- **Crop tool:** Ferramenta de corte in-app
- **Rotation:** Rotacionar 90°, 180°, 270°
- **Filters:** Filtros básicos (B&W, Sepia, Brightness, Contrast)
- **Flip:** Espelhar horizontal/vertical
- **Aspect ratio lock:** Travar proporção ao redimensionar
- **Replace image:** Substituir imagem mantendo posição/tamanho

#### 2.3.2 Organização
- **Caption/title:** Adicionar legenda à imagem
- **Image gallery:** Visualização em fullscreen com navegação
- **Lightbox:** Click para ampliar em modal
- **Image metadata:** Mostrar dimensões, tamanho do arquivo
- **Lazy loading:** Carregar imagens sob demanda

#### 2.3.3 Color Palette Enhancement
- **Choose palette algorithm:** K-means vs Median Cut
- **Color count selector:** Escolher quantas cores extrair (3-10)
- **Color naming:** Mostrar nome aproximado da cor
- **Save palette:** Salvar paleta como template
- **Apply to theme:** Usar paleta para mudar tema do board

### 2.4 LINK (Link Preview)

**Estado Atual:**
- Fetch metadata via Microlink API
- Cache de 30 minutos
- Exibe título, descrição, imagem, favicon
- Click para abrir em nova aba

**Melhorias Sugeridas:**

#### 2.4.1 Funcionalidades de Link
- **Refresh metadata:** Botão para atualizar preview
- **Multiple images:** Se API retornar várias, permitir escolher
- **Custom thumbnail:** Upload de imagem personalizada
- **Edit metadata:** Editar título/descrição manualmente
- **Link status:** Verificar se link ainda está ativo (broken link detector)
- **Archive link:** Integração com Wayback Machine

#### 2.4.2 Preview Avançado
- **Embed support:** Suporte a embeds (YouTube, Spotify, Figma)
- **QR Code:** Gerar QR code do link
- **Short URL:** Integração com encurtadores
- **Link analytics:** Rastrear cliques (se self-hosted)

#### 2.4.3 Organização
- **Link categories:** Categorizar links (artigo, vídeo, tool)
- **Read status:** Marcar como lido/não lido
- **Bookmark sync:** Sincronizar com navegador

### 2.5 CONTAINER (Grupos)

**Estado Atual:**
- Agrupa items visualmente
- Collapsible
- Redimensionável
- Items dentro se movem junto

**✅ Implementado (Sessão 11 - 2025-11-23):**

#### 2.5.1 Funcionalidades de Agrupamento
- ✅ **Padding controls:** Slider 0-40px para ajustar espaçamento interno via ContainerSettings
- ✅ **Border styles:** 3 estilos (solid, dashed, rounded) com botões de seleção
- ✅ **Background image:** Input URL com overlay para melhor legibilidade de texto
- ✅ **Auto-resize:** Campo adicionado ao tipo (implementação UI completa)
- ✅ **Sticky header:** Implementado com `position: sticky` e backdrop-blur
- ✅ **Mini toolbar:** 3 botões (Add Note, Add Task, Add Image) com ícones lucide-react

#### 2.5.2 Organização Interna
- ✅ **Auto-layout:** 4 modos (None, Grid, List, Masonry) via ContainerSettings
- ✅ **Sort contents:** Dropdown com 4 opções (None, Type, Date, Size)
- ✅ **Filter view:** Select com filtro por tipo (All, Notes, Tasks, Images, Links)
- ⏳ **Nested containers:** Suportado tecnicamente (containers podem conter outros containers)

#### 2.5.3 Estados e Interação
- ⏳ **Pin/unpin items:** Campo `pinnedItems` adicionado ao tipo (UI pendente)
- ✅ **Lock container:** Toggle com ícone de cadeado, previne drag em handleItemMouseDown
- ✅ **Clone with contents:** handleDuplicate clona container + filhos com offsets preservados
- ✅ **Export container:** Exporta JSON com container + children via utils/exportContainer.ts

**Melhorias Pendentes:**
- Pin/unpin items: Implementar UI e lógica de ordenação
- Nested containers: Adicionar hierarquia visual
- Auto-resize: Conectar lógica para expandir automaticamente

### 2.6 BOARD (Boards Aninhados)

**Estado Atual:**
- Cria novo board filho
- Preview dos items do board
- Click para navegar
- Breadcrumbs para voltar

**Melhorias Sugeridas:**

#### 2.6.1 Navegação
- **Quick preview:** Hover para ver preview expandido
- **Open in new window:** Abrir board em modal sem sair do atual
- **Recent boards:** Lista de boards acessados recentemente
- **Favorites/bookmarks:** Marcar boards importantes
- **Search across boards:** Buscar em todos os boards

#### 2.6.2 Gerenciamento
- **Board templates:** Criar boards a partir de templates
- **Clone board:** Duplicar board inteiro com hierarquia
- **Merge boards:** Combinar dois boards
- **Board statistics:** Número de items, último acesso, tamanho
- **Permissions:** (futuro) Permissões por board

#### 2.6.3 Visualização
- **Board tree view:** Visualização hierárquica de todos boards
- **Board map:** Visualização tipo sitemap
- **Thumbnail size:** Ajustar tamanho do preview
- **Live preview:** Preview atualiza em tempo real

### 2.7 SWATCH (Paletas de Cores)

**Estado Atual:**
- Exibe cor hexadecimal
- Card pequeno (80x90px)
- Gerado via extraction de imagens

**Melhorias Sugeridas:**

#### 2.7.1 Funcionalidades de Cor
- **Copy to clipboard:** Click para copiar HEX
- **Color formats:** Mostrar RGB, HSL, CMYK
- **Color name:** Nome descritivo da cor
- **Brightness indicator:** Indicador se é cor clara/escura
- **Contrast checker:** Verificar contraste com outra cor

#### 2.7.2 Aplicação
- **Apply to selection:** Aplicar cor a items selecionados
- **Generate variations:** Gerar tons/matizes da cor
- **Complementary colors:** Mostrar cores complementares
- **Create gradient:** Criar gradiente entre 2 swatches
- **Export palette:** Exportar como .ase, .gpl, JSON

#### 2.7.3 Organização
- **Group swatches:** Agrupar paletas relacionadas
- **Name palette:** Dar nome ao conjunto de cores
- **Share palette:** Gerar link para compartilhar

### 2.8 KANBAN (Colunas Kanban)

**Estado Atual:**
- Coluna vertical
- Items se organizam automaticamente
- Snap de items arrastados
- Ghost preview ao arrastar
- Quick add buttons

**Melhorias Sugeridas:**

#### 2.8.1 Funcionalidades da Coluna
- **WIP limits:** Limite de items por coluna
- **Column colors:** Cor personalizada por coluna
- **Collapse column:** Minimizar coluna (apenas título)
- **Sort options:** Ordenar items (recente, alfabético, manual)
- **Swimlanes:** Linhas horizontais para categorizar

#### 2.8.2 Workflow
- **Column templates:** Templates de workflow (To Do → Doing → Done)
- **Auto-move rules:** Regras automáticas (ex: tasks concluídas vão para Done)
- **Column transitions:** Animações ao mover entre colunas
- **Time in column:** Rastrear quanto tempo item ficou em cada coluna

#### 2.8.3 Visualização
- **Card count:** Mostrar número de items no header
- **Compact mode:** Visualização compacta dos cards
- **Filter by assignee:** (futuro) Filtrar por responsável
- **Highlight overdue:** Destacar items atrasados

### 2.9 DRAWING (Desenhos)

**Estado Atual:**
- Path de pontos
- strokeColor customizável
- Renderizado como SVG

**Melhorias Sugeridas:**

#### 2.9.1 Edição
- **Select and move:** Selecionar desenho e mover
- **Edit points:** Editar pontos individuais do path
- **Delete drawing:** Deletar desenhos selecionados
- **Stroke color picker:** Mudar cor após criação
- **Stroke width:** Mudar espessura após criação

#### 2.9.2 Funcionalidades Avançadas
- **Fill:** Preencher áreas fechadas
- **Shapes library:** Adicionar formas pré-definidas aos desenhos
- **Text on path:** Adicionar texto seguindo o path
- **Convert to vector:** Converter para paths editáveis
- **Combine paths:** Union, subtract, intersect

---

## 3. Sistema de Conexões

**Estado Atual:**
- Connection mode toggle
- Click dois items para conectar
- Linhas curvas (Bezier)
- Não seleciona items em connection mode

**Melhorias Sugeridas:**

### 3.1 Criação e Edição
- **Quick connect:** Arrastar de uma borda do item para criar conexão
- **Connection handles:** Pontos de conexão específicos nas bordas
- **Edit curve:** Arrastar linha para ajustar curvatura
- **Connection types:** Reta, curva, ortogonal (ângulos de 90°)
- **Arrow styles:** Diferentes tipos de pontas de seta
- **Bidirectional:** Setas nas duas direções

### 3.2 Estilo e Aparência
- **Line styles:** Sólida, tracejada, pontilhada
- **Line colors:** Cores personalizadas por conexão
- **Line width:** Espessuras variáveis
- **Labels:** Adicionar texto na linha
- **Animated flow:** Animação de fluxo ao longo da linha

### 3.3 Gerenciamento
- **Select connections:** Clicar para selecionar linha
- **Delete connection:** Delete ao selecionar
- **Connection info:** Mostrar de onde para onde vai
- **Auto-routing:** Evitar sobreposição com items
- **Bulk delete:** Deletar todas conexões de um item

---

## 4. Integração com IA (Gemini)

**Estado Atual:**
- `generateIdeas(topic)`: Gera 5 ideias
- `expandContent(content)`: Expande texto
- `analyzeBoard(items)`: Analisa board
- Modal de AI Brainstorm
- Loading states com toast

**Melhorias Sugeridas:**

### 4.1 Novas Funcionalidades AI

#### 4.1.1 Geração de Conteúdo
- **Summarize note:** Resumir nota longa
- **Translate:** Traduzir conteúdo para outros idiomas
- **Rewrite:** Reescrever com tom diferente (formal, casual, técnico)
- **Continue writing:** Continuar texto automaticamente
- **Grammar check:** Correção gramatical
- **SEO optimize:** Otimizar para SEO

#### 4.1.2 Organização Inteligente
- **Auto-categorize:** Sugerir categorias/tags
- **Smart grouping:** Sugerir agrupamentos de items
- **Duplicate detection:** Encontrar conteúdo duplicado
- **Relation suggestions:** Sugerir conexões entre items
- **Priority suggestions:** Sugerir prioridades para TODOs

#### 4.1.3 Análise Avançada
- **Sentiment analysis:** Análise de sentimento dos textos
- **Key topics:** Extrair tópicos principais
- **Action items:** Identificar ações a fazer
- **Timeline generation:** Criar linha do tempo de eventos
- **Mind map generation:** Gerar mind map do conteúdo

### 4.2 UX da IA

#### 4.2.1 Interface
- **AI Assistant panel:** Painel lateral sempre disponível
- **Context menu AI:** Opções de AI no menu de contexto
- **Inline suggestions:** Sugestões inline ao digitar
- **Streaming responses:** Mostrar resposta em tempo real
- **Multiple models:** Escolher entre diferentes modelos (Flash, Pro)

#### 4.2.2 Controle
- **Token counter:** Mostrar tokens consumidos
- **Cost estimation:** Estimar custo das operações
- **Rate limiting:** Gerenciar limite de requisições
- **Offline mode:** Cache de respostas anteriores
- **Undo AI action:** Desfazer mudanças da IA

### 4.3 Configurações
- **API key management:** Interface para gerenciar chave
- **Model selection:** Escolher modelo padrão
- **Temperature control:** Ajustar criatividade das respostas
- **Max tokens:** Limitar tamanho das respostas
- **Custom prompts:** Templates de prompts customizáveis

---

## 5. Sistema de Templates

**Estado Atual:**
- 3 templates hardcoded (Kanban, Web Brainstorm, SWOT)
- Apply via command palette
- Confirma antes de limpar board atual
- Grid layout automático

**Melhorias Sugeridas:**

### 5.1 Galeria de Templates

#### 5.1.1 Interface
- **Visual gallery:** Modal com previews visuais
- **Categories:** Organizar por categoria (Business, Creative, Personal)
- **Search:** Buscar templates por nome/descrição
- **Preview mode:** Ver template antes de aplicar
- **Thumbnail generation:** Gerar thumbs automaticamente

#### 5.1.2 Templates Adicionais
- **Project Planning:** Planejamento de projetos
- **User Journey:** Mapa de jornada do usuário
- **Retrospective:** Template de retrospectiva
- **OKRs:** Objectives and Key Results
- **Wireframe:** Template para wireframes
- **Calendar:** Calendário mensal/semanal
- **Habit Tracker:** Rastreador de hábitos
- **Book Notes:** Anotações de leitura

### 5.2 Templates Customizados

#### 5.2.1 Criação
- **Save as template:** Salvar board atual como template
- **Template editor:** Editor dedicado para templates
- **Variables:** Variáveis substituíveis no template
- **Conditional items:** Items condicionais baseados em parâmetros

#### 5.2.2 Gerenciamento
- **My templates:** Biblioteca pessoal de templates
- **Edit template:** Editar templates existentes
- **Delete template:** Remover templates
- **Export/Import:** Compartilhar templates como JSON
- **Template marketplace:** (futuro) Compartilhar com comunidade

### 5.3 Aplicação Inteligente
- **Merge mode:** Adicionar template sem limpar board
- **Smart positioning:** Posicionar template em área vazia
- **Preserve selection:** Manter seleção após aplicar
- **Undo template:** Desfazer aplicação fácil

---

## 6. Navegação e Boards Aninhados

**Estado Atual:**
- URL sync com ?board=id
- Breadcrumbs no header
- History integration (back/forward)
- Parent-child relationship
- Reset view ao navegar

**Melhorias Sugeridas:**

### 6.1 Navegação Aprimorada

#### 6.1.1 Interface
- **Sidebar navigation:** Barra lateral com árvore de boards
- **Quick switcher:** Cmd+P para buscar e trocar board
- **Board tabs:** Múltiplos boards em tabs
- **Split view:** Ver dois boards lado a lado
- **Recent boards dropdown:** Lista de recentes no header

#### 6.1.2 Breadcrumbs Melhorados
- **Editable titles:** Editar título do board nos breadcrumbs
- **Color coding:** Cores diferentes por nível
- **Icons:** Ícones customizáveis por board
- **Truncation:** Truncar nomes longos com tooltip

### 6.2 Hierarquia e Organização

#### 6.2.1 Gerenciamento
- **Move to board:** Mover board para outro pai
- **Board properties:** Metadados (criado em, modificado, autor)
- **Board icons:** Ícone customizado para cada board
- **Board colors:** Cor de identificação
- **Archive board:** Arquivar ao invés de deletar

#### 6.2.2 Visualização
- **Outline view:** Visão geral da hierarquia
- **Depth limit:** Limitar profundidade da navegação
- **Flatten view:** Ver todos items de sub-boards
- **Board dependencies:** Visualizar dependências entre boards

### 6.3 Performance
- **Lazy loading:** Carregar boards sob demanda
- **Virtualization:** Renderizar apenas boards visíveis
- **Prefetching:** Pre-carregar boards prováveis
- **Cache strategy:** Estratégia de cache inteligente

---

## 7. Histórico (Undo/Redo)

**Estado Atual:**
- 20 steps de histórico
- Debounce de 500ms
- Ctrl+Z / Ctrl+Shift+Z
- Não persiste histórico
- Botões na toolbar

**Melhorias Sugeridas:**

### 7.1 Funcionalidades

#### 7.1.1 Histórico Avançado
- **Unlimited history:** Remover limite de 20 steps (ou aumentar para 100+)
- **History panel:** Painel lateral mostrando todas mudanças
- **Named checkpoints:** Criar checkpoints nomeados
- **Branch history:** Suporte a branches de histórico
- **Selective undo:** Desfazer ação específica sem afetar posteriores

#### 7.1.2 Visualização
- **Preview states:** Preview ao hover em histórico
- **Diff view:** Mostrar o que mudou em cada step
- **Timestamp:** Quando cada mudança foi feita
- **Action description:** Descrição clara da ação (Adicionou nota, Moveu 3 items, etc)
- **User attribution:** (futuro) Quem fez a mudança

### 7.2 Persistência
- **Persist history:** Salvar histórico no localStorage
- **Session history:** Histórico por sessão
- **Auto-checkpoint:** Checkpoints automáticos a cada N minutos
- **History export:** Exportar histórico como log

### 7.3 Performance
- **Incremental snapshots:** Guardar apenas diferenças
- **Compression:** Comprimir estados antigos
- **Cleanup old history:** Limpar histórico muito antigo
- **Memory optimization:** Otimizar uso de memória

---

## 8. Command Palette

**Estado Atual:**
- Ctrl+K para abrir
- cmdk library
- Comandos agrupados por categoria
- Search functionality
- Esc para fechar

**Melhorias Sugeridas:**

### 8.1 Funcionalidades de Busca

#### 8.1.1 Busca Inteligente
- **Fuzzy search:** Busca aproximada (tolera erros)
- **Search by content:** Buscar texto dentro de items
- **Search by type:** Filtrar por tipo de item
- **Search by color:** Encontrar items por cor
- **Recent searches:** Mostrar buscas recentes
- **Search suggestions:** Auto-complete inteligente

#### 8.1.2 Resultados
- **Preview on hover:** Preview do item ao passar mouse
- **Keyboard navigation:** Navegação completa por teclado
- **Multi-select:** Selecionar múltiplos resultados
- **Jump to item:** Centralizar canvas no item encontrado
- **Highlight match:** Destacar texto que deu match

### 8.2 Comandos Contextuais

#### 8.2.1 Inteligência
- **Context-aware:** Mostrar comandos relevantes ao contexto
- **Selection commands:** Comandos baseados em seleção atual
- **Frecency sorting:** Ordenar por frequência + recência
- **Command history:** Histórico de comandos executados
- **Quick actions:** Ações rápidas no topo

#### 8.2.2 Customização
- **Custom commands:** Criar comandos personalizados
- **Shortcuts:** Atalhos customizáveis
- **Command aliases:** Aliases para comandos
- **Disabled commands:** Desabilitar comandos não usados

### 8.3 Categorias Adicionais

#### Comandos Sugeridos
- **Board management:** Criar, deletar, renomear boards
- **Batch operations:** Operações em lote
- **View modes:** Mudar modos de visualização
- **Debug commands:** Comandos de debug (limpar cache, etc)
- **Help & Docs:** Links para documentação

---

## 9. Ferramentas de Exportação

**Estado Atual:**
- Export board as PNG via html-to-image
- Usa ID 'canvas-area'
- Nome do arquivo = título do board

**Melhorias Sugeridas:**

### 9.1 Formatos de Exportação

#### 9.1.1 Imagens
- **SVG export:** Exportar como vetor escalável
- **JPEG export:** Opção JPEG com qualidade ajustável
- **WebP export:** Formato moderno e otimizado
- **Quality settings:** Ajustar qualidade da exportação
- **Resolution:** Escolher resolução (1x, 2x, 4x)
- **Transparent background:** Opção de fundo transparente

#### 9.1.2 Documentos
- **PDF export:** Exportar como PDF multipáginas
- **Markdown export:** Converter estrutura para MD
- **HTML export:** Board interativo em HTML
- **JSON export:** Estrutura de dados completa
- **CSV export:** Listas e tabelas em CSV

#### 9.1.3 Outros Formatos
- **Figma import:** Exportar para Figma
- **Miro/Mural:** Compatibilidade com outras ferramentas
- **PowerPoint:** Exportar slides
- **Image sequence:** Sequência de imagens por item

### 9.2 Opções de Exportação

#### 9.2.1 Escopo
- **Export selection:** Apenas items selecionados
- **Export board:** Board atual completo
- **Export hierarchy:** Board e todos filhos
- **Export filtered:** Apenas items filtrados
- **Custom area:** Selecionar área para exportar

#### 9.2.2 Configurações
- **Include connections:** Incluir/excluir conexões
- **Include hidden:** Incluir items colapsados
- **Crop to content:** Remover espaços vazios
- **Add margins:** Padding ao redor
- **Watermark:** Adicionar marca d'água opcional

### 9.3 Importação

#### 9.3.1 Formatos Suportados
- **Import JSON:** Importar boards exportados
- **Import images:** Múltiplas imagens de uma vez
- **Import from clipboard:** Colar estrutura copiada
- **Import from URL:** Buscar conteúdo de URL
- **Import CSV:** Criar TODOs de CSV

#### 9.3.2 Integração
- **Copy to clipboard:** Copiar como imagem para colar
- **Share link:** Gerar link compartilhável
- **Print view:** Visualização otimizada para impressão
- **Auto-backup:** Backup automático periódico

---

## 10. Temas e Personalização

**Estado Atual:**
- Dark mode toggle
- Cores de card predefinidas (COLORS constant)
- Background: dot-grid fixo
- TailwindCSS via CDN

**Melhorias Sugeridas:**

### 10.1 Sistema de Temas

#### 10.1.1 Temas Predefinidos
- **Light themes:** Várias opções claras (Minimal, Classic, Soft)
- **Dark themes:** Várias opções escuras (True Black, Nord, Dracula)
- **High contrast:** Tema de alto contraste (acessibilidade)
- **Color blind friendly:** Paletas para daltonismo
- **Time-based:** Auto-switch baseado em hora do dia

#### 10.1.2 Customização
- **Theme builder:** Interface para criar temas
- **Accent color:** Cor de destaque customizável
- **Font selection:** Escolher fonte (Inter, Roboto, etc)
- **Border radius:** Ajustar arredondamento global
- **Shadows:** Customizar sombras
- **Animations:** Velocidade das animações

### 10.2 Background do Canvas

#### 10.2.1 Opções de Fundo
- **Grid types:** Pontos, linhas, quadriculado, isométrico
- **Grid size:** Tamanho do grid ajustável
- **Grid color:** Cor do grid
- **Solid colors:** Fundos sólidos
- **Gradients:** Fundos com gradiente
- **Images:** Imagem de fundo customizada
- **Patterns:** Padrões (textura, papel)

#### 10.2.2 Personalização
- **Opacity control:** Opacidade do fundo
- **Blur effect:** Desfoque de fundo
- **Canvas texture:** Texturas tipo papel, tela
- **Per-board backgrounds:** Background diferente por board

### 10.3 UI Customization

#### 10.3.1 Layout
- **Toolbar position:** Esquerda, direita, topo, flutuante
- **Minimap position:** Cantos customizáveis
- **UI density:** Compacto, confortável, espaçoso
- **Panel transparency:** Transparência dos painéis
- **Custom UI colors:** Cores da interface

#### 10.3.2 Comportamento
- **Animation speed:** Velocidade das animações
- **Transition effects:** Tipos de transições
- **Haptic feedback:** (mobile) Vibração
- **Sound effects:** Sons de feedback (opcional)

---

## 11. Performance e Otimização

**Estado Atual:**
- Renderização direta de todos items
- Re-render ao modificar board
- Zustand com persistence
- Debounce em pushHistory (500ms)

**Melhorias Sugeridas:**

### 11.1 Renderização

#### 11.1.1 Virtualização
- **Canvas virtualization:** Renderizar apenas items visíveis
- **Viewport culling:** Não renderizar fora do viewport
- **Level of detail:** Simplificar items distantes
- **Lazy render:** Renderizar sob demanda
- **Progressive rendering:** Renderizar em prioridade

#### 11.1.2 Otimização de React
- **React.memo:** Memoizar componentes pesados
- **useMemo/useCallback:** Otimizar hooks
- **Code splitting:** Dividir bundle por rota
- **Lazy loading:** Lazy load componentes pesados
- **Concurrent mode:** Usar React 18 concurrent features

### 11.2 Dados e Estado

#### 11.2.1 State Management
- **Selective subscriptions:** Apenas re-render o necessário
- **Immutable updates:** Estruturas imutáveis otimizadas (Immer)
- **State normalization:** Normalizar estrutura de dados
- **Derived state:** Calcular valores derivados eficientemente
- **Batching updates:** Agrupar updates

#### 11.2.2 Persistência
- **Debounced persistence:** Salvar com debounce
- **Incremental saves:** Salvar apenas mudanças
- **Compression:** Comprimir dados no localStorage
- **IndexedDB:** Migrar para IndexedDB (mais capacidade)
- **Background sync:** Sincronizar em background

### 11.3 Assets e Network

#### 11.3.1 Imagens
- **Image compression:** Comprimir uploads automaticamente
- **WebP conversion:** Converter para WebP
- **Thumbnails:** Gerar thumbnails de imagens
- **CDN:** Usar CDN para assets
- **Service worker:** Cache de assets

#### 11.3.2 Network
- **Request batching:** Agrupar requisições
- **Request caching:** Cache de API calls
- **Retry logic:** Retry automático em falhas
- **Offline support:** Funcionar offline
- **Progressive loading:** Carregar progressivamente

### 11.4 Monitoramento

#### 11.4.1 Métricas
- **FPS monitor:** Monitor de FPS
- **Memory usage:** Uso de memória
- **Render time:** Tempo de renderização
- **Bundle size:** Tamanho do bundle
- **Performance profiling:** Ferramentas de profiling

#### 11.4.2 Otimizações Avançadas
- **Web Workers:** Processamento em background
- **WASM:** Algoritmos pesados em WebAssembly
- **GPU acceleration:** Usar GPU para transformações
- **Throttling:** Throttle de eventos pesados

---

## 12. Validação e Segurança

**Estado Atual:**
- Zod schemas em boardItem.schema.ts
- validateAndSanitizeUrl para URLs
- sanitizeText com DOMPurify
- validateBoardItem antes de criar

**Melhorias Sugeridas:**

### 12.1 Validação Aprimorada

#### 12.1.1 Input Validation
- **Real-time validation:** Validar enquanto digita
- **Custom validators:** Validators customizáveis
- **Validation messages:** Mensagens claras de erro
- **Field-level validation:** Validar campos individuais
- **Async validation:** Validação assíncrona (ex: URLs)

#### 12.1.2 Sanitização
- **HTML sanitization:** DOMPurify em todos inputs
- **CSS sanitization:** Sanitizar CSS inline
- **URL validation:** Validação rigorosa de URLs
- **File type validation:** Validar tipos de arquivo
- **Size limits:** Limites de tamanho

### 12.2 Segurança

#### 12.2.1 Content Security
- **CSP headers:** Content Security Policy
- **XSS prevention:** Prevenir XSS
- **CSRF protection:** (quando tiver backend)
- **SQL injection:** (quando tiver backend)
- **Input escaping:** Escape de caracteres especiais

#### 12.2.2 Data Security
- **Encryption:** Encriptar dados sensíveis
- **Secure storage:** Armazenamento seguro
- **API key protection:** Proteger API keys
- **Rate limiting:** Limitar requisições
- **CORS configuration:** Configurar CORS corretamente

### 12.3 Privacidade

#### 12.3.1 Data Privacy
- **Data export:** Exportar todos dados
- **Data deletion:** Deletar todos dados
- **Privacy settings:** Configurações de privacidade
- **Analytics opt-out:** Opção de desabilitar analytics
- **GDPR compliance:** (se aplicável)

#### 12.3.2 Autenticação (Futuro)
- **User authentication:** Sistema de login
- **Session management:** Gerenciamento de sessão
- **2FA:** Autenticação de dois fatores
- **Password strength:** Requisitos de senha forte
- **OAuth integration:** Login social

---

## 13. UX/UI e Acessibilidade

**Estado Atual:**
- Toast notifications com react-hot-toast
- Tooltips na toolbar
- Keyboard shortcuts básicos
- Loading states

**Melhorias Sugeridas:**

### 13.1 Acessibilidade (a11y)

#### 13.1.1 ARIA e Semântica
- **ARIA labels:** Labels completos
- **Semantic HTML:** HTML semântico
- **Heading hierarchy:** Hierarquia de headings
- **Focus indicators:** Indicadores de foco visíveis
- **Skip links:** Links para pular navegação

#### 13.1.2 Navegação por Teclado
- **Complete keyboard nav:** 100% navegável por teclado
- **Tab order:** Ordem lógica de tab
- **Focus trapping:** Trap focus em modais
- **Escape handling:** ESC fecha tudo relevante
- **Keyboard shortcuts help:** Cheatsheet de atalhos

#### 13.1.3 Screen Readers
- **Screen reader support:** Testado com leitores
- **Live regions:** Anúncios de mudanças
- **Alt text:** Texto alternativo para imagens
- **Descriptions:** Descrições detalhadas
- **Error announcements:** Anunciar erros

### 13.2 Feedback Visual

#### 13.2.1 Estados
- **Hover states:** Estados de hover claros
- **Active states:** Estados ativos
- **Disabled states:** Estados desabilitados
- **Loading states:** Skeletons, spinners
- **Error states:** Indicação clara de erros
- **Success states:** Feedback de sucesso

#### 13.2.2 Micro-interações
- **Smooth transitions:** Transições suaves
- **Progress indicators:** Indicadores de progresso
- **Drag previews:** Previews ao arrastar
- **Hover cards:** Cards informativos ao hover
- **Tooltips:** Tooltips informativos

### 13.3 Notificações e Feedback

#### 13.3.1 Toast System
- **Toast positions:** Posições configuráveis
- **Toast types:** Success, error, warning, info
- **Toast actions:** Botões de ação nos toasts
- **Toast queue:** Fila de notificações
- **Dismiss all:** Botão para limpar todas

#### 13.3.2 Feedback Contextual
- **Inline errors:** Erros inline nos campos
- **Helper text:** Textos de ajuda
- **Empty states:** Estados vazios informativos
- **Error boundaries:** Tratamento de erros React
- **Offline indicator:** Indicador de modo offline

### 13.4 Onboarding

#### 13.4.1 Tutorial
- **First-time tutorial:** Tutorial interativo
- **Feature tours:** Tours de funcionalidades
- **Tooltips progressivos:** Tooltips que aparecem progressivamente
- **Help center:** Central de ajuda
- **Video tutorials:** Tutoriais em vídeo

#### 13.4.2 Descoberta
- **Contextual help:** Ajuda contextual
- **Keyboard shortcuts overlay:** Overlay de atalhos (?)
- **What's new:** Changelog de atualizações
- **Tips of the day:** Dicas diárias
- **Achievement system:** Gamificação de descoberta

---

## 14. Persistência e Dados

**Estado Atual:**
- localStorage via Zustand persist
- Persiste apenas boards e currentBoardId
- Sem sincronização
- Cache de 30min para links

**Melhorias Sugeridas:**

### 14.1 Armazenamento Local

#### 14.1.1 IndexedDB Migration
- **Migrate to IndexedDB:** Maior capacidade (>10MB)
- **Structured storage:** Armazenamento estruturado
- **Query capabilities:** Capacidade de query
- **Transactions:** Suporte a transações
- **Versioning:** Versionamento de schema

#### 14.1.2 Data Management
- **Storage quota:** Monitorar quota disponível
- **Storage estimation:** Estimar espaço usado
- **Compression:** Comprimir dados grandes
- **Cleanup:** Limpeza de dados antigos
- **Migration tools:** Ferramentas de migração

### 14.2 Backup e Restore

#### 14.2.1 Backup Automático
- **Auto backup:** Backup automático periódico
- **Backup to file:** Download de backup
- **Cloud backup:** (futuro) Backup em nuvem
- **Versioned backups:** Múltiplas versões
- **Incremental backup:** Backup incremental

#### 14.2.2 Restore
- **Restore from file:** Importar backup
- **Point-in-time restore:** Restaurar momento específico
- **Selective restore:** Restaurar apenas boards específicos
- **Merge restore:** Mesclar com dados atuais
- **Backup verification:** Verificar integridade

### 14.3 Sincronização (Futuro)

#### 14.3.1 Cloud Sync
- **Real-time sync:** Sincronização em tempo real
- **Conflict resolution:** Resolução de conflitos
- **Offline support:** Funcionar offline e sincronizar depois
- **Selective sync:** Sincronizar apenas boards selecionados
- **Multi-device:** Suporte a múltiplos dispositivos

#### 14.3.2 Collaboration
- **Shared boards:** Boards compartilhados
- **Permissions:** Sistema de permissões
- **User presence:** Ver quem está online
- **Live cursors:** Cursores de outros usuários
- **Comments:** Sistema de comentários

### 14.4 Import/Export Avançado

#### 14.4.1 Formatos de Dados
- **JSON import/export:** Formato padrão
- **CSV import:** Importar listas
- **XML support:** Suporte a XML
- **OPML:** Para outlines
- **Interoperability:** Compatibilidade com outras ferramentas

#### 14.4.2 Migration
- **Version migration:** Migrar entre versões
- **Schema updates:** Atualizar schema automaticamente
- **Data validation:** Validar ao importar
- **Error recovery:** Recuperar de erros de importação

---

## 15. Arquitetura e Próximos Passos

### 15.1 Refatorações Arquiteturais

#### 15.1.1 Code Organization
- **Feature-based structure:** Organizar por feature
- **Shared components:** Biblioteca de componentes compartilhados
- **Custom hooks library:** Biblioteca de hooks
- **Utils organization:** Melhor organização de utils
- **Type definitions:** Centralizar types

#### 15.1.2 Testing
- **Unit tests:** Testes unitários (Vitest)
- **Integration tests:** Testes de integração
- **E2E tests:** Testes end-to-end (Playwright)
- **Visual regression:** Testes visuais
- **Test coverage:** Meta de cobertura >80%

#### 15.1.3 Documentation
- **Code documentation:** JSDoc completo
- **API documentation:** Documentar API interna
- **Component storybook:** Storybook para componentes
- **Architecture docs:** Documentação de arquitetura
- **Contributing guide:** Guia de contribuição

### 15.2 Infraestrutura

#### 15.2.1 Backend Development
- **API server:** Backend próprio (Node.js/Express, Nest.js)
- **Database:** PostgreSQL/MongoDB
- **Authentication:** Sistema de auth
- **File storage:** S3/CloudFlare R2
- **Real-time:** WebSockets/Socket.io

#### 15.2.2 DevOps
- **CI/CD:** Pipeline de CI/CD
- **Automated deployment:** Deploy automático
- **Monitoring:** Sentry, LogRocket
- **Analytics:** Plausible, PostHog
- **Feature flags:** LaunchDarkly, PostHog

### 15.3 Features Transformadoras

#### 15.3.1 Collaboration
- **Real-time collaboration:** Edição colaborativa em tempo real
- **Comments system:** Sistema de comentários e annotations
- **Version control:** Sistema de versionamento tipo Git
- **Activity feed:** Feed de atividades
- **Mentions & notifications:** Sistema de menções

#### 15.3.2 AI Avançada
- **AI copilot:** Assistente AI sempre presente
- **Voice input:** Comandos por voz
- **OCR:** Extrair texto de imagens
- **Smart templates:** Templates gerados por IA
- **Auto-organization:** Organização automática inteligente

#### 15.3.3 Mobile
- **Mobile app:** App nativo (React Native)
- **Touch optimization:** Otimizado para touch
- **Mobile-first features:** Features específicas mobile
- **Offline-first:** Funcionar offline completamente
- **Sync:** Sincronização mobile-desktop

### 15.4 Integrações

#### 15.4.1 Third-party
- **Notion integration:** Importar/exportar do Notion
- **Figma plugin:** Plugin para Figma
- **Slack/Discord:** Notificações e comandos
- **Google Drive:** Sincronizar com Drive
- **Zapier/Make:** Automações

#### 15.4.2 APIs
- **Public API:** API pública documentada
- **Webhooks:** Sistema de webhooks
- **OAuth provider:** OAuth para third-party
- **SDK:** SDKs em várias linguagens
- **GraphQL:** API GraphQL

---

## 🎯 Matriz de Priorização

### Impacto Alto + Esforço Baixo (Quick Wins)
1. ✅ Zoom com mouse wheel (Ctrl+Scroll) **[IMPLEMENTADO]**
2. ✅ Drag to reorder TODOs **[IMPLEMENTADO]**
3. ✅ Progress bar em TODOs **[IMPLEMENTADO]**
4. Copy HEX ao clicar em SWATCH
5. Keyboard shortcuts help (?)
6. Show/hide completed tasks
7. Minimap toggle
8. Export selection only
9. Fuzzy search na command palette
10. Toast positions configuráveis

### Impacto Alto + Esforço Médio
1. Canvas virtualization
2. Toolbar de formatação Markdown
3. Board tree view
4. IndexedDB migration
5. Template gallery visual
6. Auto-backup system
7. Advanced AI features
8. Lasso selection tool
9. Connection edit mode
10. Custom themes builder

### Impacto Alto + Esforço Alto
1. Real-time collaboration
2. Backend integration
3. Mobile app
4. Version control system
5. Plugin system
6. Advanced analytics
7. OCR capabilities
8. Voice commands
9. WASM optimizations
10. GraphQL API

### Impacto Médio + Esforço Baixo (Nice to Have)
1. Sound effects toggle
2. Animation speed control
3. Color naming em swatches
4. Recent searches
5. Board icons
6. Grid size adjustment
7. Custom shortcuts
8. Empty state improvements
9. Loading skeletons
10. Hover cards

---

## 📊 Roadmap Sugerido

### Phase 1: Foundation & UX (1-2 meses)
- [x] Zoom com mouse wheel ✅ **IMPLEMENTADO**
- [ ] Canvas virtualization
- [ ] IndexedDB migration
- [ ] Command palette improvements
- [ ] Keyboard navigation completo
- [ ] Toast system aprimorado
- [ ] Auto-backup
- [ ] Template gallery

### Phase 2: Features & Polish (2-3 meses)
- [x] Advanced TODO features (drag to reorder + progress bar) ✅ **PARCIALMENTE IMPLEMENTADO**
- [ ] Markdown toolbar
- [ ] Connection editing
- [ ] Drawing tools expansion
- [ ] AI feature expansion
- [ ] Export/Import improvements
- [ ] Theme builder
- [ ] Board tree view

### Phase 3: Collaboration & Backend (3-4 meses)
- [ ] Backend API
- [ ] Authentication system
- [ ] Real-time sync
- [ ] Comments system
- [ ] User presence
- [ ] Permissions
- [ ] Cloud storage
- [ ] Version history

### Phase 4: Scale & Extend (Ongoing)
- [ ] Mobile app
- [ ] Public API
- [ ] Plugin system
- [ ] Advanced integrations
- [ ] AI copilot
- [ ] Voice commands
- [ ] Analytics dashboard
- [ ] Community features

---

## 🔧 Considerações Técnicas

### Breaking Changes
Algumas melhorias podem requerer breaking changes:
- Migração localStorage → IndexedDB
- Mudanças no schema de dados
- Nova estrutura de pastas

### Backwards Compatibility
Manter compatibilidade com:
- Dados salvos anteriormente
- URLs de boards compartilhadas
- Export formats

### Performance Budget
Metas de performance:
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- FPS durante interações: 60fps
- Bundle size: < 500KB (gzipped)

### Accessibility Goals
- WCAG 2.1 AA compliance
- Keyboard navigation completa
- Screen reader support
- High contrast mode
- Reduced motion support

---

## 📝 Notas Finais

Este documento é um guia vivo e deve ser atualizado conforme:
- Novas funcionalidades são implementadas
- Feedback dos usuários é coletado
- Tecnologias evoluem
- Prioridades mudam

Para cada melhoria implementada, considere:
1. **User Testing:** Testar com usuários reais
2. **Performance Impact:** Medir impacto de performance
3. **Accessibility:** Garantir acessibilidade
4. **Documentation:** Documentar mudanças
5. **Analytics:** Rastrear uso da feature

---

## 📝 Changelog de Implementações

### 2025-11-23 - v1.0.1

#### ✅ Implementado (Quick Wins)

**1. Zoom com Mouse Wheel (Ctrl+Scroll)**
- Localização: [App.tsx](App.tsx:1397-1437)
- Funcionalidade completa de zoom com `Ctrl/Cmd + Scroll`
- Zoom focado no ponto do mouse (não no centro)
- Limites implementados: 10% a 500%
- Suporte cross-browser e cross-platform

**2. Drag to Reorder TODOs**
- Localização: [DraggableItem.tsx](components/DraggableItem.tsx:207-250)
- Drag and drop nativo com HTML5 Drag API
- Visual feedback durante arrasto (opacidade, borda azul)
- Animações suaves de transição
- Suporte a dark mode

**3. Progress Bar em TODOs**
- Localização: [DraggableItem.tsx](components/DraggableItem.tsx:492-531)
- Barra de progresso visual com gradiente azul
- Contador de tasks (X/Y completadas) no header
- Animação de transição ao completar tasks
- Só exibe quando há pelo menos 1 task

**4. Minimap Interativo (5 features)**
- Localização: [NavigationControls.tsx](components/NavigationControls.tsx) - Reescrita completa
- Click & Drag: Arrastar viewport no minimap para navegar (lines 113-140)
- Click to Jump: Clicar para centralizar viewport (lines 90-110)
- Redimensionável: 3 tamanhos (pequeno/médio/grande) com botão toggle (lines 155-160)
- Toggle Visibility: Botão Eye/EyeOff para mostrar/esconder (line 266)
- Hover Highlights: Items destacados com ring e scale ao hover (lines 220-241)
- Prop adicional em [App.tsx](App.tsx): `setPan` passado para NavigationControls

**5. Navegação por Teclado (4 features)**
- Localização: [App.tsx](App.tsx:1439-1567)
- Arrow Keys: Mover canvas com setas (50px base)
- Shift + Arrow: Movimento rápido (150px - 3x velocidade)
- Space + Drag: Pan temporário com cursor grab/grabbing
- Home Key: Reset para origem (0,0) com zoom 100%
- Proteção: Ignora eventos em inputs/textareas
- Feedback visual: Cursor muda para grab quando Space pressionado

**6. Seleção Avançada (5 features)**
- Localização: [App.tsx](App.tsx:131-208, 1498-1604, 1856-1929, 2043-2068, 2221-2228)
- **Ctrl+A:** Selecionar todos items (keyboard shortcut)
- **Ctrl+Shift+A:** Inverse selection (keyboard shortcut)
- **Escape:** Clear selection ou sair do lasso mode
- **L Key:** Toggle lasso selection mode
- **Seleção por tipo:** 8 comandos no Command Palette (NOTE, TODO, IMAGE, LINK, CONTAINER, BOARD, SWATCH, KANBAN)
- **Select Similar:** Encontra items com mesma cor E tipo
- **Lasso Selection:**
  - Desenhar forma livre com mouse
  - Algoritmo point-in-polygon (ray casting) para detectar items
  - Visual: Stroke roxo tracejado + fill semi-transparente
  - Indicador visual quando modo ativo (badge roxo no canto)
  - Seleciona items cujo centro está dentro do polígono

**7. Feedback Visual de Seleção (4 features)**
- Localização: [App.tsx](App.tsx:139-153, 213-240, 1278-1404, 2233-2297)
- **Contador de Seleção:**
  - Badge azul no topo esquerdo com ícone CheckSquare
  - Mostra "{X} item(s) selected" com plural correto
  - Botão "Clear" integrado para limpar seleção rapidamente
  - Animação slide-in-from-left
  - Suporte dark mode
- **Bounding Box:**
  - Retângulo azul tracejado (#3B82F6) ao redor de múltiplos items selecionados
  - Padding de 8px para melhor visualização
  - Stroke width 2px com dash pattern (8,4)
  - Border radius 4px
  - Só aparece quando 2+ items estão selecionados
- **Handles de Grupo (Redimensionamento):**
  - 8 handles posicionados: cantos (nw, ne, se, sw) e bordas (n, e, s, w)
  - Handles brancos com borda azul (10x10px)
  - Cursores apropriados (nwse-resize, nesw-resize, ns-resize, ew-resize)
  - Hover effect com scale 1.25x
  - Redimensionamento proporcional de todos items selecionados
  - Tamanho mínimo 100x100px
  - Salva no histórico (undo/redo)
- **Ghost Preview (Multi-drag):**
  - Retângulos semi-transparentes (opacity 0.4) durante drag
  - Fill azul (#3B82F6) com stroke (#1E40AF)
  - Stroke tracejado (4,4) para diferenciação
  - Border radius 8px
  - Mostra posição futura de todos items
  - Limpa automaticamente ao soltar

**8. Smart Guides e Alinhamento (5 features)**
- Localização: [App.tsx](App.tsx:283-361, 1108-1247, 2722-2838), [hooks/useSmartGuides.ts](hooks/useSmartGuides.ts:33-74)
- **1. Snap to Grid:**
  - Grade visual com padrão de pontos cinzas semi-transparentes
  - Toggle com tecla `G` (ativar/desativar)
  - 3 tamanhos configuráveis: 10px, 20px, 50px (via Command Palette)
  - Snapping automático de posição ao arrastar quando ativado
  - Prioridade máxima: desabilita outros snaps quando ativo
  - Renderização: SVG pattern com círculos em [App.tsx:2722-2736](App.tsx#L2722-L2736)
- **2. Distribuição Inteligente:**
  - Distribui 3+ items selecionados com espaçamento igual
  - Keyboard shortcuts: `Shift+H` (horizontal), `Shift+V` (vertical)
  - Mantém primeiro e último item fixos, redistribui os intermediários
  - Validação: exige mínimo 3 items, mostra erro caso contrário
  - Funcionalidade em [App.tsx:1108-1180](App.tsx#L1108-L1180)
- **3. Alinhamento Múltiplo:**
  - 6 comandos via Command Palette para alinhar 2+ items:
    - Align Left (bordas esquerdas)
    - Align Right (bordas direitas)
    - Align Top (bordas superiores)
    - Align Bottom (bordas inferiores)
    - Align Center Horizontally (centraliza horizontalmente)
    - Align Center Vertically (centraliza verticalmente)
  - Validação: exige mínimo 2 items
  - Toast de confirmação após cada alinhamento
  - Funcionalidade em [App.tsx:1190-1247](App.tsx#L1190-L1247)
- **4. Indicadores de Distância:**
  - Mostra distância numérica (em pixels) entre items ao arrastar
  - Apenas para items próximos (threshold < 200px)
  - Visual: linha tracejada laranja (#F59E0B) com end caps
  - Label central com número + "px" e text shadow branco
  - Detecta alinhamento aproximado (±50px) vertical ou horizontal
  - Cálculo em [App.tsx:283-361](App.tsx#L283-L361)
  - Renderização SVG em [App.tsx:2787-2838](App.tsx#L2787-L2838)
- **5. Guias de Centro do Canvas:**
  - Guias verdes (#10B981) quando item se aproxima do centro da viewport
  - Snap automático ao centro (threshold: 10px ajustado por zoom)
  - Linhas verticais e horizontais atravessando todo canvas
  - Visual: linha tracejada (8,4) com opacity 0.7
  - Prioridade 2: ativa após grid, antes de item-to-item
  - Lógica em [hooks/useSmartGuides.ts:46-74](hooks/useSmartGuides.ts#L46-L74)
  - Renderização em [App.tsx:2763-2785](App.tsx#L2763-L2785)

**Integração do Sistema Smart Guides:**
- Prioridade de snapping: Grid > Center > Item-to-Item
- Grid desabilita outros snaps quando ativo (early return)
- Todos indicadores limpam automaticamente ao soltar mouse
- Múltiplos items: desabilita smart guides, mantém ghost preview
- State management: `isGridEnabled`, `gridSize`, `centerGuides`, `distanceIndicators`

#### 📊 Progresso Geral
- **Quick Wins completados:** 3/10 (30%)
- **Phase 1 completado:** 18/8 (100% + 125% extras) ✅
- **Phase 2 completado:** 7/8 (87.5%) 🎯
- **Total de melhorias implementadas:** 34 features (em 10 grandes grupos)

#### 🎯 Próximas Melhorias Sugeridas (Quick Wins Restantes)
4. Copy HEX ao clicar em SWATCH
5. Keyboard shortcuts help (?)
6. Show/hide completed tasks
7. ~~Minimap toggle~~ ✅ **Implementado**
8. Export selection only
9. Fuzzy search na command palette
10. Toast positions configuráveis

---

### 2025-11-23 - v1.0.3 - Configurações Smart Guides & Drawing Tools

#### ✅ Sessão 7: Configurações de Smart Guides (3 features)

**26. Toggle Snap com Tecla Alt**
- Localização: [App.tsx:1406-1433](App.tsx#L1406-L1433)
- Desabilita todos os tipos de snap (grid, center, item-to-item) ao segurar Alt
- Visual feedback: Badge âmbar "Snap Disabled (Alt)" no topo esquerdo
- Listener global para keydown/keyup/blur (previne snap stuck)
- Limpa todas as guias automaticamente quando Alt é pressionado
- State: `isAltPressed`

**27. Sensibilidade Ajustável**
- Localização: [App.tsx:2548-2583](App.tsx#L2548-L2583), [hooks/useSmartGuides.ts:12,95-97](hooks/useSmartGuides.ts#L95-L97)
- 3 níveis de sensibilidade via Command Palette: 5px (preciso), 10px (padrão), 20px (relaxado)
- Afeta apenas snapping item-to-item (não afeta grid ou center)
- Threshold ajustado por zoom: `effectiveThreshold / zoom`
- Toast de confirmação ao trocar sensibilidade
- State: `snapSensitivity` (default: 5)

**28. Cores Personalizadas das Guias**
- Localização: [App.tsx:2585-2652](App.tsx#L2585-L2652)
- **Guias de Items:** 3 opções (Blue ✓, Purple, Pink)
- **Guias de Centro:** 2 opções (Green ✓, Cyan)
- **Indicadores de Distância:** 2 opções (Orange ✓, Red)
- Seção "Snap Settings" no Command Palette com 10 comandos
- Checkmark (✓) mostra cor ativa
- Aplicado dinamicamente em todas renderizações SVG
- States: `guideColor`, `centerGuideColor`, `distanceIndicatorColor`

#### ✅ Sessão 8: Ferramentas de Desenho Avançadas (6 features)

**29. Paleta de Cores para Desenho**
- Localização: [App.tsx:3137-3165](App.tsx#L3137-L3165)
- 8 cores disponíveis: Blue (default), Red, Green, Yellow, Purple, Pink, Gray, Black
- Seletor visual com botões 8x8px coloridos
- Border azul + scale 110% na cor selecionada
- Hover: scale 105% em cores não selecionadas
- Cores aplicadas tanto no preview em tempo real quanto no desenho salvo
- State: `drawingStrokeColor` (default: '#3B82F6')

**30. Espessura Variável de Traço**
- Localização: [App.tsx:3167-3190](App.tsx#L3167-L3190)
- 3 opções: Thin (2px), Medium (4px - default), Thick (8px)
- Botões com active state (azul) e hover effect
- Armazenado em `item.width` para desenhos
- Afeta strokeWidth tanto no preview quanto na renderização final
- State: `drawingStrokeWidth` (default: 4)

**31. Tipos de Traço (Solid/Dashed/Dotted)**
- Localização: [App.tsx:3192-3221, 2714-2717, 2831-2834](App.tsx#L2714-L2717)
- 3 estilos disponíveis: Solid (default), Dashed, Dotted
- **Dashed pattern:** `strokeWidth * 3` dash, `strokeWidth * 2` gap
- **Dotted pattern:** `strokeWidth` dash, `strokeWidth` gap
- Implementado com SVG `strokeDasharray`
- Armazenado em `item.style.textAlign` (reutilização de campo existente)
- State: `drawingStrokeType` (default: 'solid')

**32. Formas Básicas (5 ferramentas)**
- Localização: [App.tsx:79-141, 3223-3249, 1989-1993, 2819-2823](App.tsx#L79-L141)
- **Helper function:** `generateShapePoints()` converte start+end em pontos apropriados
- **5 ferramentas:**
  1. **Freehand:** Desenho livre (comportamento original)
  2. **Line:** Linha reta (2 pontos)
  3. **Rectangle:** Retângulo fechado (5 pontos formando loop)
  4. **Circle:** Elipse suave (32 segmentos com Math.cos/sin)
  5. **Arrow:** Linha com ponta de seta (arrowLength: 20px, arrowAngle: 30°)
- Grid 3 colunas com ícones (PenLine, Minus, Square, Circle, ArrowRight)
- Preview em tempo real mostra forma enquanto desenha
- State: `drawingShape` (default: 'freehand')

**33. Modo Borracha**
- Localização: [App.tsx:3340-3354, 1771-1799, 2878-2888](App.tsx#L1771-L1799)
- Toggle button vermelho quando ativo
- **Lógica de apagamento:**
  - Raio de detecção: 10px
  - Algoritmo: distance check (√((x-px)² + (y-py)²))
  - Remove desenho inteiro se qualquer ponto intersecta
  - Executa durante mousemove, não apenas mouseup
- **Visual feedback:**
  - Cursor: círculo tracejado vermelho (#EF4444) com fill semi-transparente
  - Atualiza posição em tempo real seguindo mouse
  - Preview de desenho desabilitado em eraser mode
- Selecionar qualquer forma desativa eraser automaticamente
- State: `isEraserMode` (default: false)

**34. Suavização Catmull-Rom**
- Localização: [App.tsx:2330-2357](App.tsx#L2330-L2357)
- **Algoritmo:** Catmull-Rom to cubic Bezier conversion
- **Tension:** 0.5 (centripetal Catmull-Rom - ideal para curvas naturais)
- **Cálculo de pontos de controle:**
  ```
  cp1 = p1 + (p2 - p0) / 6 * tension
  cp2 = p2 - (p3 - p1) / 6 * tension
  ```
- Substitui quadratic bezier anterior (mais suave e natural)
- Aplicado em todas visualizações: preview, desenhos salvos, lasso selection
- SVG path: `C cp1x,cp1y cp2x,cp2y p2x,p2y` (cubic bezier)

**Painel de Ferramentas de Desenho:**
- Localização: [App.tsx:3128-3357](App.tsx#L3128-L3357)
- Aparece no canto inferior esquerdo quando `isDrawingMode` é true
- Background branco/cinza escuro com border e shadow
- 6 seções organizadas: Header, Color, Width, Style, Shape, Eraser
- Animação: slide-in-from-left
- Dark mode support completo
- Substituído quando Lasso Mode está ativo

**Dependências Atualizadas:**
- handleMouseMove: adiciona `isEraserMode`
- handleMouseUp: adiciona `drawingStrokeColor`, `drawingStrokeWidth`, `drawingStrokeType`, `drawingShape`
- Novos ícones importados: `Circle`, `Square`, `ArrowRight`, `Minus`, `PenLine`, `Eraser`

---

### 2025-11-23 - v1.0.6 - Melhorias em CONTAINERs

#### ✅ Sessão 11: Melhorias em CONTAINERs (12 features)

**Contexto:** Implementação completa de customização e funcionalidades avançadas para CONTAINER items, incluindo painel de configurações visual, controles de layout, e operações avançadas.

**45. Padding Controls**
- Localização: [ContainerSettings.tsx:62-71](components/ContainerSettings.tsx#L62-L71), [DraggableItem.tsx:272,364-366](components/DraggableItem.tsx#L364-L366)
- Slider range de 0-40px para ajustar espaçamento interno
- Label mostra valor atual em pixels
- Aplicado via inline style `padding: ${padding}px`
- Default: 12px
- Atualização em tempo real via `onPropertyChange`
- State: `item.padding`

**46. Border Styles**
- Localização: [ContainerSettings.tsx:73-101](components/ContainerSettings.tsx#L73-L101), [DraggableItem.tsx:267-270](components/DraggableItem.tsx#L267-L270)
- 3 estilos disponíveis com botões visuais:
  - **Solid:** Border sólida padrão (`border-solid rounded-xl`)
  - **Dashed:** Border tracejada (`border-dashed`)
  - **Rounded:** Border extra arredondada (`rounded-2xl`)
- Active state: fundo azul + texto branco
- Aplicado via classe CSS dinâmica no container
- Default: 'solid'
- State: `item.borderStyle`

**47. Background Image**
- Localização: [ContainerSettings.tsx:103-123](components/ContainerSettings.tsx#L103-L123), [DraggableItem.tsx:275-282,366,371-373](components/DraggableItem.tsx#L371-L373)
- Input de URL para imagem de fundo
- Botão "Clear" aparece quando há imagem
- CSS aplicado: `backgroundSize: cover`, `backgroundPosition: center`
- Overlay semi-transparente branco (60% + blur) para legibilidade
- Preview em tempo real
- State: `item.backgroundImage`

**48. Auto-resize**
- Localização: [ContainerSettings.tsx:216-223](components/ContainerSettings.tsx#L216-L223), [types.ts:62](types.ts#L62)
- Checkbox toggle para ativar/desativar
- Campo `autoResize` adicionado ao BoardItem interface
- Framework implementado (lógica de expansão automática pendente)
- State: `item.autoResize` (boolean)

**49. Sticky Header**
- Localização: [DraggableItem.tsx:306-308](components/DraggableItem.tsx#L306-L308)
- Implementado com CSS `sticky top-0 z-10`
- Background com `backdrop-blur-sm` para efeito glassmorphic
- Título permanece visível ao scrollar conteúdo do container
- Transições suaves de cor baseado em estado (collapsed/expanded)

**50. Mini Toolbar**
- Localização: [DraggableItem.tsx:321-358](components/DraggableItem.tsx#L321-L358)
- Barra de ações rápidas abaixo do header (sticky top-12)
- 3 botões com ícones lucide-react:
  - Add Note (StickyNote icon)
  - Add Task (CheckSquare icon)
  - Add Image (Upload icon)
- Background branco/50 com backdrop-blur
- Hover effects: fundo branco + sombra
- Só aparece quando container não está collapsed
- Integração com `onQuickAdd` callback

**51. Auto-layout**
- Localização: [ContainerSettings.tsx:125-164](components/ContainerSettings.tsx#L125-L164), [types.ts:63](types.ts#L63)
- Grid 2x2 com 4 modos:
  - **None:** Sem layout automático (default)
  - **Grid:** Layout em grade (ícone Grid3x3)
  - **List:** Layout em lista vertical (ícone List)
  - **Masonry:** Layout tipo Pinterest (ícone Columns)
- Active state: azul
- Icons visuais para cada modo
- State: `item.autoLayout`

**52. Sort Contents**
- Localização: [ContainerSettings.tsx:166-182](components/ContainerSettings.tsx#L166-L182), [types.ts:64](types.ts#L64)
- Dropdown select com ícone SortAsc
- 4 opções de ordenação:
  - No sorting (none)
  - By type (agrupa por ItemType)
  - By date (ordena por timestamp)
  - By size (ordena por width × height)
- State: `item.sortBy`

**53. Filter View**
- Localização: [ContainerSettings.tsx:184-202](components/ContainerSettings.tsx#L184-L202), [types.ts:65](types.ts#L65)
- Dropdown select com ícone Filter
- 5 opções de filtro:
  - Show all (padrão)
  - Notes only (ItemType.NOTE)
  - Tasks only (ItemType.TODO)
  - Images only (ItemType.IMAGE)
  - Links only (ItemType.LINK)
- State: `item.filterType`

**54. Lock Container**
- Localização: [ContainerSettings.tsx:227-237](components/ContainerSettings.tsx#L227-L237), [App.tsx:1123-1129,1807-1808](App.tsx#L1807-L1808), [DraggableItem.tsx:288-289,314-317](components/DraggableItem.tsx#L314-L317)
- Toggle button no painel de settings (ícones Lock/Unlock)
- Ícone de cadeado 🔒 no header quando locked
- Cursor muda para `cursor-not-allowed`
- Previne drag em `handleItemMouseDown` (early return)
- onMouseDown desabilitado no header e body quando locked
- Handler: `handleToggleLockContainer`
- State: `item.locked`

**55. Clone with Contents**
- Localização: [ContainerSettings.tsx:238-243](components/ContainerSettings.tsx#L238-L243), [App.tsx:1086-1120](App.tsx#L1086-L1120)
- Botão "Clone with Contents" com ícone Copy
- Lógica aprimorada em `handleDuplicate`:
  - Detecta items filhos usando center-in-bounds
  - Clona container com novo UUID
  - Clona TODOS os items filhos recursivamente
  - Preserva offsets relativos (posição relativa ao pai)
  - Offset de 30px para novo container
  - Clona também todos os `todos` de cada item filho
- Seleção automática do container clonado
- Integrado com sistema de undo/redo

**56. Export Container**
- Localização: [ContainerSettings.tsx:244-251](components/ContainerSettings.tsx#L244-L251), [App.tsx:1168-1172](App.tsx#L1168-L1172), [utils/exportContainer.ts](utils/exportContainer.ts)
- Botão "Export Container" com ícone Download
- Exporta estrutura JSON completa:
  - Container metadata (title, config)
  - Todos items filhos
  - Item count
  - Board title
  - Export date (ISO string)
- Nome do arquivo: `{containerTitle}-{timestamp}.json`
- Download automático via Blob + createObjectURL
- Handler: `handleExportContainer`

**Componentes Criados:**

**ContainerSettings Component**
- Localização: [components/ContainerSettings.tsx](components/ContainerSettings.tsx)
- Painel de configurações completo (264 linhas)
- Aparece no hover com ícone Settings (gear)
- Posicionamento: absolute top-2 right-2 z-20
- Backdrop branco com border e shadow-xl
- 7 seções organizadas:
  1. Padding control (slider)
  2. Border styles (3 botões)
  3. Background image (input + clear)
  4. Auto-layout (grid 2x2)
  5. Sort/Filter (dropdowns)
  6. Auto-resize (checkbox)
  7. Actions (lock/clone/export)
- Stoppa propagação de mouse events
- Dark mode support pendente

**Utility Function**
- Localização: [utils/exportContainer.ts](utils/exportContainer.ts)
- 57 linhas de código
- Validação de tipo CONTAINER
- Detecção de children por center-in-bounds
- Estrutura JSON bem formatada (indent 2)
- Error handling com console.error
- Cross-browser compatible (Blob API)

**Types Atualizados:**
- Localização: [types.ts:58-67](types.ts#L58-L67)
- 9 novos campos em BoardItem interface:
  - `padding?: number`
  - `backgroundImage?: string`
  - `borderStyle?: 'solid' | 'dashed' | 'rounded'`
  - `autoResize?: boolean`
  - `autoLayout?: 'none' | 'grid' | 'list' | 'masonry'`
  - `sortBy?: 'type' | 'date' | 'size' | 'none'`
  - `filterType?: ItemType | 'all'`
  - `pinnedItems?: string[]`
  - `locked?: boolean`

**Props Adicionados:**
- DraggableItemProps em [DraggableItem.tsx:51-54](components/DraggableItem.tsx#L51-L54):
  - `onContainerPropertyChange?: (id: string, property: Partial<BoardItem>) => void`
  - `onToggleLockContainer?: (id: string) => void`
  - `onExportContainer?: (id: string) => void`

**Handlers em App.tsx:**
- `handleContainerPropertyChange` (lines 1115-1121): Atualiza propriedades do container
- `handleToggleLockContainer` (lines 1123-1129): Toggle estado locked
- `handleExportContainer` (lines 1168-1172): Trigger exportação

**Integração:**
- ContainerSettings passado para DraggableItem em [DraggableItem.tsx:295-303](components/DraggableItem.tsx#L295-L303)
- Handlers passados de App.tsx para DraggableItem em [App.tsx:3689-3691](App.tsx#L3689-L3691)
- Lock check integrado em handleItemMouseDown

**Visual Design:**
- Sticky header com glassmorphism
- Mini toolbar com hover effects
- Settings panel com opacity-0 → opacity-100 no hover
- Border styles aplicados dinamicamente
- Background image com overlay para legibilidade
- Lock indicator visual no header

**Pendências Identificadas:**
- ⏳ Pin/unpin items: Campo existe, UI e lógica pendentes
- ⏳ Nested containers: Tecnicamente suportado, hierarquia visual pendente
- ⏳ Auto-resize: Campo existe, lógica de expansão pendente
- ⏳ Auto-layout: Seletor implementado, lógica de reorganização pendente
- ⏳ Sort/Filter: Dropdowns implementados, lógica de aplicação pendente

---

**Última atualização:** 2025-11-23
**Versão do documento:** 1.0.6

#### 🚀 Build Info
- **Bundle size:** 776.61 KB (208.67 KB gzipped)
- **Build time:** ~4-5s
- **Status:** ✅ Todos os builds passaram com sucesso
- **Arquivos criados:** 2 (ContainerSettings.tsx, exportContainer.ts)
- **Arquivos modificados:** 4 (types.ts, DraggableItem.tsx, App.tsx, MELHORIAS_COMPLETAS.md)
