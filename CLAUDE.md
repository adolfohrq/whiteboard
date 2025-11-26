# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão Geral do Projeto

Este é um clone do Milanote - uma ferramenta de colaboração visual construída com React, TypeScript e Vite. Ele fornece um espaço de trabalho de tela infinita onde os usuários podem criar notas, tarefas, imagens, links, contêineres, quadros aninhados, amostras de cores, colunas kanban e desenhos à mão livre. O aplicativo suporta geração de conteúdo com IA via API do Google Gemini.

**IMPORTANTE**: Consulte `docs/AI_GUIDELINES.md` para regras detalhadas sobre geração de código e **manutenção da documentação**. Seguimos uma abordagem de "Documentation as Code" (Documentação como Código) - se você alterar o código, DEVE atualizar a documentação.

## Comandos de Desenvolvimento

### Rodando a aplicação
```bash
npm run dev
```
- Inicia o servidor de desenvolvimento Vite na porta **4124** (não a padrão 3000)
- Acesse em: http://localhost:4124/

### Build
```bash
npm run build
```
- Compila TypeScript e empacota com Vite
- Saída para o diretório `dist/`

### Preview da build de produção
```bash
npm run preview
```

### Linting
```bash
npm run lint              # Verifica erros (falha em avisos)
npm run lint:fix          # Corrige problemas automaticamente
```

### Formatação
```bash
npm run format            # Formata todos os arquivos TS/TSX/CSS/MD
npm run format:check      # Verifica formatação sem alterações
```

### Hooks de pré-commit
- Husky roda `npm test` no pré-commit (embora nenhum framework de teste esteja configurado atualmente)
- lint-staged formata e verifica automaticamente arquivos em stage

## Arquitetura

### Gerenciamento de Estado (Zustand)

O app usa uma única store Zustand ([store/useStore.ts](store/useStore.ts)) com persistência em localStorage:

- **Arquitetura multi-quadro**: `boards` é um `Record<string, BoardData>` onde cada quadro contém itens, conexões e metadados
- **Rastreamento do quadro atual**: `currentBoardId` determina qual quadro está ativo
- **Desfazer/Refazer**: Pilhas de histórico (`past`/`future`) com limite de 20 passos, com debounce de 500ms
- **Persistência**: Apenas `boards` e `currentBoardId` são persistidos (não as pilhas de histórico)
- **Padrão de chave**: Chame `pushHistory()` ANTES de fazer alterações para salvar o estado atual

Hierarquia de quadros:
- Cada `BoardData` tem um `parentId` para navegação
- Itens do tipo `BOARD` têm `linkedBoardId` para apontar para quadros filhos
- O quadro raiz tem ID `'root'` com `parentId: null`

### Sistema de Tipos de Itens

Todos os itens da tela estendem a interface `BoardItem` ([types.ts](types.ts)):

```typescript
enum ItemType {
  NOTE,      // Texto rico com suporte a markdown
  IMAGE,     // Imagens baseadas em URL com capacidade de upload
  TODO,      // Listas de tarefas com checkboxes
  CONTAINER, // Grupos colapsáveis com fundos coloridos
  LINK,      // Previews de URL com busca de metadados
  BOARD,     // Pontos de entrada para quadros aninhados (linkedBoardId)
  SWATCH,    // Itens de paleta de cores (swatchColor)
  KANBAN,    // Colunas Kanban para organização de tarefas
  DRAWING    // Caminhos à mão livre (points[], strokeColor)
}
```

Propriedades específicas por tipo:
- **Links**: `title`, `description`, `imageUrl`, `faviconUrl`, `siteName`, `loading`
- **Boards**: `linkedBoardId` referencia o quadro filho
- **Containers**: estado `collapsed`
- **Swatches**: valor hex `swatchColor`
- **Drawings**: array `points[]` de posições, `strokeColor`
- **Todos**: array `todos[]` com `{id, text, done}`

### Sistema de Tela (Canvas)

Interações da tela são gerenciadas através de hooks personalizados:

