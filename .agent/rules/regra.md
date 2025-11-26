---
description: Regras técnicas e de qualidade de código.
globs: **/*.{ts,tsx}
---
# Regras Técnicas

## TypeScript & React
*   **Zero `any`**: Nunca use `any`. Defina interfaces em `types.ts`.
*   **Componentes Funcionais**: Use sempre `React.FC` ou funções nomeadas.
*   **Hooks**: Extraia lógica complexa para `hooks/`.

## Gerenciamento de Estado (Zustand)
*   **Imutabilidade**: Nunca mute o estado diretamente.
*   **Histórico**: Sempre chame `pushHistory()` antes de qualquer mutação de estado para garantir que o Desfazer/Refazer funcione.

## Estilização
*   Use **Tailwind CSS** para tudo.
*   Evite estilos inline (`style={{...}}`) exceto para valores dinâmicos (coordenadas x/y).
*   Siga as cores definidas em `docs/DESIGN_SYSTEM.md`.

## Segurança
*   Sempre sanitize inputs de usuário (especialmente Markdown) usando as funções em `utils/validation.ts`.

## Organização de Arquivos
*   Não crie novos arquivos na raiz sem permissão explícita.
*   Novos componentes devem ir para `components/`.
