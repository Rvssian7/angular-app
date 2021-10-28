// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'default',
  firebase: {
    Config : {
      apiKey: "AIzaSyBlzi8AasFumZazPOoEdE8jAwoZtHznp1U",
      authDomain: "ecommerce-6bd9f.firebaseapp.com",
      projectId: "ecommerce-6bd9f",
      storageBucket: "ecommerce-6bd9f.appspot.com",
      messagingSenderId: "1028813909697",
      appId: "1:1028813909697:web:b9d2f79913c18f939cee40"
    }
  },
  actionCodeSettings: {
    url: 'http://localhost:5200/profile/new',
    handleCodeInApp: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
