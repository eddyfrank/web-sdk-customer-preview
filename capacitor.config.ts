import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'my-scanbot-web-ionic-pwa-barcode-scanner-demo',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
