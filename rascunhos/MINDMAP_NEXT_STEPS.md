# Mind Map - Próximos Passos (Quick Wins)

## 🎯 Implementações Prioritárias

Este guia apresenta as **3 funcionalidades mais impactantes** que podem ser implementadas rapidamente para elevar o sistema ao próximo nível.

---

## 🥇 Prioridade #1: Collapse/Expand

**Impacto:** ⭐⭐⭐⭐⭐
**Dificuldade:** ⚡⚡ (Média-Baixa)
**Tempo estimado:** 2-3 horas

### Por que é crítico?
- Mapas mentais reais podem ter centenas de nós
- Sem collapse/expand, a visualização fica poluída
- Funcionalidade esperada por 100% dos usuários

### Implementação Rápida

#### 1. Adicionar campo ao BoardItem
```typescript
// types.ts - linha ~38
interface BoardItem {
  // ... campos existentes
  collapsed?: boolean; // Adicionar esta linha
}
```

#### 2. Modificar hook useMindMapOperations.ts
```typescript
// hooks/useMindMapOperations.ts - adicionar função

export const toggleNodeCollapse = useCallback((nodeId: string) => {
  pushHistory();

  updateBoard(currentBoardId, (board) => ({
    ...board,
    items: board.items.map(item =>
      item.id === nodeId
        ? { ...item, collapsed: !item.collapsed }
        : item
    ),
  }));
}, [currentBoardId, updateBoard, pushHistory]);
```

#### 3. Adicionar atalho de teclado
```typescript
// hooks/useMindMapOperations.ts - modificar handleKeyDown

if (e.key === ' ' && !isEditing) { // Espaço
  e.preventDefault();
  toggleNodeCollapse(selectedId);
}
```

#### 4. Filtrar renderização de nós colapsados
```typescript
// App.tsx - adicionar helper function

const isNodeVisible = (item: BoardItem): boolean => {
  // Verificar se algum ancestral está colapsado
  let currentId = item.id;

  while (true) {
    const parentConn = connections.find(c => c.toId === currentId);
    if (!parentConn) return true; // Chegou na raiz

    const parent = items.find(i => i.id === parentConn.fromId);
    if (parent?.collapsed) return false; // Ancestral colapsado

    currentId = parentConn.fromId;
  }
};

// No JSX, usar:
{items.filter(isNodeVisible).map(item => (
  <DraggableItem ... />
))}
```

#### 5. Adicionar indicador visual
```typescript
// components/DraggableItem.tsx - adicionar botão de collapse

{/* Botão de Collapse (só para nós com filhos) */}
{hasChildren && (
  <button
    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      onToggleCollapse(item.id);
    }}
  >
    {item.collapsed ? (
      <ChevronDown size={14} />
    ) : (
      <ChevronUp size={14} />
    )}
  </button>
)}

{/* Badge de contagem quando colapsado */}
{item.collapsed && childrenCount > 0 && (
  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
    {childrenCount}
  </div>
)}
```

#### 6. Calcular contagem de filhos
```typescript
// App.tsx ou utils - helper function

const getChildrenCount = (nodeId: string, connections: Connection[]): number => {
  return connections.filter(c => c.fromId === nodeId).length;
};
```

### Resultado
- ✅ Pressione **ESPAÇO** em um nó para colapsar/expandir
- ✅ Badge mostra quantos filhos estão ocultos
- ✅ Botão visual para toggle
- ✅ Filhos de nós colapsados não são renderizados

---

## 🥈 Prioridade #2: Copiar/Colar Sub-Árvore

**Impacto:** ⭐⭐⭐⭐
**Dificuldade:** ⚡⚡ (Média-Baixa)
**Tempo estimado:** 1-2 horas

### Por que é importante?
- Workflow esperado em qualquer editor
- Permite duplicar estruturas complexas
- Economiza tempo ao criar mapas grandes

### Implementação Rápida

