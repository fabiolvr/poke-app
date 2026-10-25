# Poke App

Pokédex para iOS e Android feita com Expo, no visual neo-brutalista: bordas grossas, sombras duras e cores chapadas. Os dados vêm da [PokéAPI](https://pokeapi.co/).

## O que o app faz

- **Pokédex:** grade carregada de 30 em 30 enquanto você rola, na ordem da Pokédex nacional. Puxar para baixo recarrega.
- **Busca e filtro:** busca por nome e filtro por tipo (numa folha que sobe da parte de baixo da tela). Os dois podem ser usados juntos.
- **Detalhes:** arte oficial, tipos, descrição, altura e peso, status base em barras, habilidades e a linha evolutiva com o que faz cada etapa evoluir.
- **Comparar status:** escolhe um adversário e mostra os status dos dois lado a lado, com o total.
- **Favoritos:** aba própria, ordenável por número ou nome, salva no aparelho.
- **Tema claro e escuro**, seguindo o sistema.

## Tecnologias

- Expo SDK 58 com Expo Router (rotas em `src/app/`)
- Redux Toolkit 2: RTK Query para a PokéAPI e um slice para os favoritos
- `@expo/ui` no campo de busca e na folha de tipos
- `expo-sqlite/kv-store` para guardar os favoritos
- Fontes Archivo Black e Space Grotesk

## Rodar

O projeto usa yarn (há um `yarn.lock`).

```bash
yarn install
yarn expo start
```

No terminal do Expo, aperte `i` para o simulador do iOS ou `a` para o emulador Android. O app roda no Expo Go, sem development build.

## Antes de terminar uma mudança

```bash
yarn lint          # ESLint + Prettier
npx tsc --noEmit   # typecheck
```

## Testes

Os testes ponta a ponta usam o [Maestro](https://maestro.dev/) e ficam em [`.maestro/`](.maestro/README.md). Lá também está o script que grava o vídeo de demonstração no simulador do iOS.

```bash
maestro test -e APP_ID=host.exp.Exponent -e EXPO_URL=exp://127.0.0.1:8081 .maestro
```

## Estrutura

```
src/
├─ app/            telas e navegação (Expo Router)
│  ├─ (tabs)/      abas Pokédex e Favoritos
│  ├─ pokemon/     detalhes: /pokemon/pikachu
│  └─ compare.tsx  comparação: /compare?a=pikachu&b=raichu
├─ components/     peças visuais (BrutalBox, PokemonCard, SearchBar…)
├─ constants/      tokens do estilo e cores dos tipos
├─ features/
│  ├─ pokemon/     cliente da PokéAPI, tipos e funções de apoio
│  └─ favorites/   slice e persistência dos favoritos
├─ hooks/
└─ store/          store do Redux e hooks tipados
```

## Observações

- A PokéAPI não tem descrições em português; o app mostra o texto em inglês.
- Formas alternativas (megas, regionais) têm id acima de 10000. A busca e o filtro por tipo as deixam de fora; a grade as mostra no fim, depois do #1025, porque segue a lista paginada da API.
- O app foi testado no iOS e no Android. A versão web não foi testada.
