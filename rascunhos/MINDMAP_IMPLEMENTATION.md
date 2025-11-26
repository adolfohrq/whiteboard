# Mind Map Implementation - Technical Documentation

## Arquitetura da Solução

### Hook Dedicado: `useMindMapOperations.ts`

O sistema foi implementado através de um hook customizado que encapsula toda a lógica de Mapa Mental, seguindo os princípios de separação de responsabilidades.

#### Funcionalidades Principais:

1. **`createRootNode(position: Position)`**
   - Cria o nó raiz central do mapa mental
   - Estilização automática (XL, Bold, Centralizado)
   - Retorna o ID do nó criado

2. **`addChildNode(parentId, items, connections)`**
   - Adiciona um nó filho ao nó selecionado
   - **Atalho:** `TAB`
   - Layout inteligente com detecção de colisão

3. **`addSiblingNode(currentId, items, connections)`**
   - Adiciona um nó irmão (mesmo nível hierárquico)
   - **Atalho:** `ENTER`
   - Posicionamento vertical automático

4. **`handleArrowNavigation()`**
   - **Seta Direita:** Navega para o primeiro filho
   - **Seta Esquerda:** Navega para o pai
   - **Seta Baixo:** Navega para o próximo irmão
   - **Seta Cima:** Navega para o irmão anterior

---

## Algoritmo de Layout Inteligente

### 1. Detecção de Colisão (Anti-Overlap)

O sistema **não** usa coordenadas fixas (x+200). Ele calcula dinamicamente:

```typescript
// Bounding Box Calculation
const getBoundingBox = (item: BoardItem): BoundingBox => {
  return {
    x: item.position.x,
    y: item.position.y,
    width: item.width || 240,
    height: item.height || 80,
  };
};

// Collision Detection
const doBoxesOverlap = (box1, box2) => {
  return !(
    box1.x + box1.width < box2.x ||
    box2.x + box2.width < box1.x ||
    box1.y + box1.height < box2.y ||
    box2.y + box2.height < box1.y
  );
};
```

### 2. Sistema de Empurrar Nós (Push-Down)

Quando um novo nó é criado, o algoritmo:
- Calcula a posição base abaixo do último irmão
- Verifica colisões com todos os irmãos existentes
- **Move o candidato para baixo** incrementalmente até encontrar espaço livre

```typescript
while (siblingBoxes.some(box => doBoxesOverlap(candidateBox, box))) {
  candidateY += LAYOUT_CONFIG.MIN_VERTICAL_GAP; // Move 20px para baixo
  candidateBox.y = candidateY;
}
```

### 3. Direção Dinâmica

#### Star Burst Layout (Filhos da Raiz)
```typescript
if (isRootChild) {
  const angle = (rootChildIndex / totalRootChildren) * 2 * Math.PI;
  const radius = 350;
  return {
    x: parent.x + Math.cos(angle) * radius,
    y: parent.y + Math.sin(angle) * radius,
  };
}
```

#### Hierarchical Layout (Filhos de Nós Secundários)
```typescript
// Sempre para a direita, com espaçamento vertical inteligente
const baseX = parent.x + HORIZONTAL_SPACING; // +280px
const candidateY = lowestSibling.y + lowestSibling.height + VERTICAL_SPACING;
```

---

## Estilização Hierárquica Automática

### Função `getNodeDepth(itemId, connections, items)`

Calcula a profundidade de um nó na árvore recursivamente:

```typescript
const calculateDepth = (id: string): number => {
  const parentConnection = connections.find(conn => conn.toId === id);
  if (!parentConnection) return 0; // Root
  return 1 + calculateDepth(parentConnection.fromId);
};
```

### Função `getNodeStyle(depth, branchColor)`

Retorna estilo baseado na hierarquia:

