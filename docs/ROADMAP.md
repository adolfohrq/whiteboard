# Roadmap

## 🚧 Tarefas Ativas
- [ ] **Documentação**: Completar a suíte inicial de documentação (Em Progresso).
- [ ] **Revisão de Documentação**: (Recorrente) A cada 15 dias, ler todo o código e comparar com `docs/` para garantir consistência.
- [ ] **Testes**: Configurar Vitest e escrever testes unitários iniciais para `useStore`.
- [ ] **Performance**: Otimizar renderização para quadros com mais de 100 itens.

## 📋 Backlog
### Funcionalidades
- **Colaboração em Tempo Real**: Integrar um backend WebSocket (ex: Supabase, Firebase) para edição multiplayer.
- **Visualização Mobile**: Melhorar responsividade para dispositivos móveis (atualmente otimizado para desktop).
- **Exportar para PDF**: Adicionar exportação para PDF junto com a exportação de Imagem existente.
- **Templates**: Adicionar uma biblioteca de templates de quadros pré-feitos (Kanban, SWOT, etc.).

### Dívida Técnica
- **Refatorar DraggableItem**: Dividir o componente massivo `DraggableItem` em subcomponentes menores.
- **Acessibilidade**: Melhorar navegação por teclado e rótulos ARIA.

## 🐛 Problemas Conhecidos
- **CORS em Pré-visualizações de Links**: A busca de metadados de links externos frequentemente falha devido ao CORS. Precisa de um servidor proxy.
- **Limites da Tela**: Usuários podem perder itens se moverem a tela para muito longe. Precisa de um botão "Voltar ao Centro".
