import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

// Só carregado em desenvolvimento (veja store/index.ts). O endereço do Reactotron é o mesmo
// do Metro, então funciona no simulador, no emulador e no celular sem configurar IP.
// O app não usa AsyncStorage nem Storybook, por isso esses plugins ficam desligados.
export const reactotron = Reactotron.configure({ name: 'Poke App' })
  .useReactNative({ asyncStorage: false, storybook: false })
  .use(reactotronRedux())
  .connect();
