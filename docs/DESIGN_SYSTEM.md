# Sistema de Design

## 🎨 Paleta de Cores

O projeto usa um sistema de cores semântico definido em variáveis CSS, com suporte para Modo Escuro.

### Cores da Marca
| Nome | Modo Claro | Modo Escuro | Uso |
| :--- | :--- | :--- | :--- |
| **Primária** | `#4f46e5` (Indigo 600) | `#6366f1` (Indigo 500) | Ações principais, estados ativos |
| **Primária Hover** | `#4338ca` (Indigo 700) | `#4f46e5` (Indigo 600) | Estados hover para ações primárias |
| **Secundária** | `#ec4899` (Pink 500) | *Mesmo* | Acentos, destaques |

### Cores da UI
| Nome | Modo Claro | Modo Escuro | Uso |
| :--- | :--- | :--- | :--- |
| **Fundo** | `#f9fafb` (Gray 50) | `#111827` (Gray 900) | Fundo do app |
| **Superfície** | `#ffffff` (White) | `#1f2937` (Gray 800) | Cartões, barras de ferramentas, modais |
| **Borda** | `#e5e7eb` (Gray 200) | `#374151` (Gray 700) | Divisores, inputs |
| **Texto** | `#374151` (Gray 700) | `#d1d5db` (Gray 300) | Conteúdo primário |
| **Texto Secundário** | `#6b7280` (Gray 500) | `#9ca3af` (Gray 400) | Rótulos, metadados |

### Feedback
- **Sucesso**: `#10b981` (Emerald 500)
- **Aviso**: `#f59e0b` (Amber 500)
- **Erro**: `#ef4444` (Red 500)

## 🔤 Tipografia

- **Família da Fonte**: `Inter`, sans-serif
- **Tamanho Base**: 16px (1rem)
- **Pesos**:
    - Regular (400)
    - Médio (500)
    - Negrito (700)

## 🧩 Componentes Principais

### Paleta de Comandos (`cmdk`)
- **Overlay**: Fundo desfocado (`backdrop-filter: blur(4px)`).
- **Diálogo**: Centralizado, largura fixa (max 600px), cantos arredondados (12px).
- **Item**: Layout flex, padding de 12px, cor primária na seleção.

### Tela (Canvas)
- **Grid**: Padrão de pontos (`radial-gradient`) tamanho 24px.
- **Barra de Rolagem**: Oculta (`.no-scrollbar`) para imersão.

## 🎭 Animações
Animações keyframe são definidas em `index.css` para transições suaves:
- `fadeIn`: Fade de opacidade simples.
- `slideInFromTop` / `slideInFromBottom`: Entrada vertical.
- `zoomIn95`: Escala sutil a partir de 95%.
