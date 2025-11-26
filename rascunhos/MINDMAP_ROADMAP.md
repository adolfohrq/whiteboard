# Mind Map - Roadmap para Nível Profissional

## Status Atual vs. Mindmeister.com

### ✅ Implementado (v1.0)
- [x] Criação de nó raiz
- [x] Adicionar filho (TAB)
- [x] Adicionar irmão (ENTER)
- [x] Navegação por setas
- [x] Cores automáticas por galho
- [x] Estilização hierárquica
- [x] Layout Star Burst para raiz
- [x] Layout hierárquico para sub-nós
- [x] Detecção de colisão
- [x] Auto-focus ao criar nós

### 🎯 Roadmap de Funcionalidades

Este documento descreve melhorias para atingir o nível de ferramentas profissionais como **Mindmeister.com**, **XMind**, e **Coggle**.

---

## Fase 1: Operações Essenciais (Alta Prioridade)

### 1.1 Atalhos de Teclado Avançados

#### Edição Rápida
```typescript
// hooks/useMindMapOperations.ts - adicionar ao handleKeyDown

const KEYBOARD_SHORTCUTS = {
  // Criação
  'Tab': 'Criar filho',
  'Enter': 'Criar irmão',
  'Shift+Tab': 'Criar irmão acima',
  'Ctrl+Enter': 'Criar nó antes do atual',

  // Navegação
  'ArrowUp/Down/Left/Right': 'Navegar entre nós',
  'Home': 'Ir para raiz',
  'End': 'Ir para último filho',
  'PageUp': 'Ir para primeiro irmão',
  'PageDown': 'Ir para último irmão',

  // Edição
  'F2': 'Editar nó selecionado',
  'Esc': 'Cancelar edição',
  'Delete': 'Deletar nó e filhos',
  'Ctrl+D': 'Duplicar nó e sub-árvore',

  // Organização
  'Ctrl+↑': 'Mover nó para cima (entre irmãos)',
  'Ctrl+↓': 'Mover nó para baixo (entre irmãos)',
  'Ctrl+←': 'Promover nó (tornar irmão do pai)',
  'Ctrl+→': 'Rebaixar nó (tornar filho do irmão acima)',

  // Visualização
  'Space': 'Expandir/Colapsar nó',
  'Ctrl+Space': 'Expandir/Colapsar todos',
  '*' (numpad): 'Expandir toda sub-árvore',
  '/' (numpad): 'Colapsar toda sub-árvore',

  // Seleção
  'Shift+↑/↓': 'Selecionar múltiplos irmãos',
  'Ctrl+A': 'Selecionar toda sub-árvore',
  'Ctrl+Shift+A': 'Selecionar todos do mesmo nível',

  // Clipboard
  'Ctrl+C': 'Copiar nó e filhos',
  'Ctrl+X': 'Cortar nó e filhos',
  'Ctrl+V': 'Colar como filho',
  'Ctrl+Shift+V': 'Colar como irmão',
};
```

**Implementação:**
```typescript
// Adicionar ao hook useMindMapOperations.ts

interface MindMapClipboard {
  node: BoardItem;
  children: BoardItem[];
  connections: Connection[];
}

const handleCopyNode = (nodeId: string) => {
  // Copiar nó e toda sub-árvore para clipboard
  const clipboard = extractSubtree(nodeId, items, connections);
  localStorage.setItem('mindmap-clipboard', JSON.stringify(clipboard));
};

const handlePasteNode = (targetId: string, asSibling: boolean) => {
  const clipboard = JSON.parse(localStorage.getItem('mindmap-clipboard'));
  // Recriar sub-árvore com novos IDs
  recreateSubtree(clipboard, targetId, asSibling);
};
```

---

### 1.2 Collapse/Expand (Recolher/Expandir)

**Estado no Item:**
```typescript
// types.ts - adicionar ao BoardItem
interface BoardItem {
  // ... campos existentes

  // Mind Map específico
  collapsed?: boolean;           // Se a sub-árvore está colapsada
  autoCollapse?: boolean;        // Auto-colapsar ao navegar para longe
  collapsedChildrenCount?: number; // Contador visual
}
```

