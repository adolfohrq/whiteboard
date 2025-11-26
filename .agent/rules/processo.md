---
description: Fluxo de trabalho obrigatório para desenvolvimento de features e correções.
globs: **/*.{ts,tsx,css,md}
---
# Processo de Desenvolvimento

1.  **🧠 Análise Inicial (Obrigatório)**:
    *   Antes de escrever qualquer código, **LEIA** `docs/PROJECT_OVERVIEW.md` e `docs/ARCHITECTURE.md` para entender o contexto.
    *   Se a tarefa envolver UI, consulte `docs/DESIGN_SYSTEM.md`.
    *   Não assuma nada; verifique os arquivos existentes.

2.  **🛠️ Implementação**:
    *   Siga estritamente as regras técnicas definidas em `.agent/rules/regra.md`.
    *   Mantenha a consistência com o estilo existente (Tailwind, Zustand).
    *   **Zero Noise**: Não formate arquivos que não estão relacionados à sua tarefa. Não adicione comentários desnecessários.

3.  **📚 Documentação (CRÍTICO - DoD)**:
    *   **Regra de Ouro**: A tarefa NÃO está pronta até que a documentação esteja atualizada.
    *   Se você alterou a lógica, arquitetura ou UI, você **DEVE** atualizar o arquivo correspondente na pasta `docs/`.
    *   Se criou um novo padrão, atualize `docs/AI_GUIDELINES.md`.

4.  **🔍 Análise de Erros**:
    *   Se um comando falhar, **LEIA** o erro. Não tente cegamente o mesmo comando novamente.
    *   Analise a causa raiz antes de propor uma correção.

5.  **✅ Finalização**:
    *   Rode `npm run lint` para garantir qualidade.
    *   Verifique se o `CLAUDE.md` ou `README.md` precisam de notas adicionais.
