# Diretrizes para IA

Este documento fornece instruções para agentes de IA (como Claude, ChatGPT, Gemini) contribuírem efetivamente para este projeto.

## 🧠 Carregamento de Contexto
Ao iniciar uma tarefa, priorize a leitura destes arquivos para entender o sistema:
1.  `docs/PROJECT_OVERVIEW.md` (Contexto de alto nível)
2.  `docs/ARCHITECTURE.md` (Design técnico)
3.  `types.ts` (Modelos de dados)
4.  `store/useStore.ts` (Gerenciamento de estado)

## 📝 Regras de Geração de Código

### TypeScript
- **Sem `any`**: Sempre use tipagem estrita. Se um tipo estiver faltando, defina-o em `types.ts`.
- **Interfaces**: Prefira `interface` em vez de `type` para definições de objetos.
- **Segurança de Nulos**: Lide com `null` e `undefined` explicitamente.

### Componentes React
- **Componentes Funcionais**: Use `React.FC` ou declarações de função padrão.
- **Hooks**: Extraia lógica complexa para hooks personalizados.
- **Tailwind**: Use classes utilitárias para estilização. Evite estilos inline a menos que sejam dinâmicos (ex: coordenadas).

### Atualizações de Estado
- **Imutabilidade**: O Zustand lida com atualizações, mas garanta que você crie novas referências de objeto ao atualizar estado aninhado (ex: `items`).
- **Histórico**: Sempre chame `pushHistory()` antes de mutar o estado do quadro para garantir que o Desfazer funcione.

## 🚫 Armadilhas Comuns
- **Mutação Direta**: Não mute o estado diretamente fora das ações do Zustand.
- **Guerras de Z-Index**: Use as camadas de z-index definidas (Itens: 1-100, UI: 100+).
- **Propagação de Eventos**: Pare a propagação em interações de itens para evitar mover a tela acidentalmente.

## 📚 Regras de Documentação (Documentation as Code)

### A Regra de Ouro: "Definição de Pronto" (DoD)
Nenhuma tarefa ou feature é considerada "concluída" até que a documentação correspondente tenha sido atualizada.

- **Alterou Arquitetura?** -> Atualize `docs/ARCHITECTURE.md`.
- **Novo Componente/Estilo?** -> Atualize `docs/DESIGN_SYSTEM.md`.
- **Nova Regra?** -> Atualize `docs/AI_GUIDELINES.md`.
- **Devo atualizar o 'CLAUDE.MD'?** -> Atualize `CLAUDE.md`.
- **Devo criar um documento especifico pra isso que é importante?** -> Crie um documento .md `docs/`.

### Verificação Contínua
Sempre que modificar um arquivo de código, verifique se isso afeta a documentação em `docs/` e 'CLAUDE.md'. Se afetar, **você deve propor e realizar a atualização do documento no mesmo conjunto de mudanças**.

## 🧪 Testes (Futuro)
- Ao escrever testes, faça mock do hook `useStore` e do `geminiService`.
