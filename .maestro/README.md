# Testes E2E (Maestro)

Os fluxos rodam no Expo Go, com o servidor ligado (`yarn expo start`).

| Fluxo | O que cobre |
| --- | --- |
| `pokedex.yaml` | Grade com paginação, detalhes do Pikachu, favoritar, habilidades e aba Favoritos |
| `evolucoes.yaml` | Busca por nome, filtro por tipo, linha evolutiva do Eevee e comparação Vaporeon × Jolteon |
| `formas.yaml` | Formas do Charizard (Mega X é Fogo/Dragão) e Raichu de Alola (Elétrico/Psíquico) |

## Rodar

iOS (simulador):

```bash
maestro test -e APP_ID=host.exp.Exponent -e EXPO_URL=exp://127.0.0.1:8081 .maestro
```

Android (emulador). Use o IP da rede que o `expo start` mostra:

```bash
maestro test -e APP_ID=host.exp.exponent -e EXPO_URL=exp://192.168.1.10:8081 .maestro
```

Rode os comandos a partir da raiz do projeto: as capturas de tela vão para `.maestro/capturas/`, que o git ignora. Com mais de um aparelho ligado, passe `--device <id>` logo depois de `maestro`.

## Sem internet

`offline/sem-internet.yaml` abre o app sem rede e confere o que vem da cópia salva no aparelho: grade, rolagem até o fim do que foi salvo, puxar para atualizar, busca, linha evolutiva, comparação, filtro já aberto (Fogo) e nunca aberto (Gelo), Pokémon nunca aberto (Mew) e Favoritos. Fica fora da suíte normal porque depende dela: rode a suíte antes, com internet, para salvar os dados.

O Metro precisa continuar alcançável sem rede, então use `127.0.0.1` nas duas plataformas.

Android: o fluxo liga e desliga o modo avião sozinho. O `adb reverse` leva o Metro pelo cabo virtual do emulador:

```bash
adb reverse tcp:8081 tcp:8081
maestro test -e APP_ID=host.exp.exponent -e EXPO_URL=exp://127.0.0.1:8081 .maestro/offline
```

iOS: o simulador usa a rede do Mac. Desligue o Wi-Fi (o Metro continua, porque é local), rode o fluxo e religue:

```bash
networksetup -setairportpower en1 off   # en1 = Wi-Fi; confira com networksetup -listallhardwareports
maestro test -e APP_ID=host.exp.Exponent -e EXPO_URL=exp://127.0.0.1:8081 .maestro/offline
networksetup -setairportpower en1 on
```

## Vídeo de demonstração

`demo/gravar-video.sh` grava o passeio pelo app no simulador do iOS (tema claro e depois escuro) e corta as pausas com `demo/cortar-pausas.py`. Requer `ffmpeg`.

```bash
.maestro/demo/gravar-video.sh            # salva em ~/Documents/poke-app-demo-ios.mp4
.maestro/demo/gravar-video.sh outro.mp4  # ou em outro arquivo
```
