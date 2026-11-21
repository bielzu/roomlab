# ROOMLAB

## Estado do projeto

Ainda está nas primeiras versões, e ainda se encontra com muitos bugs, ainda está incompleto.
Para atualizações, quero deixar o usuário ter a liberdade de criar seu próprio móvel

Simulador 3D de decoração e organização de ambientes em JavaScript e Three.js, com suporte a PWA. Versão 4.2.

## Executar no VS Code

Requer Node.js 20 ou superior. Abra esta pasta e execute `npm start`. Acesse http://localhost:3000. Não é necessário instalar dependências: o Three.js está incluído em `dist/vendor/`.

Verificação: `npm run check` e `npm test`.

## Estrutura

- `dist/app.js`: cena 3D, itens, interação e salvamento.
- `dist/planner.js`: comandos locais em português.
- `dist/index.html` e `dist/style.css`: interface.
- `dist/sw.js` e `dist/manifest.webmanifest`: PWA e cache.
- `server.cjs`: servidor local sem dependências.
- `tests/`: testes automatizados.

Os ambientes do usuário ficam salvos no navegador. Use Exportar projeto para criar backups. A instalação do PWA depende do navegador e de HTTPS (ou localhost).

A licença do Three.js e OrbitControls está em `dist/vendor/LICENSE`.

## Documentação detalhada e histórico

# ROOMLAB V4.2 — portas e varanda independente

Em Personalização, use **Adicionar porta**, **Remover porta principal** e o botão **Remover porta** de cada porta extra. Cada porta extra possui parede, posição, estilo e cor próprios; também pode ser arrastada. Remover uma porta fecha seu vão na parede. É possível remover todas as portas.

A varanda possui posição e parede independentes. Arraste a plataforma/guarda-corpo ou use Parede da varanda e Posição da varanda. Posicione uma porta diante da varanda para criar o acesso. As aberturas continuam presas às paredes e não podem se sobrepor. Os dados de portas e varanda são salvos/exportados por ambiente. Projetos antigos mantêm sua porta principal.

Implementação: `doorEnabled`, `extraDoors`, `decorateDoor`, `addDoor`, `syncDoors`, `balconySide`, `balconyOffset`; cortes de parede e arraste atualizados. Cache PWA V4.2.

## Histórico de documentação

# ROOMLAB V4.1 — correções de organização e edição

- Catálogo por Quarto, Sala, Banheiro e Área externa. `productRooms` define os ambientes compatíveis; itens compartilhados aparecem em mais de uma categoria. Trocar o cômodo seleciona sua categoria, mas é possível navegar livremente nas demais.
- Grama natural é um objeto adicional removível, redimensionável e recolorível, com lâminas 3D instanciadas para reduzir chamadas de desenho. O piso permanece abaixo dela. Projetos antigos com piso de grama são convertidos em placas de grama separadas ao abrir.
- Novos itens: prateleira modular com apoio superior e poltrona.
- Clique/toque e arraste diretamente uma janela ou porta para reposicionar. A abertura encaixa na parede mais próxima e o vão e a varanda acompanham. Use “4 paredes” para alcançar aberturas nas paredes ocultas. A altura das janelas permanece fixa; portas ficam no chão. Sobreposições entre aberturas são bloqueadas. `moveOpening` faz a projeção, validação e atualização dos controles.
- Pintar um quadrado e Preencher tudo encerram a ferramenta e devolvem o controle da câmera. `stopPainting` centraliza esse comportamento.
- PWA com cache V4.1. Feche e reabra o aplicativo após carregar a atualização online.

Para executar: abra esta pasta no VS Code, use Node 20 ou superior e execute `npm start`. Para verificar: `npm test` e `npm run check`. Não há dependências a instalar. Os testes cobrem modelos, catálogo, pintura, reposicionamento de aberturas e regras de posicionamento; não substituem teste de toque em dispositivo real.

## Documentação anterior (histórico)

# ROOMLAB V4 — personalização livre