**Lógica de Renderização:**
```typescript
// App.tsx - modificar renderização de connections

const renderConnection = (conn: Connection) => {
  const fromItem = items.find(i => i.id === conn.fromId);
  const toItem = items.find(i => i.id === conn.toId);

  // Não renderizar conexões de nós colapsados
  if (fromItem?.collapsed && isDescendantOf(toItem, fromItem)) {
    return null;
  }

  return <ConnectionLine from={fromItem} to={toItem} />;
};
```

**Indicador Visual:**
```typescript
// components/DraggableItem.tsx - adicionar badge de contagem

{item.collapsed && childrenCount > 0 && (
  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
    {childrenCount}
  </div>
)}
```

---

### 1.3 Reorganização de Nós (Drag & Drop Hierárquico)

**Funcionalidade:**
- Arrastar nó para torná-lo filho de outro
- Arrastar nó entre irmãos para reordenar
- Visual feedback de "drop zone"

**Implementação:**
```typescript
// hooks/useMindMapOperations.ts

const handleNodeDrop = (
  draggedId: string,
  targetId: string,
  dropPosition: 'child' | 'before' | 'after'
) => {
  pushHistory();

  if (dropPosition === 'child') {
    // Reconectar como filho do target
    reconnectAsChild(draggedId, targetId);
  } else {
    // Reconectar como irmão do target
    reconnectAsSibling(draggedId, targetId, dropPosition);
  }

  // Recalcular layout da árvore afetada
  recalculateTreeLayout(targetId);
};
```

**Drop Zones Visuais:**
```typescript
// Mostrar 3 zonas ao arrastar sobre um nó:
// 1. Borda superior: inserir antes
// 2. Centro: tornar filho
// 3. Borda inferior: inserir depois

const getDropZone = (mouseY: number, itemBounds: DOMRect) => {
  const relativeY = mouseY - itemBounds.top;
  const height = itemBounds.height;

  if (relativeY < height * 0.25) return 'before';
  if (relativeY > height * 0.75) return 'after';
  return 'child';
};
```

---

## Fase 2: Estilização Avançada (Média Prioridade)

### 2.1 Ícones nos Nós

**Biblioteca de Ícones:**
```typescript
// types.ts
interface BoardItem {
  mindMapIcon?: string; // Nome do ícone lucide-react
  iconColor?: string;   // Cor customizada do ícone
}
```

**Seletor de Ícones:**
```tsx
// components/IconPicker.tsx

const MINDMAP_ICONS = [
  { category: 'Priority', icons: ['Star', 'Flag', 'AlertCircle', 'CheckCircle'] },
  { category: 'People', icons: ['User', 'Users', 'UserPlus', 'UserCheck'] },
  { category: 'Time', icons: ['Clock', 'Calendar', 'Timer', 'Hourglass'] },
  { category: 'Tasks', icons: ['CheckSquare', 'ListChecks', 'ClipboardList'] },
  { category: 'Finance', icons: ['DollarSign', 'TrendingUp', 'PieChart', 'BarChart'] },
  // ... mais categorias
];

export const IconPicker = ({ onSelect }: { onSelect: (icon: string) => void }) => {
  return (
    <div className="grid grid-cols-6 gap-2 p-4">
      {MINDMAP_ICONS.map(cat => cat.icons.map(icon => (
        <button onClick={() => onSelect(icon)}>
          <Icon name={icon} size={20} />
        </button>
      )))}
    </div>
  );
};
```

**Renderização:**
```tsx
// components/DraggableItem.tsx

{item.mindMapIcon && (
  <div className="absolute -top-3 -right-3">
    <LucideIcon
      name={item.mindMapIcon}
      size={18}
      color={item.iconColor || '#666'}
    />
  </div>
)}
```

---

### 2.2 Boundaries (Contornos/Agrupamentos Visuais)

**Conceito:** Círculos ou retângulos que envolvem grupos de nós relacionados.

```typescript
// types.ts
interface MindMapBoundary {
  id: string;
  nodeIds: string[];        // Nós incluídos
  label: string;            // Título do agrupamento
  color: string;            // Cor da borda
  style: 'rounded' | 'sharp' | 'cloud'; // Estilo visual
  fillOpacity: number;      // Transparência (0-1)
}
```

