# Testes E2E (Maestro)

Os fluxos rodam no Expo Go, com o servidor ligado (`yarn expo start`).

| Fluxo | O que cobre |
| --- | --- |
| `pokedex.yaml` | Grade com paginação, detalhes do Pikachu, favoritar, habilidades e aba Favoritos |
| `evolucoes.yaml` | Busca por nome, filtro por tipo, linha evolutiva do Eevee e comparação Vaporeon × Jolteon |

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

## Vídeo de demonstração

`demo/gravar-video.sh` grava o passeio pelo app no simulador do iOS (tema claro e depois escuro) e corta as pausas com `demo/cortar-pausas.py`. Requer `ffmpeg`.

```bash
.maestro/demo/gravar-video.sh            # salva em ~/Documents/poke-app-demo-ios.mp4
.maestro/demo/gravar-video.sh outro.mp4  # ou em outro arquivo
```