Atualização sobre a V3. Os projetos salvos da V3 são carregados no mesmo navegador. Exporte um JSON para guardar uma cópia.

## Novidades e uso

- Orçamento livre: todos os 62 itens podem ser adicionados sem gastar dinheiro.
- Janelas extras: use **Adicionar janela**. Cada janela tem parede, posição e cor; o estilo é herdado da janela principal no momento da criação. Sobreposições são bloqueadas.
- Varanda: ative **Varanda externa junto à porta** em um ambiente interno. Ela acompanha a parede e posição da porta e permite acesso a pé em Explorar. Mede 2,4 × 1,6 m. A colocação de móveis continua limitada ao interior do cômodo.
- Quintal: no ambiente Externa, escolha cerca de madeira, muro baixo ou sem limite visual. Grama e pedrinhas são materiais de piso; a piscina elevada é adicionada pelo catálogo.
- Pisos: seis materiais (madeira, cerâmica, pedra, grama, pedrinhas e cimento). Escolha material e cor, clique em **Pintar quadrados** e toque no piso. Cada célula mede 50 cm. **Preencher tudo** substitui o piso inteiro e apaga as exceções locais.
- Paredes: selecione uma parede ou todas antes de escolher/aplicar a cor.
- Objetos: escolha **Tudo** ou uma **Parte** no painel de seleção e altere a cor. As partes correspondem às peças geométricas do modelo.
- Box de vidro, toalheiro, saboneteira, tapetes, almofada, flores, velas, aparador, ombrelone, espreguiçadeira, luminária, cesto e bandeja.

## Código da V4

`tileBase` é o acabamento geral. `tilePaint` contém apenas exceções por chave coluna,linha. `buildTiles()` cria a grade, recortando células nas bordas de cômodos com medidas fracionárias. `paintFloor()` projeta o toque no chão e atualiza uma célula; não muda os móveis. Os padrões usam geometria local, sem imagens externas.

`extraWindows` guarda cada janela adicional. `extraValid()` verifica distância entre aberturas, e `buildWallSegments()` recorta todos os vãos. `buildExtras()` desenha janelas e varanda. `onBalcony()` transforma a posição do jogador para as coordenadas da porta, permitindo a passagem sem liberar o restante das paredes.

`yardFence` e `yardColor` controlam o limite do quintal. `wallPaint` guarda cores individuais das paredes. `parts` guarda cores por índice de malha nos objetos. Todos esses dados entram em `captureSpace()` e são validados em `validateSpace()` na importação. O armazenamento conserva a chave e o esquema da V3 por compatibilidade.

## PWA

O service worker usa um cache novo para a V4 e armazena somente os arquivos estáticos do aplicativo. Abre a página pela rede quando possível, usando o cache offline quando necessário. Não guarda respostas arbitrárias de autenticação nem APIs. A instalação exige HTTPS (ou localhost). Abra online após a atualização e feche/reabra o aplicativo para permitir a troca do cache. Os projetos ficam no armazenamento local e são independentes do cache dos arquivos.

## Validação

`npm test` verifica colocação, colisões, escalas, empilhamento, modelos, paredes, múltiplas janelas, varanda, pisos e cercados. `npm run check` verifica a sintaxe. A instalação em aparelhos reais precisa de verificação no navegador escolhido.

---

Documentação original da V3 (referência histórica; orçamento e catálogo foram substituídos pelas regras acima):

# ROOMLAB V3.0 — Ambientes reais em 3D · PWA

**Versão:** 3.0.0 • **Origem:** ROOMLAB V2.1 enviada pelo usuário • **Stack:** HTML, CSS, JavaScript ES Modules, Three.js 0.186.1, Node.js 20+ (servidor local), Service Worker e Web App Manifest.

O ROOMLAB evoluiu de um editor de quartos para um **simulador de ambientes em escala real**. Você pode criar quarto, sala, banheiro e área externa de diferentes tamanhos, comprar móveis, alterar medidas individuais, mudar a posição de portas e janelas, caminhar por quatro paredes, salvar e exportar o projeto. A simulação não substitui medição profissional de obra: formas e colisões são simplificadas.