#### 1. Adicionar ao hook useMindMapOperations.ts
```typescript
interface MindMapClipboard {
  rootNode: BoardItem;
  descendants: BoardItem[];
  connections: Connection[];
}

const copyNodeWithChildren = useCallback((nodeId: string) => {
  const clipboard: MindMapClipboard = {
    rootNode: items.find(i => i.id === nodeId)!,
    descendants: [],
    connections: [],
  };

  // Função recursiva para coletar descendentes
  const collectDescendants = (currentId: string) => {
    const childConnections = connections.filter(c => c.fromId === currentId);

    childConnections.forEach(conn => {
      const childNode = items.find(i => i.id === conn.toId);
      if (childNode) {
        clipboard.descendants.push(childNode);
        clipboard.connections.push(conn);
        collectDescendants(conn.toId);
      }
    });
  };

  collectDescendants(nodeId);

  // Salvar no localStorage
  localStorage.setItem('mindmap-clipboard', JSON.stringify(clipboard));
  showSuccess('Copied node and subtree');
}, [items, connections]);

const pasteNodeAsChild = useCallback((parentId: string) => {
  const clipboardData = localStorage.getItem('mindmap-clipboard');
  if (!clipboardData) {
    showError('Nothing to paste');
    return;
  }

  const clipboard: MindMapClipboard = JSON.parse(clipboardData);
  pushHistory();

  // Mapa de IDs antigos para novos
  const idMap = new Map<string, string>();

  // Criar novo nó raiz
  const newRootId = `mindmap-${Date.now()}`;
  idMap.set(clipboard.rootNode.id, newRootId);

  const newRoot = {
    ...clipboard.rootNode,
    id: newRootId,
    position: calculateChildPosition(parentId, items, connections),
  };

  // Criar descendentes com novos IDs
  const newDescendants = clipboard.descendants.map(node => {
    const newId = `mindmap-${Date.now()}-${Math.random()}`;
    idMap.set(node.id, newId);

    return {
      ...node,
      id: newId,
      // Posição será recalculada pelo auto-layout
    };
  });

  // Criar conexões com novos IDs
  const newConnections = [
    // Conexão do pai para a raiz da sub-árvore colada
    {
      id: `conn-${Date.now()}`,
      fromId: parentId,
      toId: newRootId,
    },
    // Conexões internas da sub-árvore
    ...clipboard.connections.map(conn => ({
      id: `conn-${Date.now()}-${Math.random()}`,
      fromId: idMap.get(conn.fromId)!,
      toId: idMap.get(conn.toId)!,
    })),
  ];

  updateBoard(currentBoardId, (board) => ({
    ...board,
    items: [...board.items, newRoot, ...newDescendants],
    connections: [...board.connections, ...newConnections],
  }));

  showSuccess('Pasted subtree');
}, [items, connections, currentBoardId, updateBoard, pushHistory]);
```

#### 2. Integrar no handleKeyDown
```typescript
// hooks/useMindMapOperations.ts - adicionar ao handleKeyDown

if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !isEditing) {
  e.preventDefault();
  copyNodeWithChildren(selectedId);
}

if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !isEditing) {
  e.preventDefault();
  pasteNodeAsChild(selectedId);
}
```

### Resultado
- ✅ **Ctrl+C** copia nó e toda sub-árvore
- ✅ **Ctrl+V** cola como filho do nó selecionado
- ✅ IDs são regenerados para evitar conflitos
- ✅ Estrutura hierárquica é preservada

---

## 🥉 Prioridade #3: Reorganização com Ctrl+↑/↓

**Impacto:** ⭐⭐⭐⭐
**Dificuldade:** ⚡ (Baixa)
**Tempo estimado:** 1 hora

### Por que é útil?
- Permite reordenar irmãos rapidamente
- Não precisa de drag & drop
- Funcionalidade padrão em editores

### Implementação Rápida

#### 1. Adicionar ao hook useMindMapOperations.ts
```typescript
const moveNodeUp = useCallback((nodeId: string) => {
  const parentConn = connections.find(c => c.toId === nodeId);
  if (!parentConn) return; // É raiz, não pode mover

  const siblings = connections
    .filter(c => c.fromId === parentConn.fromId)
    .map(c => items.find(i => i.id === c.toId)!)
    .filter(Boolean)
    .sort((a, b) => a.position.y - b.position.y); // Ordenar por Y

  const currentIndex = siblings.findIndex(s => s.id === nodeId);
  if (currentIndex <= 0) return; // Já é o primeiro

  pushHistory();

  // Trocar posições Y
  const currentY = siblings[currentIndex].position.y;
  const aboveY = siblings[currentIndex - 1].position.y;

  updateBoard(currentBoardId, (board) => ({
    ...board,
    items: board.items.map(item => {
      if (item.id === nodeId) {
        return { ...item, position: { ...item.position, y: aboveY } };
      }
      if (item.id === siblings[currentIndex - 1].id) {
        return { ...item, position: { ...item.position, y: currentY } };
      }
      return item;
    }),
  }));

  showSuccess('Moved up');
}, [items, connections, currentBoardId, updateBoard, pushHistory]);

const moveNodeDown = useCallback((nodeId: string) => {
  const parentConn = connections.find(c => c.toId === nodeId);
  if (!parentConn) return;

  const siblings = connections
    .filter(c => c.fromId === parentConn.fromId)
    .map(c => items.find(i => i.id === c.toId)!)
    .filter(Boolean)
    .sort((a, b) => a.position.y - b.position.y);

  const currentIndex = siblings.findIndex(s => s.id === nodeId);
  if (currentIndex >= siblings.length - 1) return; // Já é o último

  pushHistory();

  const currentY = siblings[currentIndex].position.y;
  const belowY = siblings[currentIndex + 1].position.y;

  updateBoard(currentBoardId, (board) => ({
    ...board,
    items: board.items.map(item => {
      if (item.id === nodeId) {
        return { ...item, position: { ...item.position, y: belowY } };
      }
      if (item.id === siblings[currentIndex + 1].id) {
        return { ...item, position: { ...item.position, y: currentY } };
      }
      return item;
    }),
  }));

  showSuccess('Moved down');
}, [items, connections, currentBoardId, updateBoard, pushHistory]);
```