| Nível | Tamanho | Peso | Alinhamento | Cor |
|-------|---------|------|-------------|-----|
| 0 (Raiz) | XL | Bold | Center | Dark Gray (#1F2937) |
| 1 (Galhos Principais) | LG | Bold | Left | Cor do Galho (8 cores) |
| 2+ (Folhas) | MD | Normal | Left | Cor do Galho Pai |

### Sistema de Cores por Galho

```typescript
const MINDMAP_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

// Cada galho principal recebe uma cor
const branchColor = MINDMAP_COLORS[branchIndex % 8];
```

A função `getMainBranchIndex()` rastreia qual galho principal (filho da raiz) o nó pertence, garantindo consistência visual em toda a sub-árvore.

---

## Integração com o Sistema

### 1. App.tsx - Listeners de Teclado

No `useEffect` de keyboard shortcuts (linha ~1733):

```typescript
// Mind Map Operations (TAB for child, ENTER for sibling)
handleMindMapKeyDown(e, selectedIds, items, connections, setEditingId);

// Arrow key navigation for mind maps
handleArrowNavigation(e, selectedIds, items, connections, setSelectedIds);
```

### 2. Toolbar.tsx - Botão Mind Map

```tsx
<TooltipWrapper label="Mind Map">
  <ToolbarButton
    aria-label="Create Mind Map"
    onClick={onAddMindMap}
    variant="primary"
  >
    <Workflow size={22} strokeWidth={1.5} />
  </ToolbarButton>
</TooltipWrapper>
```

### 3. Auto-Focus "Seamless"

Quando um novo nó é criado (TAB/ENTER):

```typescript
const newId = addChildNode(selectedId, items, connections);
if (newId) {
  setTimeout(() => setEditingId(newId), 100);
}
```

O `setTimeout` garante que o DOM seja atualizado antes de focar, evitando race conditions.

---

## UX - Fluxo de Trabalho

### Criação de Mapa Mental
1. Clique no botão **Mind Map** (ícone Workflow) na Toolbar
2. Um nó raiz "Central Idea" é criado no centro da viewport
3. Clique no nó para selecioná-lo

### Expansão da Árvore
- **TAB:** Adiciona filho (sub-ideia)
- **ENTER:** Adiciona irmão (ideia paralela)
- **Auto-focus:** O texto do novo nó é focado imediatamente

### Navegação sem Mouse
- **Seta →:** Move para o filho
- **Seta ←:** Move para o pai
- **Seta ↓:** Move para o próximo irmão
- **Seta ↑:** Move para o irmão anterior

### Edição
- Selecione um nó
- Digite para editar o conteúdo
- ESC para sair da edição

---

## Configuração Avançada

### Constantes de Layout (`LAYOUT_CONFIG`)

```typescript
{
  HORIZONTAL_SPACING: 280,   // Espaço pai → filho
  VERTICAL_SPACING: 120,     // Espaço entre irmãos
  MIN_VERTICAL_GAP: 20,      // Gap mínimo anti-colisão
  NODE_WIDTH: 240,           // Largura estimada
  NODE_HEIGHT: 80,           // Altura estimada
  STAR_BURST_RADIUS: 350,    // Raio do layout radial
}
```

Ajuste essas constantes para modificar a densidade do layout.

---

## Limitações e Melhorias Futuras

### Implementado ✅
- Detecção de colisão horizontal e vertical
- Layout Star Burst para raiz
- Layout hierárquico para sub-nós
- Navegação completa por teclado
- Cores automáticas por galho
- Estilização hierárquica
- Auto-focus seamless

### Potenciais Melhorias
- **Layout Automático Global:** Re-calcular posições de toda a árvore ao adicionar/remover nós
- **Animações:** Transições suaves ao adicionar nós
- **Templates:** Mapas mentais pré-configurados (SWOT, Eisenhower, etc.)
- **Export:** Exportar apenas o mind map como SVG
- **Collapse/Expand:** Colapsar sub-árvores para simplificar visualização

---

## Troubleshooting

### "Cannot add sibling to root node"
- Você tentou pressionar ENTER no nó raiz
- Solução: Use TAB para adicionar filhos à raiz

### Nós sobrepostos
- Verifique as constantes `NODE_WIDTH` e `NODE_HEIGHT`
- Aumente `MIN_VERTICAL_GAP` para mais espaço

### Navegação não funciona
- Verifique se há conexões entre os nós
- Use o modo Connection para visualizar as conexões

---

## Arquitetura de Código

```
hooks/
  └── useMindMapOperations.ts (800+ linhas)
      ├── Funções de Layout
      │   ├── calculateChildPosition()
      │   ├── calculateSiblingPosition()
      │   └── doBoxesOverlap()
      ├── Funções de Estilo
      │   ├── getNodeDepth()
      │   ├── getNodeStyle()
      │   └── getBranchColor()
      └── Operações Principais
          ├── createRootNode()
          ├── addChildNode()
          ├── addSiblingNode()
          ├── handleKeyDown()
          └── handleArrowNavigation()

App.tsx
  ├── Importa useMindMapOperations
  ├── Integra listeners de teclado
  └── Passa handleAddMindMap para Toolbar

components/Toolbar.tsx
  └── Botão Mind Map com ícone Workflow
```

---

**Implementação Completa:** 23/11/2025
**Autor:** Claude Code (Tech Lead Mode)
**Arquitetura:** Zustand + React Hooks + Absolute Positioning
