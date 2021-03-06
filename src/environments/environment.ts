// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {url_signature} from "./url_signature"

const graphql_base_uri = "192.168.50.130:8000"
export const environment = {
  production: false,
  image_base_url: "https://d33stfk6gvmz1c.cloudfront.net/",
  invite_base_url: "http://192.168.50.130:4201/",
  graphql_wsUri: "ws://"+graphql_base_uri+"/ws",
  graphql_httpUri: "http://"+graphql_base_uri+"/graphql",
  url_signature: url_signature
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