## 1. Executar e instalar

**No computador (Windows / VS Code):**

1. Extraia o ZIP e abra a pasta `ROOMLAB-V3.0` no VS Code.
2. Tenha o **Node.js 20 ou superior**. As dependências do navegador já vêm inclusas; **não precisa rodar `npm install`**.
3. No terminal da pasta principal, execute `npm start`.
4. Acesse `http://localhost:3000` em Chrome, Edge ou outro navegador com WebGL.
5. Quando surgir o botão **Instalar ROOMLAB**, utilize-o. Se ele não aparecer, procure **Instalar aplicativo** no menu do navegador (a opção depende do navegador e dos critérios de instalação).
6. Para encerrar o servidor, pressione **Ctrl+C**.

Também é possível servir `dist/` com **Live Server** ou hospedar os arquivos estáticos em um servidor HTTPS (GitHub Pages, Netlify, Vercel etc.). **Não abra `index.html` usando `file://`**, pois módulos ES e PWA precisam de HTTP/HTTPS. Para instalar no celular a partir da hospedagem pública, **HTTPS é necessário** (localhost é uma exceção local de desenvolvimento).

**Offline:** depois da primeira visita com conexão, o Service Worker guarda os arquivos essenciais, incluindo o Three.js. O aplicativo pode abrir offline no mesmo dispositivo e origem, desde que o navegador mantenha os dados de armazenamento. Fontes externas são opcionais, e há fontes locais de reserva.

**Ao atualizar uma versão publicada**, faça uma atualização completa (Ctrl+F5) se necessário. Para forçar a renovação do cache do PWA após novas alterações, incremente `CACHE` no arquivo `dist/sw.js`.

## 2. Recursos da versão 3.0

| Requisito | Implementação |
| --- | --- |
| Escolher medidas de quarto | Campos de largura e profundidade independentes entre 2 e 12 m, com casas decimais |
| Medidas de móveis | Selecione um item no 3D; edite largura, profundidade e altura em metros; o modelo é escalonado e a colisão reavaliada |
| Simular seu ambiente | Construa um cômodo com dimensões reais e objetos em coordenadas métricas |
| Modificar por descrição | Interpretador local de frases em português, uma instrução por linha, com comandos reconhecidos explicitamente |
| Mudar porta / janela | Escolha tipo, parede, cor e posição percentual em cada lado; a parede é recortada ao redor da abertura |
| Explorar com quatro paredes | No modo **Explorar**, todas as paredes aparecem; em **Editar**, duas paredes são ocultadas para facilitar a câmera (botão de alternância). A grade métrica de 1 m pode ser ativada no editor |
| Outros ambientes | Quarto, sala, banheiro e área externa, cada um com configuração e móveis independentes |
| Proporção real | 1 unidade da cena Three.js = 1 metro; dimensões e posições dos móveis usam o mesmo sistema |
| PWA | `manifest.webmanifest`, ícones de 192/512 px, `sw.js`, instalação no navegador e uso offline |
| Salvar / recuperar | `localStorage` automático + Exportar / Importar JSON; mantém os quatro cômodos, compras, medidas e posições |
| Catálogo e dinheiro | **46 itens**: os 34 originais mais 12 para outros ambientes; orçamento inicial de **R$ 30.000** |

O projeto ainda usa compras e entregas como na V2.1. Itens pequenos podem ficar sobre superfícies. Vender um móvel que suporta outro item é bloqueado até que ele seja liberado. Todas as compras usam um orçamento compartilhado entre ambientes.

## 3. Como usar