**Cálculo Automático:**
```typescript
// utils/boundaryCalculator.ts

const calculateBoundaryPath = (nodes: BoardItem[]): string => {
  // Encontrar bounding box de todos os nós
  const padding = 40;
  const minX = Math.min(...nodes.map(n => n.position.x)) - padding;
  const minY = Math.min(...nodes.map(n => n.position.y)) - padding;
  const maxX = Math.max(...nodes.map(n => n.position.x + (n.width || 240))) + padding;
  const maxY = Math.max(...nodes.map(n => n.position.y + (n.height || 80))) + padding;

  // Criar path SVG com cantos arredondados
  return `M ${minX + 20} ${minY}
          L ${maxX - 20} ${minY}
          Q ${maxX} ${minY} ${maxX} ${minY + 20}
          L ${maxX} ${maxY - 20}
          Q ${maxX} ${maxY} ${maxX - 20} ${maxY}
          L ${minX + 20} ${maxY}
          Q ${minX} ${maxY} ${minX} ${maxY - 20}
          L ${minX} ${minY + 20}
          Q ${minX} ${minY} ${minX + 20} ${minY}
          Z`;
};
```

---

### 2.3 Temas Pré-Definidos

**Sistema de Temas:**
```typescript
// themes/mindMapThemes.ts

export interface MindMapTheme {
  name: string;
  rootStyle: ItemStyle & { color: string; borderColor: string };
  branchColors: string[];
  connectionStyle: {
    strokeWidth: number;
    strokeColor: string;
    curved: boolean;
  };
  background: string;
}

export const MINDMAP_THEMES: MindMapTheme[] = [
  {
    name: 'Professional Blue',
    rootStyle: {
      fontSize: 'xl',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#1E3A8A',
      borderColor: '#3B82F6',
    },
    branchColors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
    connectionStyle: {
      strokeWidth: 2,
      strokeColor: '#3B82F6',
      curved: true,
    },
    background: '#F8FAFC',
  },
  {
    name: 'Nature Green',
    rootStyle: {
      fontSize: 'xl',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#064E3B',
      borderColor: '#10B981',
    },
    branchColors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
    connectionStyle: {
      strokeWidth: 3,
      strokeColor: '#059669',
      curved: true,
    },
    background: '#F0FDF4',
  },
  // ... mais temas
];
```

**Aplicação do Tema:**
```typescript
const applyThemeToMindMap = (rootId: string, theme: MindMapTheme) => {
  pushHistory();

  const root = items.find(i => i.id === rootId);
  if (!root) return;

  // Aplicar estilo à raiz
  updateItem(rootId, {
    color: theme.rootStyle.color,
    style: { ...theme.rootStyle },
  });

  // Aplicar cores aos galhos
  const children = getDirectChildren(rootId);
  children.forEach((child, index) => {
    const branchColor = theme.branchColors[index % theme.branchColors.length];
    applyColorToSubtree(child.id, branchColor);
  });
};
```

---

## Fase 3: Layout e Visualização (Média Prioridade)

### 3.1 Modos de Layout Alternativos

**Layouts Disponíveis:**
```typescript
enum MindMapLayout {
  RADIAL = 'radial',           // Atual (Star Burst)
  RIGHT = 'right',             // Todos os filhos para direita
  LEFT = 'left',               // Todos os filhos para esquerda
  HORIZONTAL = 'horizontal',   // Esquerda/Direita alternados
  VERTICAL = 'vertical',       // Organograma (cima para baixo)
  FISHBONE = 'fishbone',       // Diagrama Ishikawa
  TIMELINE = 'timeline',       // Linha do tempo horizontal
}
```

**Implementação de Layout Horizontal:**
```typescript
const calculateHorizontalLayout = (rootId: string, items: BoardItem[]) => {
  const children = getDirectChildren(rootId);
  const leftChildren = children.filter((_, i) => i % 2 === 0);
  const rightChildren = children.filter((_, i) => i % 2 !== 0);

  // Posicionar à esquerda
  leftChildren.forEach((child, index) => {
    updateItemPosition(child.id, {
      x: root.x - HORIZONTAL_SPACING,
      y: root.y + (index * VERTICAL_SPACING) - (leftChildren.length * VERTICAL_SPACING / 2),
    });
  });

  // Posicionar à direita
  rightChildren.forEach((child, index) => {
    updateItemPosition(child.id, {
      x: root.x + HORIZONTAL_SPACING,
      y: root.y + (index * VERTICAL_SPACING) - (rightChildren.length * VERTICAL_SPACING / 2),
    });
  });
};
```

