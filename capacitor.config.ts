import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.surveyengine.app',
  appName: 'SurveyEngine',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      android: {
        intentFilters: [
          {
            action: "android.intent.action.VIEW",
            autoVerify: true,
            data: [
              {
                scheme: "surveyengine",
                host: "*"
              }
            ],
            category: [
              "android.intent.category.DEFAULT",
              "android.intent.category.BROWSABLE"
            ]
          }
        ]
      }
    }
  }
};

export default config;