1. **Ambiente:** no topo, escolha Quarto, Sala, Banheiro ou Área externa. Cada espaço mantém sua organização separada.
2. **Medidas do ambiente:** no painel **Ambiente real**, informe `Largura` e `Profundidade` e clique em **Aplicar medidas reais**. Exemplo: `3,5` por `4,2` representa 3,5 × 4,2 metros. Reduzir o ambiente é bloqueado se móveis ficarem fora.
3. **Adicionar:** escolha uma categoria, clique em `+` e abra a entrega. Posicione o item no 3D arrastando. A primeira posição livre é escolhida automaticamente. Venda para recuperar integralmente o preço no protótipo.
4. **Ajustar tamanho de um móvel:** clique nele, edite L/P/A e pressione **Aplicar medidas**. Para uma posição exata, altere **Posição X** e **Posição Z** e use **Mover para posição**. A mudança não é aplicada quando causaria uma colisão ou ultrapassaria os limites. *O escalonamento é proporcional por eixo e não altera o tipo/modelo real do produto.*
5. **Portas e janelas:** selecione estilo, parede (Esquerda, Direita, Fundo ou Frente) e posição de 0% a 100%. Aberturas conflitantes na mesma parede são rejeitadas. Existe a opção de **porta de correr**, além das quatro opções da V2.1.
6. **Explorar:** clique em **Explorar**, caminhe com WASD/setas ou os botões do celular, arraste para olhar e use **Esc** para voltar à edição. Todas as quatro paredes aparecem nesse modo.
7. **Salvar:** o salvamento é automático neste navegador. Clique em **Exportar projeto (.json)** para guardar uma cópia ou **Importar projeto** para reabrir em outro dispositivo. **Recomeçar projeto** apaga o projeto local apenas após confirmação.

### Descrição por texto (sem IA externa)

No painel **Descreva suas modificações**, digite uma instrução por linha e pressione **Aplicar descrição**. Exemplos:

```text
Quarto 3,5 x 4,2 m
Porta de correr na parede direita
Janela de madeira na parede do fundo
Paredes azul
Piso cinza
Mover Cama Nuvem para o canto esquerdo
```

Outros exemplos: `Janela blindex na parede da frente 30%`, `Porta Minecraft no fundo 70%`, `Piso bege`, `Mudar para banheiro` (comando para trocar ambiente).

**Como funciona:** `dist/planner.js` reconhece padrões de medidas, acabamento, estilo, posição de abertura e móveis cadastrados, e `app.js` executa as ações. **Não é um chatbot nem uma IA generativa:** ele não entende descrições ilimitadas, não cria automaticamente móveis inéditos e não interpreta fotos ou plantas. Frases desconhecidas são relatadas na interface e ignoradas, sem inventar ações. Colisões também podem impedir a execução de instruções reconhecidas. O nome do móvel precisa estar no catálogo e o item já precisa ter sido adquirido e colocado.

## 4. Estrutura do código

```text
ROOMLAB-V3.0/
├── README.md                      Explicação técnica e instruções de uso
├── CHANGELOG.md                   Histórico da atualização
├── package.json                   Comandos npm start / check / test
├── server.cjs                     Servidor HTTP em Node.js sem pacotes adicionais
├── tests/
│   ├── placement.cjs              Testes de colisão, modelos, paredes e superfícies
│   └── planner.mjs                Testes de comandos em português
└── dist/                           Pasta pronta para hospedar como site PWA
    ├── index.html                 Layout, campos, componentes e controles
    ├── style.css                  Aparência e responsividade desktop / mobile
    ├── app.js                     Lógica do editor 3D, objetos, câmera, estado e PWA
    ├── planner.js                 Reconhecimento de comandos por descrição
    ├── manifest.webmanifest       Nome, escopo, ícones e configurações instaláveis
    ├── sw.js                      Cache offline e controle de versões
    ├── icons/
    │   ├── icon-192.png
    │   └── icon-512.png
    └── vendor/
        ├── three.module.js        Engine de renderização (licença MIT)
        ├── three.core.js          Núcleo Three.js
        ├── OrbitControls.js       Navegação orbital
        └── LICENSE                Licença de terceiros
```

### 4.1 `dist/index.html`

