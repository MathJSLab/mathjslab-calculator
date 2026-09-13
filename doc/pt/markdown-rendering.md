# Renderização Markdown no MathJSLab App

## Fluxo atual

`InterpreterConfiguration.ts` inicializa `Markdown` depois de configurar o
interpretador. `Markdown.initialize()` registra extensões no Marked e configura
Mermaid com `startOnLoad: false`, tema `neutral` e segurança `loose`. A
inicialização agora é idempotente.

A renderização tem duas etapas:

1. `Markdown.parse(texto)` produz HTML de forma síncrona. Blocos cercados por
   crases com linguagem `mermaid` geram containers com a classe `mermaid`,
   contendo o código como texto escapado. Os demais blocos e códigos inline
   usam o renderizador padrão do Marked, incluindo escape e classe de
   linguagem. Código inline delimitado por `%...%` ou `%%...%%` é convertido
   pelo interpretador em MathML inline ou block, respectivamente.
2. Depois da inserção do HTML no destino, `await Markdown.typeset(container)`
   procura diagramas no container, inclusive nele próprio e nos Shadow DOMs
   abertos abaixo dele. Mermaid mede e gera o SVG temporariamente no corpo do
   documento; o serviço insere o SVG no destino e chama `bindFunctions`.

MathML é exibido pelo navegador. Não há uma etapa de MathJax nem destaque
automático de sintaxe dos blocos Markdown pelo Highlight.js. O destaque dos
editores e dos comandos de saída é outro fluxo.

## Entradas e destinos

| Entrada          | Carregamento                                                                    | Apresentação                                   |
| ---------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| `markdown(url)`  | `fetch(url)`, verifica `response.ok`, lê texto                                  | Estado `doc`, HTML e diagramas                 |
| `markdown()`     | `showOpenFilePicker`, `File.text()`                                             | Mesmo destino e renderizador, estado `doc`     |
| `help tópico`    | Resolve alias, codifica nome, busca `help/<locale>/<nome>.md` sob `helpBaseUrl` | Estado `info`, HTML e diagramas                |
| `help`           | Busca `help/<locale>/help.md` e acrescenta a lista ordenada de funções internas | Estado `info`, HTML e diagramas                |
| README da página | Busca o arquivo localizado definido por `i18n.page.page.readmeFile`             | Container `mathjslab-readme`, HTML e diagramas |

`externalFunctionTable.ts` implementa `markdown`; `externalCmdWListTable.ts`
implementa `help`; `main.ts` carrega o README. `help` rejeita respostas HTML,
inclusive fallbacks da SPA com status 200. `markdown(url)` ainda não faz essa
verificação. Os carregamentos remotos por esses comandos ficam indisponíveis em
`file:`; o README simplesmente não é carregado nesse protocolo. O seletor local
de `markdown()` é um caminho separado e depende da disponibilidade da File
System Access API.

`markdown(url)` resolve caminhos relativos a partir de um diretório acima da
página localizada, usando `new URL('../', location.href)` como base. Por exemplo,
em `/pt/`, `markdown('help/en/abs.md')` carrega `/help/en/abs.md`, e não
`/pt/help/en/abs.md`. Isso também funciona em `/pt/index.html` e na página raiz.
URLs absolutas de GitHub/CDN e caminhos iniciados por `/` mantêm seus destinos.

Os comandos capturam o `CommandOutputTarget` ativo antes de iniciar operações
assíncronas. Assim, a resposta continua ligada ao comando que a solicitou.
`PromptOutputTarget` escreve em `command-prompt.element.output`;
`BatchOutputTarget` escreve no resultado de uma entrada de `batch-output`.
Ambos vivem em Shadow DOM. `setHTML` atribui `innerHTML`; ele não renderiza
Markdown nem dispara Mermaid por conta própria.

O interpretador permanece síncrono: iniciar um carregamento não bloqueia os
comandos seguintes. A promessa de `typeset` é aguardada dentro do carregamento
remoto, mas não pelo avaliador do interpretador.

## Problemas tratados

- O renderizador inseria código Mermaid diretamente como HTML. Tags, entidades
  e sequências como `</div>` podiam alterar a estrutura antes de Mermaid
  receber o texto. O código agora é escapado e recuperado com `textContent`.
- Um sinalizador global vinculava `parse` e `typeset`: processar um destino
  consumia a indicação de diagramas de outros documentos já analisados. A
  descoberta agora depende do conteúdo de cada destino.
