# Portfólio - Andrei Kirazian

Portfólio estático de Andrei Kirazian. A prévia local não publica alterações.

## Abrir localmente

Na pasta do projeto, com Python 3 disponível:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Abra http://127.0.0.1:8765/ no mesmo computador. O servidor fica restrito a este computador; encerre com Ctrl+C. Use HTTP em vez de abrir o HTML diretamente, pois os módulos carregam os dados JSON.

## Organização

- `index.html`: apresentação e dois projetos em destaque.
- `projects.html`: lista completa e filtros.
- `project.html?id=D02`: estudo de caso; endereço inexistente mostra um estado próprio.
- `cv.html`: currículo a partir dos dados existentes.
- `assets/css/styles.css`: layout responsivo, tipografia e cinco paletas.
- `assets/js/theme.js`: escolha persistente de tema e preferência do sistema.
- `assets/js/modules/`: componentes, carregamento e estados de erro.
- `assets/data/`: conteúdo existente, preservado para a próxima etapa.

O cabeçalho, a navegação e o contato estão no HTML de cada página e funcionam sem JavaScript. Ao mudar a navegação compartilhada, mantenha os quatro documentos consistentes. Projetos e currículo requerem JavaScript; há mensagens alternativas quando desativado.

## Temas e acessibilidade

Em Aparência: Claro, Escuro, Protanopia, Deuteranopia e Tritanopia. O botão Usar tema do sistema volta a acompanhar a preferência clara/escura do dispositivo. Sem armazenamento disponível, a escolha ainda funciona durante a página atual.

As paletas para daltonismo são preferências visuais, não uma garantia de adequação a todas as pessoas. Todos os temas compartilham navegação por teclado, foco visível, estados com texto/sublinhado, hierarquia de títulos, alvos de pelo menos 44px nos controles principais, suporte a movimento reduzido e cores forçadas. A validação completa exige também testes com leitores de tela reais e conteúdo definitivo.

Space Grotesk e Source Sans 3 carregam pelo Google Fonts com fontes locais de reserva. Imagens ausentes têm indicação explícita, sem imagens fictícias. Os registros de exemplo (Placeholder) permanecem no JSON, mas não aparecem na interface.

## Campos opcionais de projeto

Além dos campos existentes, a interface aceita `role`, `team` (texto ou lista), `period`, `duration`, `imageAlt` e `gallery` (lista de objetos com `src`, `alt` e `caption`). Campos não preenchidos são omitidos. Descreva imagens informativas com `imageAlt`/`alt` antes da publicação; o texto genérico de reserva não substitui uma descrição de conteúdo.

A atualização visual preserva os projetos existentes. O currículo inclui as correções aprovadas de formação (2021 - atual) e gestão das redes sociais institucionais até 2020. A revisão dos textos e a inclusão de projetos recentes ficam para uma etapa posterior.

## Publicação

O GitHub Pages publica a raiz da branch `main` em https://andynee504.github.io/portfolio/. Alterações locais só chegam ao site quando são enviadas para essa branch. As quatro páginas têm `noindex, nofollow`: isso orienta buscadores, mas não protege acesso nem impede compartilhamento do link.