Define três áreas de interface: **catálogo** (`#shop`), **canvas de edição** (`#viewport`) e **configurações** (`#settings`). O cabeçalho contém o seletor de espaço `#spacepick`. O painel direito inclui `#roomwidth`, `#roomdepth`, `#windowside`, `#doorside`, sliders de posição, editor de descrição, botões de exportar/importar e PWA. Ao selecionar um móvel, aparecem `#itemwidth`, `#itemdepth`, `#itemheight`. Os atributos `id` fazem a ligação com os eventos em `app.js`.

### 4.2 `dist/style.css`

Mantém a identidade escura e verde-lima da V2.1. Faz a estrutura desktop em três colunas, empilha painéis em telas pequenas, permite rolagem na lista de produtos e mostra um painel compacto de medidas para o móvel escolhido. Suporta interações por toque e controles na tela para exploração.

### 4.3 `dist/app.js` — funções principais

| Função / bloco | Responsabilidade |
| --- | --- |
| `products` | Catálogo de preços, categorias, dimensões métricas, cor e utilidade dos objetos |
| `model(p)` | Monta a geometria 3D. Os modelos são simplificados, sem depender de arquivos de imagem externos |
| `buildRoom()` | Monta o piso retangular, divisões de piso, quatro paredes e aberturas |
| `buildWallSegments()` | Divide as paredes em faixas e deixa vazios para as aberturas da porta e janela |
| `buildArchitecture()` | Desenha modelos de porta e janela de acordo com a cor e estilo selecionados |
| `wallTransform()` | Posiciona cada parede e abertura na orientação do ambiente |
| `applyWalls()` | Mantém duas paredes visíveis no editor (por padrão) e quatro no modo Explorar; alterna a grade métrica |
| `dims()`, `valid()` | Dimensões rotacionadas, limites em X/Z, colisão vertical e horizontal |
| `destination()`, `put()`, `place()` | Escolha do apoio, movimentação com filhos e posicionamento inicial |
| `descendants()` | Localiza itens apoiados sobre um suporte, inclusive níveis empilhados |
| `setDimensions()` | Aplica largura/profundidade/altura customizadas ao produto e escala o modelo |
| `resizeSelected()` | Confere limites, colisão e apoios antes de aceitar novos tamanhos |
| `mode()`, `canWalk()`, `frame()` | Câmera de edição, exploração a pé, detecção de obstáculos e renderização |
| `changeDimensions()` | Redimensiona o ambiente e bloqueia redução que atravesse móveis |
| `captureSpace()`, `showSpace()` | Troca entre quatro ambientes independentes, recriando objetos a partir dos dados |
| `objectData()`, `readProject()`, `saveProject()` | Serializa dados locais, carrega estado validado e salva no navegador |
| `applyCommand()` | Aplica comandos reconhecidos no interpretador descritivo |

**Coordenadas:** no mundo 3D, `x` é a largura esquerda/direita, `z` é a profundidade frente/fundo, e `y` é a altura acima do piso. O centro do ambiente está em `(0, 0, 0)`. A posição de cada móvel corresponde ao seu centro horizontal. As medidas de catálogo (`w`, `d`, `h`) são metros e seguem as mesmas unidades.

**Colisões:** a lógica usa caixas delimitadoras simplificadas, não colisão física detalhada de cada geometria. Móveis giram em passos de 90°. Objetos pequenos usam `surface` para selecionar uma superfície de apoio e `support` para lembrar seu móvel pai. Ao girar ou mover a mesa, dependentes movem junto; se o resultado colidir, o movimento é desfeito. O sistema também impede que um móvel ou cômodo seja redimensionado deixando itens fora dos limites.

### 4.4 `dist/planner.js`

Exporta `parseDescription(text, products)` e `clampMeters(value)` sem dependência do DOM. As frases são normalizadas para letras minúsculas e sem acentos, depois avaliadas por expressões regulares e dicionários pequenos. Cada linha vira um comando tipado (`dimensions`, `space`, `finish`, `architecture` ou `move`) ou um item de `unknown`. **Não conecta serviços de IA nem envia a descrição para terceiros.** Para ampliar a linguagem, acrescente padrões em `parseLine`, mantendo os testes em `tests/planner.mjs`.