#### 2. Integrar no handleKeyDown
```typescript
// hooks/useMindMapOperations.ts - adicionar ao handleKeyDown

if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp' && !isEditing) {
  e.preventDefault();
  moveNodeUp(selectedId);
}

if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowDown' && !isEditing) {
  e.preventDefault();
  moveNodeDown(selectedId);
}
```

### Resultado
- ✅ **Ctrl+↑** move nó para cima entre irmãos
- ✅ **Ctrl+↓** move nó para baixo entre irmãos
- ✅ Feedback visual instantâneo
- ✅ Integrado com Undo/Redo

---

## 📊 Resumo de Impacto

| Funcionalidade | Tempo | Linhas de Código | Impacto no UX |
|----------------|-------|------------------|---------------|
| Collapse/Expand | 2-3h | ~150 linhas | ⭐⭐⭐⭐⭐ |
| Copiar/Colar | 1-2h | ~100 linhas | ⭐⭐⭐⭐ |
| Ctrl+↑/↓ | 1h | ~80 linhas | ⭐⭐⭐⭐ |
| **TOTAL** | **4-6h** | **~330 linhas** | **Transformacional** |

---

## 🚀 Implementação Recomendada

### Sessão 1 (2-3 horas)
1. Implementar **Collapse/Expand**
2. Testar com mapa mental de 20+ nós
3. Commit: `feat: add collapse/expand to mind maps`

### Sessão 2 (1-2 horas)
4. Implementar **Copiar/Colar**
5. Testar duplicação de sub-árvores complexas
6. Commit: `feat: add copy/paste for mind map subtrees`

### Sessão 3 (1 hora)
7. Implementar **Ctrl+↑/↓**
8. Testar reorganização de irmãos
9. Commit: `feat: add keyboard shortcuts for node reordering`

---

## 🎓 Após Implementação

### Novos Atalhos Disponíveis
```
ESPAÇO       → Colapsar/Expandir nó
Ctrl+C       → Copiar nó e filhos
Ctrl+V       → Colar como filho
Ctrl+↑       → Mover nó para cima
Ctrl+↓       → Mover nó para baixo
```

### Atualizar Documentação
Adicionar ao [MINDMAP_QUICKSTART.md](MINDMAP_QUICKSTART.md):
- Seção sobre collapse/expand
- Seção sobre copiar/colar
- Tabela de atalhos atualizada

---

## 💡 Bonus: Testes Manuais

### Teste de Collapse
1. Criar mapa com raiz + 3 galhos + 3 filhos cada
2. Colapsar um galho (ESPAÇO)
3. Verificar que badge mostra "3"
4. Verificar que filhos não são renderizados
5. Expandir novamente (ESPAÇO)

### Teste de Copiar/Colar
1. Criar estrutura: Raiz → A → A1, A2
2. Selecionar A e pressionar Ctrl+C
3. Selecionar Raiz e pressionar Ctrl+V
4. Verificar que nova sub-árvore foi criada (B → B1, B2)
5. Verificar que IDs são diferentes

### Teste de Reorganização
1. Criar: Raiz → filho1, filho2, filho3
2. Selecionar filho3
3. Pressionar Ctrl+↑ duas vezes
4. Verificar que filho3 agora está na posição de filho1

---

## 📚 Referências

- [Implementação Atual](hooks/useMindMapOperations.ts)
- [Roadmap Completo](MINDMAP_ROADMAP.md)
- [Documentação Técnica](MINDMAP_IMPLEMENTATION.md)

**Sources:**
- [MindMeister Keyboard Shortcuts](https://support.mindmeister.com/hc/en-us/articles/360017398960-Use-Keyboard-Shortcuts)
- [44 MindMeister Shortcuts PDF](https://tutorialtactic.com/blog/mindmeister-shortcuts/)

---

**Conclusão:** Com apenas **4-6 horas de desenvolvimento**, você pode adicionar 3 funcionalidades críticas que elevarão o sistema de Mind Map a um nível profissional competitivo com ferramentas pagas! 🚀