**Layout Vertical (Organograma):**
```typescript
const calculateVerticalLayout = (rootId: string, items: BoardItem[]) => {
  const levels = buildLevelHierarchy(rootId, items, connections);

  levels.forEach((level, levelIndex) => {
    const totalWidth = level.length * (NODE_WIDTH + HORIZONTAL_SPACING);
    const startX = root.x - totalWidth / 2;

    level.forEach((nodeId, nodeIndex) => {
      updateItemPosition(nodeId, {
        x: startX + (nodeIndex * (NODE_WIDTH + HORIZONTAL_SPACING)),
        y: root.y + (levelIndex * VERTICAL_SPACING * 2),
      });
    });
  });
};
```

---

### 3.2 Auto-Layout Inteligente

**Recálculo Global de Layout:**
```typescript
// hooks/useMindMapAutoLayout.ts

export const useMindMapAutoLayout = () => {
  const recalculateLayout = useCallback((rootId: string, layoutMode: MindMapLayout) => {
    pushHistory();

    // 1. Construir árvore de dependências
    const tree = buildDependencyTree(rootId, items, connections);

    // 2. Calcular posições ideais
    const positions = calculateOptimalPositions(tree, layoutMode);

    // 3. Detectar colisões
    const collisions = detectCollisions(positions);

    // 4. Resolver colisões com algoritmo de força
    const resolvedPositions = resolveCollisionsWithForce(positions, collisions);

    // 5. Aplicar posições com animação
    applyPositionsWithAnimation(resolvedPositions, 300);
  }, [items, connections]);

  return { recalculateLayout };
};
```

**Algoritmo de Força (Force-Directed):**
```typescript
const resolveCollisionsWithForce = (
  positions: Record<string, Position>,
  maxIterations = 50
) => {
  const positions = { ...initialPositions };

  for (let i = 0; i < maxIterations; i++) {
    let hasCollision = false;

    // Calcular forças repulsivas entre nós
    Object.keys(positions).forEach(id1 => {
      Object.keys(positions).forEach(id2 => {
        if (id1 === id2) return;

        const box1 = getBoundingBox(positions[id1]);
        const box2 = getBoundingBox(positions[id2]);

        if (doBoxesOverlap(box1, box2)) {
          hasCollision = true;

          // Aplicar força repulsiva
          const force = calculateRepulsiveForce(box1, box2);
          positions[id1].x += force.x;
          positions[id1].y += force.y;
          positions[id2].x -= force.x;
          positions[id2].y -= force.y;
        }
      });
    });

    if (!hasCollision) break;
  }

  return positions;
};
```

---

## Fase 4: Conexões Avançadas (Baixa Prioridade)

### 4.1 Estilos de Conexão

**Tipos de Linha:**
```typescript
// types.ts
interface Connection {
  id: string;
  fromId: string;
  toId: string;

  // Estilização avançada
  style?: 'straight' | 'curved' | 'elbow' | 'organic';
  strokeWidth?: number;
  strokeColor?: string;
  strokeDasharray?: string;  // Para linhas tracejadas
  animated?: boolean;         // Animação de fluxo
  label?: string;             // Texto na conexão
  arrowStyle?: 'none' | 'arrow' | 'diamond' | 'circle';
}
```

**Renderização de Curva Bézier:**
```typescript
// components/ConnectionLine.tsx

const renderCurvedConnection = (from: Position, to: Position) => {
  // Calcular pontos de controle para curva suave
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const controlPoint1 = {
    x: from.x + dx * 0.5,
    y: from.y,
  };

  const controlPoint2 = {
    x: from.x + dx * 0.5,
    y: to.y,
  };

  return (
    <path
      d={`M ${from.x} ${from.y}
          C ${controlPoint1.x} ${controlPoint1.y},
            ${controlPoint2.x} ${controlPoint2.y},
            ${to.x} ${to.y}`}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
};
```

**Conexão Elbow (Ortogonal):**
```typescript
const renderElbowConnection = (from: Position, to: Position) => {
  const midX = (from.x + to.x) / 2;

  return (
    <path
      d={`M ${from.x} ${from.y}
          L ${midX} ${from.y}
          L ${midX} ${to.y}
          L ${to.x} ${to.y}`}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
};
```

---

### 4.2 Relacionamentos Cruzados

**Conceito:** Permitir conexões entre nós que não são pai/filho.

```typescript
// types.ts
interface CrossLinkConnection extends Connection {
  type: 'hierarchy' | 'cross-link';  // Distinguir tipos
  relationshipType?: 'related' | 'depends-on' | 'conflicts' | 'similar';
  bidirectional?: boolean;
}
```