### 4.5 Salvar espaços, orçamento e projeto

A estrutura persistida no navegador usa a chave **`roomlab:v3:project`** com `schema: 3`. Cada ambiente guarda largura, profundidade, acabamentos, aberturas, móveis e fila de entrega. Os móveis são representados em JSON por `uid`, `id` de catálogo, medidas personalizadas, posição X/Y/Z, rotação, cor e `support` (referência ao UID do apoio). Ao voltar para um ambiente, as instâncias 3D são reconstruídas a partir desses dados. O saldo `balance` é compartilhado entre todos os ambientes. A importação valida formato e limites básicos, mas não substitui um sistema de contas / backup em nuvem.

**Importante:** projetos da V2.1 não podem ser restaurados automaticamente, porque a V2.1 não tinha persistência. A V3 salva em uma chave nova e não apaga arquivos externos nem o ZIP original.

### 4.6 PWA e cache

`manifest.webmanifest` define nome, ícones, cor e modo `standalone`. `sw.js` pré-armazena `index.html`, JS, CSS, Three.js e ícones, devolvendo cache em visitas offline. O registro ocorre no fim de `app.js` apenas em HTTPS ou localhost. Quando fizer modificações e redeploy, atualize a string `CACHE` no `sw.js` para que visitantes recebam os novos arquivos. Um PWA é um **site instalável**, não um APK nativo; funcionar offline depende do primeiro carregamento e das políticas do navegador.

## 5. Testes

Rode na pasta principal:

```bash
npm run check
npm test
```

Os testes verificam: 46 entradas de catálogo, limites de geometria dos modelos e orçamento total do catálogo abaixo de R$ 30.000; movimentação/rotação/colisão em quartos retangulares; empilhamento e superfícies; geometria das quatro paredes; abertura de porta e janela em diferentes paredes e estilos; parse das instruções em português. O navegador também deve ser testado manualmente em um dispositivo com WebGL, incluindo instalação PWA e offline: o teste automatizado de lógica **não garante** a renderização ou a instalação em todos os navegadores.

**Roteiro manual recomendado:** abrir a aplicação, comprar um móvel, ajustar o tamanho, mudar quarto para 3,5 × 4 m, mover janela e porta, alternar para sala, colocar um sofá, explorar, atualizar a página e conferir a persistência. Por fim, exportar JSON e importar o arquivo novamente. Para offline, instale ou abra uma vez com rede, desconecte e recarregue.

## 6. Limitações / próximos aprimoramentos

- Os objetos são representações 3D geométricas, **não** modelos CAD exatos nem móveis de fabricantes específicos. Confirme medidas reais antes de comprar móveis ou executar obra.
- Colisão por caixas e no piso em 90°, sem portas físicas articuladas, hidráulica, encanamento, elétrica ou detecção real de abertura da folha.
- O editor aceita dimensões retangulares e não suporta ainda cômodos em L, paredes diagonais, terreno em níveis ou múltiplos andares.
- A descrição interpreta frases predefinidas. IA generativa, reconhecimento de planta/fotos e edição 3D por conversa livre exigiriam outra integração.
- O salvamento é local (e exportável). Não há conta, sincronização em nuvem ou colaboração ao vivo.
- No modo Explorar, as quatro paredes permanecem visíveis; para editar com boa visibilidade, use **Editar** e controle a visualização com o botão de paredes.

## 7. Licença de dependências

Código de aplicação elaborado para o projeto ROOMLAB. Three.js e OrbitControls foram distribuídos com a biblioteca original e sua licença MIT preservada em `dist/vendor/LICENSE`. As fontes externas são opcionais e têm seus próprios termos.

## Licença

Este projeto está sob a licença [MIT](LICENSE). Copyright (c) 2026 bielzu. As atribuições de terceiros são preservadas em `dist/vendor/LICENSE`.
