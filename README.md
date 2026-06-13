# GeoSpace 🪐

> Um laboratório interativo e minimalista para exploração de sólidos geométricos 3D em tempo real.

![Licença](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Tecnologias](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Babylon.js-informational?style=flat-square)
![Estilo](https://img.shields.io/badge/style-Minimalist%20%7C%20Slate%20Dark-darkgreen?style=flat-square)

O **GeoSpace** é uma plataforma educacional e científica de alta fidelidade desenvolvida para renderizar, manipular e calcular propriedades métricas de formas geométricas espaciais. Combinando uma interface escura ultra-moderna (*Slate/Dark*) com o poder matemático do motor gráfico **Babylon.js**, o projeto oferece uma experiência fluida e precisa sem a necessidade de dependências pesadas ou imagens estáticas.

---

## ✨ Demonstração Visual & Design

O ecossistema foi projetado sob os pilares do **minimalismo funcional**:
* **Cards Vetoriais Reativos:** A galeria principal elimina imagens ou screenshots locais, utilizando ícones dinâmicos alimentados pela biblioteca **Lucide** e micro-gradientes com efeito de brilho (*glow*) em *blur*.
* **Sidebar Unificada:** Todo o controle de parâmetros, customização de opacidade, paleta de cores e exibição de resultados matemáticos acontece em um painel lateral integrado, maximizando a área de visualização do canvas 3D.

---

## 🚀 Funcionalidades Principais

* **Renderização 3D Pura:** Modelagem matemática em tempo real de poliedros e corpos redondos com controle de órbita e zoom interativos.
* **Triangulação Avançada:** Algoritmos dedicados para fechamento de malha e cálculo de normais, garantindo que sólidos complexos (como a pirâmide poligonal de $N$ lados) tenham preenchimento e iluminação 100% corretos.
* **Gerenciamento de Memória Eficiente:** Sistema automático de *garbage collection* que destrói completamente o contexto WebGL e os laços de renderização anteriores ao trocar de forma, evitando vazamentos de memória (*memory leaks*) no navegador.
* **Cálculos em Tempo Real:** Atualização instantânea de métricas espaciais:
    * Volume ($V$)
    * Área Total ($A_t$) e Área Lateral ($A_l$)
    * Diagonais Espaciais e Geratrizes

---

## 📂 Estrutura Modular do Projeto

O projeto adota uma arquitetura limpa e de responsabilidade única, centralizando o esqueleto estrutural em um único arquivo HTML:

```text
GeoSpace/
├── index.html              # Ponto de entrada único e esqueleto estrutural da UI
├── css/
│   ├── geral.css           # Variáveis globais (tokens de design), reset e transições
│   ├── galleryForms.css    # Estilização da dashboard principal e cards modernos
│   └── baseForms.css       # Layout do laboratório 3D, sidebar e inputs customizados
└── js/
    ├── geral.js            # Controle de fluxo, ciclo de vida das telas e inicialização global
    ├── galleryForms.js     # Gerador dinâmico do portfólio de sólidos
    ├── forms.js            # Mecanismo puro de fórmulas e equações matemáticas
    └── render3D.js         # Core do motor Babylon.js (construção de malhas, luzes e labels)