**Modo de Criação:**
```typescript
// App.tsx - adicionar modo de cross-link

const [isCrossLinkMode, setIsCrossLinkMode] = useState(false);
const [crossLinkStartId, setCrossLinkStartId] = useState<string | null>(null);

const handleCrossLinkClick = (itemId: string) => {
  if (!crossLinkStartId) {
    setCrossLinkStartId(itemId);
    showSuccess('Selecione o nó de destino');
  } else {
    // Criar cross-link
    createCrossLink(crossLinkStartId, itemId, 'related');
    setCrossLinkStartId(null);
    setIsCrossLinkMode(false);
  }
};
```

**Renderização Diferenciada:**
```tsx
// Conexões hierárquicas: linhas sólidas
// Cross-links: linhas tracejadas coloridas

{connection.type === 'cross-link' && (
  <line
    x1={from.x}
    y1={from.y}
    x2={to.x}
    y2={to.y}
    stroke="#F59E0B"
    strokeWidth={2}
    strokeDasharray="5,5"
    markerEnd="url(#arrowhead-crosslink)"
  />
)}
```

---

## Fase 5: Colaboração e Export (Baixa Prioridade)

### 5.1 Notas e Anexos nos Nós

```typescript
// types.ts
interface BoardItem {
  // ... campos existentes

  // Mind Map específico
  notes?: string;              // Anotações em Markdown
  attachments?: Attachment[];  // Arquivos anexados
  links?: string[];            // URLs relacionadas
  tags?: string[];             // Tags/categorias
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;           // 0-100 para tasks
  dueDate?: string;            // ISO date string
  assignee?: string;           // Para colaboração
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'doc' | 'link';
  size: number;
}
```

**Painel de Detalhes:**
```tsx
// components/MindMapNodeDetails.tsx

export const MindMapNodeDetails = ({ nodeId }: { nodeId: string }) => {
  const node = useStore(s => s.getCurrentBoard().items.find(i => i.id === nodeId));

  return (
    <div className="absolute right-4 top-4 w-80 bg-white p-4 rounded-lg shadow-xl">
      <h3 className="font-bold mb-4">{node.content}</h3>

      {/* Notas */}
      <section className="mb-4">
        <label className="text-sm font-semibold">Notes</label>
        <textarea
          value={node.notes || ''}
          onChange={(e) => updateNodeNotes(nodeId, e.target.value)}
          className="w-full h-32 p-2 border rounded"
        />
      </section>

      {/* Prioridade */}
      <section className="mb-4">
        <label className="text-sm font-semibold">Priority</label>
        <select
          value={node.priority || 'medium'}
          onChange={(e) => updateNodePriority(nodeId, e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </section>

      {/* Anexos */}
      <section>
        <label className="text-sm font-semibold">Attachments</label>
        <AttachmentList attachments={node.attachments || []} />
      </section>
    </div>
  );
};
```

---

### 5.2 Export Avançado

**Formatos de Export:**
```typescript
// utils/mindMapExporter.ts

export enum ExportFormat {
  PNG = 'png',
  SVG = 'svg',
  PDF = 'pdf',
  MARKDOWN = 'markdown',
  FREEMIND = 'freemind',      // XML format
  OPML = 'opml',              // Outline format
  JSON = 'json',              // Estrutura raw
}
```

**Export para Markdown:**
```typescript
const exportToMarkdown = (rootId: string, items: BoardItem[], connections: Connection[]) => {
  const buildMarkdown = (nodeId: string, depth = 0): string => {
    const node = items.find(i => i.id === nodeId);
    if (!node) return '';

    const indent = '  '.repeat(depth);
    const bullet = depth === 0 ? '#' : '-';

    let md = `${indent}${bullet} ${node.content}\n`;

    // Adicionar notas
    if (node.notes) {
      md += `${indent}  > ${node.notes}\n`;
    }

    // Adicionar tags
    if (node.tags && node.tags.length > 0) {
      md += `${indent}  Tags: ${node.tags.map(t => `#${t}`).join(' ')}\n`;
    }

    // Processar filhos
    const children = connections
      .filter(c => c.fromId === nodeId)
      .map(c => c.toId);

    children.forEach(childId => {
      md += buildMarkdown(childId, depth + 1);
    });

    return md;
  };

  return buildMarkdown(rootId);
};
```

