<div align="center">

<img src="assets/images/icon.png" width="112" alt="Ícone do Poke App: Poké Bola neo-brutalista em fundo amarelo">

# ⚡ Poke App

**Uma Pokédex para iOS e Android, no estilo neo-brutalista.**
Bordas grossas, sombras duras e cores chapadas, com os dados da [PokéAPI](https://pokeapi.co/).

![Expo SDK 58](https://img.shields.io/badge/Expo_SDK-58-000020?logo=expo&logoColor=white)
![React Native 0.88](https://img.shields.io/badge/React_Native-0.88-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit 2](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![Testes unitários com Jest](https://img.shields.io/badge/testes-Jest-C21325?logo=jest&logoColor=white)
![Testes E2E com Maestro](https://img.shields.io/badge/E2E-Maestro-FF6B9D)
![iOS e Android](https://img.shields.io/badge/plataformas-iOS_·_Android-FFD23F)

</div>

## 📸 Telas

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/pokedex.jpg" width="170" alt="Grade da Pokédex"><br><sub><b>Pokédex</b></sub></td>
    <td align="center"><img src="docs/screenshots/filtro-por-tipo.jpg" width="170" alt="Busca com a folha de tipos aberta"><br><sub><b>Busca e filtro por tipo</b></sub></td>
    <td align="center"><img src="docs/screenshots/detalhes.jpg" width="170" alt="Detalhes do Pikachu"><br><sub><b>Detalhes</b></sub></td>
    <td align="center"><img src="docs/screenshots/formas.jpg" width="170" alt="Formas do Charizard: Mega X, Mega Y e Gigantamax"><br><sub><b>Formas</b></sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/evolucoes.jpg" width="170" alt="Linha evolutiva do Eevee com os itens em português"><br><sub><b>Linha evolutiva</b></sub></td>
    <td align="center"><img src="docs/screenshots/comparacao.jpg" width="170" alt="Comparação entre Vaporeon e Jolteon"><br><sub><b>Comparar status</b></sub></td>
    <td align="center"><img src="docs/screenshots/tema-escuro.jpg" width="170" alt="Pokédex no tema escuro"><br><sub><b>Tema escuro</b></sub></td>
    <td align="center"><img src="docs/screenshots/splash.jpg" width="170" alt="Splash amarela com a Poké Bola"><br><sub><b>Splash</b></sub></td>
  </tr>
</table>

## ✨ O que o app faz

- 📖 **Pokédex** em grade com as 1.025 espécies, carregada de 30 em 30 enquanto você rola. Puxar para baixo recarrega.
- 🔎 **Busca por nome** e 🏷️ **filtro por tipo**, numa folha que sobe da parte de baixo da tela. Os dois funcionam juntos.
- 📊 **Detalhes** com arte oficial, tipos, descrição, altura e peso, status base em barras e habilidades.
- 🧬 **Linha evolutiva** com o que faz cada etapa evoluir (Nv. 16, Pedra da Água, Troca…).
- 🎭 **Formas** de cada Pokémon nos detalhes: megaevoluções, formas regionais e Gigantamax, cada uma com tipos e status próprios.
- ⚔️ **Comparar status**: escolha um adversário e veja os dois lado a lado, com o total.
- ❤️ **Favoritos** em aba própria, ordenáveis por número ou nome e salvos no aparelho.
- 🇧🇷 **Tipos e itens em português** (Fogo, Água, Pedra do Trovão…).
- 🌗 **Tema claro e escuro**, seguindo o sistema.

## 🧰 Tecnologias

| | |
| --- | --- |
| 📱 App | Expo SDK 58 · React Native 0.88 · Expo Router (rotas em `src/app/`) |
| 🗃️ Estado e dados | Redux Toolkit 2 · RTK Query para a PokéAPI · slice para os favoritos |
| 🧩 Componentes nativos | `@expo/ui` no campo de busca e na folha de tipos |
| 💾 Persistência | `expo-sqlite/kv-store` para os favoritos |
| 🔤 Fontes | Archivo Black e Space Grotesk |
| 🧪 Qualidade | ESLint + Prettier · TypeScript · Jest (unitários) · Maestro (E2E) |

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
yarn test          # testes unitários (Jest, cerca de 1 s)
```

## 🧪 Testes

**Unitários (Jest):** ficam em [`__tests__/`](__tests__) e cobrem as regras sem tela: nomes e rótulos das formas, busca, linha evolutiva, traduções e favoritos. Rodam em cerca de 1 segundo com `yarn test`.

**Ponta a ponta (Maestro):** usam o [Maestro](https://maestro.dev/) e ficam em [`.maestro/`](.maestro/README.md). Lá também está o script 🎬 que grava o vídeo de demonstração no simulador do iOS.

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

- 🇬🇧 A PokéAPI não traz textos em português. Tipos, itens e gatilhos de evolução são traduzidos por uma tabela no app (`translations.ts`); descrições, categorias e habilidades continuam em inglês.
- 🔢 Como na PokéAPI, a Pokédex, a busca e o filtro mostram só as 1.025 espécies. As 326 formas alternativas (megas, regionais, Gigantamax…) aparecem na seção Formas dos detalhes de cada espécie.
- 🌐 O app foi testado no iOS e no Android. A versão web não foi testada.

<div align="center">
<sub>Dados e imagens: <a href="https://pokeapi.co/">PokéAPI</a>. Pokémon e nomes relacionados são marcas da Nintendo, Game Freak e The Pokémon Company; este é um projeto pessoal, sem fins comerciais.</sub>
</div>