- **useCanvasControls** ([hooks/useCanvasControls.ts](hooks/useCanvasControls.ts)): Pan (arrastar com clique do meio) e zoom com atalhos de teclado
- **useSelection** ([hooks/useSelection.ts](hooks/useSelection.ts)): Multisseleção via clique/shift-clique ou caixa de seleção
- **useSmartGuides** ([hooks/useSmartGuides.ts](hooks/useSmartGuides.ts)): Guias de alinhamento ao arrastar itens perto de outros

Padrão de cálculo de transformação em [App.tsx](App.tsx):
```typescript
const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
```

### Integração com IA (Gemini)

Serviço: [services/geminiService.ts](services/geminiService.ts)

Três funções de IA:
1. **generateIdeas(topic)**: Retorna 5 ideias criativas como array de strings usando saída JSON estruturada
2. **expandContent(currentContent)**: Expande texto em um parágrafo mais completo
3. **analyzeBoard(itemsContent)**: Resume o tema do quadro e sugere próximos passos

Configuração da chave de API:
- Configure `GEMINI_API_KEY` em `.env.local`
- Vite expõe como `process.env.API_KEY` via config ([vite.config.ts](vite.config.ts))
- O serviço lida graciosamente com chaves ausentes com erros amigáveis ao usuário

Todas as funções usam o modelo `gemini-2.5-flash` e incluem notificações toast para estados de carregamento.

### Validação e Segurança

Schemas Zod em [schemas/boardItem.schema.ts](schemas/boardItem.schema.ts) validam a estrutura do item.

Utilitários em [utils/validation.ts](utils/validation.ts):
- `validateAndSanitizeUrl()`: Sanitiza URLs e valida contra protocolos permitidos
- `sanitizeText()`: Usa DOMPurify para prevenir XSS em conteúdo do usuário
- `validateBoardItem()`: Validação baseada em Zod para itens completos

Sempre sanitize a entrada do usuário antes de renderizar, especialmente para itens NOTE com markdown.

### Organização de Componentes

- **components/**: Componentes de UI (DraggableItem é o componente central de 1000+ linhas lidando com todos os tipos de itens)
- **hooks/**: Hooks React reutilizáveis para tela, seleção, armazenamento, modo escuro
- **services/**: Integrações externas (IA Gemini, preview de link, extração de cores)
- **utils/**: Notificações toast, tratamento de erros, validação, exportação
- **templates.ts**: Templates de quadro predefinidos (Kanban, SWOT, etc.)

### Alias de Caminho

`@/` mapeia para a raiz do projeto via tsconfig e Vite:
```typescript
import { useStore } from '@/store/useStore';
```

### Estilização

- TailwindCSS carregado via CDN em [index.html](index.html)
- Estilos personalizados em [index.css](index.css) para fundo de grid e barras de rolagem
- Suporte a modo escuro via hook `useDarkMode` com classe `dark` na raiz do documento

### Funcionalidade de Exportação

[utils/exportUtils.ts](utils/exportUtils.ts) fornece `exportBoardAsImage()` usando a biblioteca html-to-image para converter a tela em PNG baixável.

## Configuração ESLint

Principais regras aplicadas:
- `@typescript-eslint/no-explicit-any: "error"` - Tipos `any` não permitidos
- `no-console: "warn"` - Apenas `console.warn` e `console.error` permitidos
- `prefer-const` e `no-var` aplicados
- Regras de hooks React via `eslint-plugin-react-hooks`

## Notas Importantes de Desenvolvimento

1. **Configuração de porta**: Servidor dev roda na 4124, não na porta padrão do Vite
2. **Mutações de estado**: Sempre chame `pushHistory()` antes de `updateBoard()` para suporte a desfazer
3. **Navegação multi-quadro**: Use `setCurrentBoardId()` para trocar quadros, atualize a trilha de navegação (breadcrumb) de acordo
4. **Previews de link**: [services/linkPreview.ts](services/linkPreview.ts) busca metadados; pode falhar devido a CORS
5. **Extração de cor**: [services/colorUtils.ts](services/colorUtils.ts) usa API de canvas para extrair cores dominantes de imagens
6. **Conexões**: Armazenadas separadamente de itens em `BoardData.connections[]` com referências `fromId`/`toId`

## Testes

Nenhum framework de teste está configurado atualmente, mas o hook de pré-commit espera que `npm test` exista. Considere adicionar Vitest ou Jest se for escrever testes.
