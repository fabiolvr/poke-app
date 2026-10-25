<div align="center">

# ⚡ Poke App

**Uma Pokédex para iOS e Android, no estilo neo-brutalista.**
Bordas grossas, sombras duras e cores chapadas, com os dados da [PokéAPI](https://pokeapi.co/).

![Expo SDK 58](https://img.shields.io/badge/Expo_SDK-58-000020?logo=expo&logoColor=white)
![React Native 0.88](https://img.shields.io/badge/React_Native-0.88-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit 2](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![Testes E2E com Maestro](https://img.shields.io/badge/E2E-Maestro-FF6B9D)
![iOS e Android](https://img.shields.io/badge/plataformas-iOS_·_Android-FFD23F)

</div>

## 📸 Telas

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/pokedex.jpg" width="200" alt="Grade da Pokédex"><br><sub><b>Pokédex</b></sub></td>
    <td align="center"><img src="docs/screenshots/filtro-por-tipo.jpg" width="200" alt="Busca com a folha de tipos aberta"><br><sub><b>Busca e filtro por tipo</b></sub></td>
    <td align="center"><img src="docs/screenshots/detalhes.jpg" width="200" alt="Detalhes do Pikachu"><br><sub><b>Detalhes</b></sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/evolucoes.jpg" width="200" alt="Linha evolutiva do Eevee"><br><sub><b>Linha evolutiva</b></sub></td>
    <td align="center"><img src="docs/screenshots/comparacao.jpg" width="200" alt="Comparação entre Vaporeon e Jolteon"><br><sub><b>Comparar status</b></sub></td>
    <td align="center"><img src="docs/screenshots/tema-escuro.jpg" width="200" alt="Pokédex no tema escuro"><br><sub><b>Tema escuro</b></sub></td>
  </tr>
</table>

## ✨ O que o app faz

- 📖 **Pokédex** em grade, carregada de 30 em 30 enquanto você rola, na ordem da Pokédex nacional. Puxar para baixo recarrega.
- 🔎 **Busca por nome** e 🏷️ **filtro por tipo**, numa folha que sobe da parte de baixo da tela. Os dois funcionam juntos.
- 📊 **Detalhes** com arte oficial, tipos, descrição, altura e peso, status base em barras e habilidades.
- 🧬 **Linha evolutiva** com o que faz cada etapa evoluir (Nv. 16, Water stone, Troca…).
- ⚔️ **Comparar status**: escolha um adversário e veja os dois lado a lado, com o total.
- ❤️ **Favoritos** em aba própria, ordenáveis por número ou nome e salvos no aparelho.
- 🌗 **Tema claro e escuro**, seguindo o sistema.

## 🧰 Tecnologias

| | |
| --- | --- |
| 📱 App | Expo SDK 58 · React Native 0.88 · Expo Router (rotas em `src/app/`) |
| 🗃️ Estado e dados | Redux Toolkit 2 · RTK Query para a PokéAPI · slice para os favoritos |
| 🧩 Componentes nativos | `@expo/ui` no campo de busca e na folha de tipos |
| 💾 Persistência | `expo-sqlite/kv-store` para os favoritos |
| 🔤 Fontes | Archivo Black e Space Grotesk |
| 🧪 Qualidade | ESLint + Prettier · TypeScript · Maestro (E2E) |

## 🚀 Rodar

O projeto usa **yarn** (há um `yarn.lock`).

```bash
yarn install
yarn expo start
```

No terminal do Expo, aperte `i` para o simulador do iOS ou `a` para o emulador Android. Roda direto no **Expo Go**, sem development build.

## ✅ Antes de terminar uma mudança

```bash
yarn lint          # ESLint + Prettier
npx tsc --noEmit   # typecheck
```

## 🧪 Testes

Os testes ponta a ponta usam o [Maestro](https://maestro.dev/) e ficam em [`.maestro/`](.maestro/README.md). Lá também está o script 🎬 que grava o vídeo de demonstração no simulador do iOS.

```bash
maestro test -e APP_ID=host.exp.Exponent -e EXPO_URL=exp://127.0.0.1:8081 .maestro
```

## 🗂️ Estrutura

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

## 📝 Observações

- 🇬🇧 A PokéAPI não tem descrições em português; o app mostra o texto em inglês.
- 🔢 Formas alternativas (megas, regionais) têm id acima de 10000. A busca e o filtro por tipo as deixam de fora; a grade as mostra no fim, depois do #1025, porque segue a lista paginada da API.
- 🌐 O app foi testado no iOS e no Android. A versão web não foi testada.

<div align="center">
<sub>Dados e imagens: <a href="https://pokeapi.co/">PokéAPI</a>. Pokémon e nomes relacionados são marcas da Nintendo, Game Freak e The Pokémon Company; este é um projeto pessoal, sem fins comerciais.</sub>
</div>