- `map(async ...)` descartava as promessas. Falhas ficavam sem tratamento e
  chamadas seguintes podiam tentar interpretar SVG já renderizado como fonte.
  Um `WeakMap` mantém a tarefa de cada elemento e permite aguardar chamadas
  concorrentes sem renderizá-lo duas vezes.
- IDs dependiam do índice local e do ID do destino. Saídas em lote não têm ID;
  diagramas de documentos distintos podiam reutilizar o mesmo ID. A chamada sem
  argumento também acessava `element!.id`. Agora os IDs usam um contador
  próprio, independente do destino, e o argumento padrão é `document`.
- Erros de diagramas agora aparecem como texto junto da fonte original, sem
  impedir os demais diagramas. `suppressErrorRendering` evita o desenho de uma
  mensagem de erro de Mermaid fora do container de saída.
- Saídas com Mermaid agora usam largura de 100%, como as saídas de gráficos, em
  vez de `max-content`, para dar uma largura definida aos SVGs percentuais.
- O README não chamava `typeset`; agora também processa diagramas.
- `help` sem argumentos agora aplica a mesma restrição em `file:` que
  `help tópico`.

Estas correções cobrem defeitos identificados no código. A confirmação visual
no navegador ainda é necessária para fechar o diagnóstico do caso relatado.

## Limites e próximo componente

O serviço atual não sanitiza HTML livre de Markdown, e Mermaid mantém a
configuração `loose` já existente. Um componente destinado a carregar
documentos externos deve definir explicitamente sua política de confiança e
sanitização, incluindo URLs, HTML, MathML e callbacks de diagramas.

Links e imagens relativos hoje são resolvidos em relação à página da aplicação,
não ao endereço do Markdown carregado. Fragmentos também precisam de navegação
própria dentro de Shadow DOM. O tema Mermaid é fixo e não acompanha a troca de
aparência. O mixin `src/styles/component/_markdown.scss` compartilha as regras
de largura dos documentos entre prompt e saída em lote, nos estados `doc` e
`info`: texto com quebra automática, imagens e SVGs limitados à largura
disponível, e rolagem horizontal local para código, tabelas e fórmulas em bloco.
O restante da apresentação ainda está distribuído entre a página e as saídas.

`openFileDialog` é genérico: ignora arquivos vazios e não oferece estado de
erro ao chamador para falhas de leitura. Erros síncronos de parsing no callback
local também não têm a mesma apresentação dos erros de carregamento remoto.
Esses pontos permanecem para uma revisão do carregamento.

O futuro componente pode receber `src` ou texto diretamente, manter o estado de
carregamento, resolver recursos relativos pela URL de origem e expor uma
promessa ou evento de conclusão. Convém separar:

- Carregamento: fetch, cancelamento, leitura local, validação da resposta e URL
  de origem. A resolução de tópicos, aliases e idiomas de `help` fica fora.
- Renderização: Markdown, conversão matemática injetável, política de HTML,
  Mermaid e erros por bloco.
- Container: tipografia, rolagem, acessibilidade, navegação interna, tema e
  ciclo de vida. Uma nova fonte deve substituir os nós e invalidar operações
  antigas; o `WeakMap` atual pressupõe que cada nó representa uma fonte fixa.

Assim, `markdown`, `help` e README podem reutilizar o componente mantendo suas
regras de carregamento e apresentação. Esta alteração ainda não cria o
componente web.

## Verificação

`node --test script/markdown.test.mjs` executa regressões para preservação da
fonte, códigos comuns, MathML, documentos concorrentes, IDs, repetição, Shadow
DOM, argumento omitido e isolamento de erros. O teste usa o Marked e o serviço
reais, um DOM de teste e um substituto para a geração SVG de Mermaid; não
verifica medidas ou aparência do SVG.

Também foram executados TypeScript sem emissão e compilação Webpack de
desenvolvimento. O navegador integrado não conseguiu abrir a sessão local (erro
de associação da aba à sessão e timeout de navegação), impedindo a verificação
visual nesta execução.

Para a conferência manual, carregar
`markdown('doc/en/row-and-column-major-order.md')`, que contém três diagramas,
no prompt e no editor em lote. Repetir o carregamento e verificar se as saídas
anteriores permanecem visíveis. Conferir também `help`, `help markdown`,
arquivo local com diagrama e um documento com diagrama inválido seguido de
válido.