**Export para SVG:**
```typescript
const exportToSVG = (rootId: string, items: BoardItem[], connections: Connection[]) => {
  // Calcular bounding box de toda a árvore
  const bounds = calculateTreeBounds(rootId, items);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${bounds.width}"
         height="${bounds.height}"
         viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}">

      <!-- Conexões -->
      ${connections.map(conn => renderConnectionSVG(conn, items)).join('\n')}

      <!-- Nós -->
      ${items.map(item => renderNodeSVG(item)).join('\n')}
    </svg>
  `;

  return svg;
};
```

---

## Fase 6: Inteligência e Automação (Futuro)

### 6.1 Sugestões de IA (Gemini Integration)

```typescript
// services/mindMapAI.ts

export const suggestChildNodes = async (parentContent: string) => {
  const prompt = `
    Você está ajudando a criar um mapa mental.
    O nó pai tem o conteúdo: "${parentContent}"

    Sugira 3-5 sub-tópicos relevantes que poderiam ser filhos deste nó.
    Retorne apenas um array JSON de strings.
  `;

  const ideas = await generateIdeas(prompt);
  return ideas;
};

export const autoOrganizeMindMap = async (rootId: string, items: BoardItem[]) => {
  const content = items.map(i => i.content).join(', ');

  const prompt = `
    Analise este mapa mental: ${content}

    Sugira uma reorganização hierárquica otimizada.
    Retorne JSON com estrutura: { nodeId: parentId }
  `;

  const suggestions = await callGemini(prompt);
  return suggestions;
};
```

**Auto-Complete durante digitação:**
```tsx
// components/MindMapNodeEditor.tsx

const [suggestions, setSuggestions] = useState<string[]>([]);

useEffect(() => {
  if (content.length > 3) {
    debounce(() => {
      suggestChildNodes(content).then(setSuggestions);
    }, 500);
  }
}, [content]);

return (
  <div>
    <textarea value={content} onChange={...} />

    {suggestions.length > 0 && (
      <div className="suggestions">
        {suggestions.map(sug => (
          <button onClick={() => setContent(sug)}>
            {sug}
          </button>
        ))}
      </div>
    )}
  </div>
);
```

---

### 6.2 Templates Prontos

```typescript
// templates/mindMapTemplates.ts

