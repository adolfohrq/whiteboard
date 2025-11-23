# Roadmap Técnico e de UX: MilaClone v2

Este documento apresenta uma análise técnica detalhada do estado atual do projeto e propõe melhorias estruturais, funcionais e de experiência do usuário (UX) para elevar o nível da aplicação.

---

## 1. Arquitetura e Refatoração (Prioridade Alta)

Atualmente, o arquivo `App.tsx` atua como um "God Component", gerenciando UI, lógica de estado, regras de negócio, I/O e eventos globais. Isso dificulta a manutenção e a escalabilidade.

### Desacoplamento de Estado

- **Problema:** O uso de um objeto gigante `boards` dentro de um `useState` causa re-renderizações desnecessárias e complexidade na atualização aninhada.
- **Solução:** Migrar para **Zustand**.
  - Permite atualizar propriedades específicas de um item sem clonar toda a árvore de estados.
  - Facilita a persistência e middlewares (logs, undo/redo).

### Separação de Responsabilidades (Hooks)

Quebrar o `App.tsx` em hooks customizados:

- `useSelection.ts`: Lógica de seleção (click, shift+click, rubber-band).
- `useCanvasDrag.ts`: Pan, zoom e arrastar itens.
- `useBoardActions.ts`: CRUD de itens (adicionar, remover, duplicar).
- `useKeyboardShortcuts.ts`: Centralizar listeners de teclado.

### Persistência de Dados

- **Problema:** F5 apaga tudo.
- **Solução Imediata:** Implementar sincronização com `localStorage` (debounce de 1s para salvar).
- **Solução Longo Prazo:** Integração com IndexedDB (Dexie.js) para suportar imagens pesadas em Base64 sem travar a thread principal.

---

## 2. Experiência do Usuário (UX) Essencial

### Sistema de Undo / Redo (Crítico)

Em aplicações de design/canvas, o usuário espera poder desfazer erros.

- **Implementação:** Usar uma pilha de histórico (History Stack) com limite (ex: últimas 20 ações).
- **Atalhos:** `Ctrl+Z` e `Ctrl+Shift+Z`.

### Redimensionamento de Itens (Resizing)

- **Atual:** Os itens têm tamanhos fixos ou calculados magicamente.
- **Melhoria:** Adicionar "alças" (handles) nos cantos dos itens selecionados (principalmente Imagens e Notas) para permitir redimensionamento livre pelo usuário.

### Navegação Real no Browser

- **Problema:** O botão "Voltar" do navegador sai da aplicação em vez de voltar para o Quadro anterior.
- **Solução:** Sincronizar o `currentBoardId` com a URL (ex: `?board=uuid-123`) ou usar React Router. Isso permite compartilhar links diretos para sub-quadros.

---

## 3. Melhorias nas Funcionalidades Existentes

### Kanban 2.0 (Interações Físicas)

- **Atual:** O "Snap" é funcional, mas a inserção visual carece de feedback (ghost placeholder).
- **Melhoria:**
  - Mostrar um "espaço vazio" animado onde o card vai cair _antes_ de soltar o mouse.
  - Permitir reordenar colunas arrastando-as horizontalmente.

### Conexões Inteligentes

- **Atual:** Linhas simples de Bézier.
- **Melhoria:**
  - **Setas:** Opção de adicionar pontas de seta (início/fim).
  - **Rótulos:** Permitir clicar na linha e adicionar texto (ex: "bloqueia", "conecta a").
  - **Ancoragem Dinâmica:** A linha deve se conectar à borda mais próxima do objeto, movendo-se conforme o objeto gira ou se move (atualmente conecta ao centro ou ponto fixo).

---

# Plano de Execução e Status

## Fase 1: Fundação e Estabilidade (Concluído)

_O objetivo é limpar o código e garantir que o usuário não perca dados._

1.  **Persistência de Dados:**
    - [x] Criar hook `useLocalStorage` com debounce.
    - [x] Salvar e carregar o objeto `boards` automaticamente.
2.  **Refatoração do `App.tsx`:**
    - [x] Extrair lógica de _Pan & Zoom_ para `useCanvasControls`.
    - [x] Extrair lógica de _Seleção_ para `useSelection`.
    - [ ] Extrair lógica de _Drag & Drop_ para `useDraggable`.

## Fase 2: Controles Essenciais (Concluído)

_Funcionalidades que "todo app de canvas precisa ter"._

1.  **Gerenciamento de Estado Global (Zustand):**
    - [x] Criar Store `useStore.ts`.
    - [x] Implementar Actions de CRUD (updateBoard, setBoards).
    - [x] Migrar `App.tsx` para usar a Store.
2.  **Undo / Redo (Temporal):**
    - [x] Implementar pilha de histórico (Snapshot) na Store.
    - [x] Conectar atalhos de teclado (`Ctrl+Z`, `Ctrl+Y`).
    - [x] Adicionar botões visuais na Toolbar.
3.  **Redimensionamento (Resizing):**
    - [x] Criar componente `ResizeHandles` que envolve o item selecionado.
    - [x] Atualizar lógica de `width/height` no estado do item.

## Fase 3: Interatividade Avançada (Em Progresso)

_Melhorias de "Quality of Life" e inteligência visual._

1.  **Guias Inteligentes (Smart Guides):**
    - [x] Criar lógica de detecção de alinhamento (X e Y) durante o `onMouseMove`.
    - [x] Renderizar linhas visuais quando coordenadas coincidirem (com threshold de 5px).
2.  **Roteamento:**
    - [x] Sincronizar ID do quadro com a URL do navegador para suportar botões de voltar/avançar do browser.
3.  **Melhorias no Kanban:**
    - [ ] Adicionar "Ghost Item" (placeholder cinza) para mostrar onde o item cairá antes de soltar o mouse.
