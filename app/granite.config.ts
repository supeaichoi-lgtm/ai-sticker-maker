import { env } from '@granite-js/plugin-env';
import { router } from '@granite-js/plugin-router';
import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  scheme: 'intoss',
  appName: 'with-ai-sticker',

  plugins: [
    appsInToss({
      permissions: [],
      brand: {
        displayName: 'AI 스티커',
        icon: 'https://static.toss.im/appsintoss/73/fe26bdc6-b0e5-467d-aaeb-0444474c84db.png',
        primaryColor: '#3B70E3',
        bridgeColorMode: 'basic',
      },
    }),
    env({
      // 로컬 서버 주소 (기본값)
      SERVER_BASE_URL: 'http://localhost:4000',
    }),
    router(),
  ],
});