export const MINDMAP_TEMPLATES = [
  {
    name: 'Project Planning',
    description: 'Template para planejamento de projetos',
    structure: {
      root: 'Project Name',
      branches: [
        {
          name: 'Goals & Objectives',
          children: ['Short-term goals', 'Long-term goals', 'KPIs'],
        },
        {
          name: 'Resources',
          children: ['Team members', 'Budget', 'Tools & Software'],
        },
        {
          name: 'Timeline',
          children: ['Milestones', 'Deadlines', 'Dependencies'],
        },
        {
          name: 'Risks',
          children: ['Potential issues', 'Mitigation strategies'],
        },
      ],
    },
  },
  {
    name: 'SWOT Analysis',
    structure: {
      root: 'Business/Product',
      branches: [
        { name: 'Strengths', children: ['Internal advantage 1', '...'] },
        { name: 'Weaknesses', children: ['Internal limitation 1', '...'] },
        { name: 'Opportunities', children: ['External opportunity 1', '...'] },
        { name: 'Threats', children: ['External threat 1', '...'] },
      ],
    },
  },
  {
    name: 'Decision Making',
    structure: {
      root: 'Decision',
      branches: [
        { name: 'Option A', children: ['Pros', 'Cons', 'Costs'] },
        { name: 'Option B', children: ['Pros', 'Cons', 'Costs'] },
        { name: 'Criteria', children: ['Priority 1', 'Priority 2'] },
      ],
    },
  },
  {
    name: 'Learning/Study',
    structure: {
      root: 'Topic',
      branches: [
        { name: 'Key Concepts', children: ['Concept 1', 'Concept 2'] },
        { name: 'Examples', children: ['Example 1', 'Example 2'] },
        { name: 'Questions', children: ['Question 1', 'Question 2'] },
        { name: 'Resources', children: ['Books', 'Videos', 'Articles'] },
      ],
    },
  },
];
```

**Criação a partir de Template:**
```typescript
const createFromTemplate = (template: MindMapTemplate, position: Position) => {
  pushHistory();

  // Criar raiz
  const rootId = createRootNode(position);
  updateItem(rootId, { content: template.structure.root });

  // Criar galhos
  template.structure.branches.forEach((branch, index) => {
    const branchId = addChildNode(rootId, items, connections);
    updateItem(branchId, { content: branch.name });

    // Criar filhos do galho
    branch.children.forEach(childContent => {
      const childId = addChildNode(branchId, items, connections);
      updateItem(childId, { content: childContent });
    });
  });

  // Auto-layout
  recalculateLayout(rootId, MindMapLayout.RADIAL);
};
```

---

## Comparativo: Implementação Atual vs. Mindmeister

| Funcionalidade | Status | Prioridade | Complexidade |
|----------------|--------|------------|--------------|
| **Criação de nós (TAB/ENTER)** | ✅ Implementado | - | - |
| **Navegação por setas** | ✅ Implementado | - | - |
| **Cores automáticas** | ✅ Implementado | - | - |
| **Layout inteligente** | ✅ Implementado | - | - |
| Collapse/Expand | ⏳ Roadmap | Alta | Média |
| Drag & Drop hierárquico | ⏳ Roadmap | Alta | Média |
| Copiar/Colar sub-árvore | ⏳ Roadmap | Alta | Baixa |
| Atalhos avançados (Ctrl+↑/↓) | ⏳ Roadmap | Alta | Baixa |
| Ícones nos nós | ⏳ Roadmap | Média | Baixa |
| Boundaries (agrupamentos) | ⏳ Roadmap | Média | Média |
| Temas visuais | ⏳ Roadmap | Média | Baixa |
| Layouts alternativos | ⏳ Roadmap | Média | Alta |
| Notas e anexos | ⏳ Roadmap | Média | Média |
| Estilos de conexão | ⏳ Roadmap | Baixa | Baixa |
| Cross-links | ⏳ Roadmap | Baixa | Média |
| Export Markdown/SVG | ⏳ Roadmap | Média | Média |
| Sugestões de IA | ⏳ Roadmap | Baixa | Alta |
| Templates prontos | ⏳ Roadmap | Média | Baixa |

---

## Priorização Recomendada

### Sprint 1 (Funcionalidades Críticas)
1. **Collapse/Expand** - Essencial para mapas grandes
2. **Copiar/Colar** - Workflow básico esperado
3. **Atalhos Ctrl+↑/↓** - Reorganização rápida

### Sprint 2 (UX Melhorada)
4. **Drag & Drop hierárquico** - Reorganização visual
5. **Ícones nos nós** - Identificação rápida
6. **Export Markdown** - Integração com outras ferramentas

### Sprint 3 (Visual Avançado)
7. **Temas visuais** - Personalização
8. **Boundaries** - Agrupamentos visuais
9. **Layouts alternativos** - Flexibilidade

### Sprint 4 (Profissional)
10. **Notas e anexos** - Contexto completo
11. **Templates prontos** - Produtividade
12. **Auto-layout inteligente** - Organização automática

---

## Recursos para Estudo

**Referências de Implementação:**
- [Keyboard Shortcuts - MindMeister Help](https://support.mindmeister.com/hc/en-us/articles/360017398960-Use-Keyboard-Shortcuts)
- [MindMeister Keyboard Shortcuts Map](https://www.mindmeister.com/250024644/keyboard-shortcuts)
- [44 MindMeister Keyboard Shortcuts PDF](https://tutorialtactic.com/blog/mindmeister-shortcuts/)

**Bibliotecas Úteis:**
- `react-force-graph` - Algoritmos de força
- `d3-hierarchy` - Cálculos hierárquicos
- `elkjs` - Layout automático de grafos
- `react-mindmap` - Referência open-source

**Algoritmos:**
- Reingold-Tilford Algorithm (tree layout)
- Force-Directed Graph Layout
- Sugiyama Framework (hierarchical layout)

---

## Conclusão

A implementação atual (v1.0) já fornece uma **base sólida** para mind mapping. Este roadmap propõe evoluções graduais que levarão o sistema ao nível de ferramentas profissionais como Mindmeister.

**Recomendação:** Priorizar **Collapse/Expand** e **Copiar/Colar** na próxima iteração, pois são funcionalidades altamente esperadas pelos usuários e relativamente simples de implementar.

---

**Documento mantido por:** Claude Code
**Última atualização:** 2025-11-23
**Versão:** 2.0 (Roadmap)
