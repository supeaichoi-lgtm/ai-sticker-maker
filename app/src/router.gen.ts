/* eslint-disable */
// Minimal router typing for the single index route.
import { Route as _IndexRoute } from '../pages/';

declare module '@granite-js/react-native' {
  interface RegisterScreen {
    '/': ReturnType<typeof _IndexRoute.useParams>;
  }
}

