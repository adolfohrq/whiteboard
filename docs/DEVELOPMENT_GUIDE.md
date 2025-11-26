# Guia de Desenvolvimento

## 🚀 Começando

### Pré-requisitos
- **Node.js**: v18 ou superior recomendado.
- **npm**: Incluído com o Node.js.

### Instalação
1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env.local` no diretório raiz e adicione sua chave de API do Gemini:
    ```env
    GEMINI_API_KEY=sua_chave_api_aqui
    ```

### Rodando Localmente
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
- Acesse o app em `http://localhost:4124/`.

## 📜 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite. |
| `npm run build` | Compila o projeto para produção na pasta `dist/`. |
| `npm run preview` | Visualiza a build de produção localmente. |
| `npm run lint` | Executa o ESLint para verificar problemas de qualidade de código. |
| `npm run lint:fix` | Corrige automaticamente erros do ESLint corrigíveis. |
| `npm run format` | Formata o código usando Prettier. |

## 📏 Padrões de Código

### TypeScript
- **Modo Estrito**: Ativado. Evite tipos `any`; use interfaces específicas.
- **Interfaces**: Defina interfaces para props e estruturas de dados em `types.ts` ou junto aos componentes se forem privadas.

### Componentes
- **Componentes Funcionais**: Use Componentes Funcionais React (`React.FC` ou tipos de retorno implícitos).
- **Hooks**: Use hooks personalizados para abstrair a lógica dos componentes de UI.
- **Nomeação de Arquivos**: PascalCase para componentes (`MeuComponente.tsx`), camelCase para hooks/utils (`useHook.ts`).

### Gerenciamento de Estado
- **Zustand**: Use a store global para estado compartilhado.
- **Estado Local**: Use `useState` para estado exclusivo da UI (ex: um modal está aberto?).

## 🧪 Testes
*(Atualmente, nenhum framework de teste está totalmente configurado, mas `npm test` é referenciado nos hooks)*
- Futuro: Planejamos usar Vitest.
- **Linting**: Execute `npm run lint` antes de commitar.

## 🤝 Fluxo de Trabalho Git
1.  **Branching**: Crie branches de feature (`feature/minha-feature`) ou correção (`fix/nome-do-bug`).
2.  **Commits**: Use conventional commits (ex: `feat: adicionar novo tipo de item`, `fix: resolver problema de arrastar`).
3.  **Hooks**: Husky está configurado para executar verificações no commit.

## 📚 Manutenção da Documentação
Seguimos a filosofia de **Documentation as Code**.
- **Definição de Pronto (DoD)**: Uma feature só está completa se a documentação em `docs/` estiver atualizada.
- **Atualizações**: Se você alterar a arquitetura, estilos ou fluxo do projeto, atualize os arquivos correspondentes (`ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, etc.) no mesmo Pull Request.
