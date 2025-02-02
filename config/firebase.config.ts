import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "21127cc9ad97ce1dbe12142384b52199e4342efc",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCreDPTPOiCl7hq\n7CX5I9Ek9olNZwwAnhHoDyxrz3zC+JCnWkQEesXpwlrrHABzXUMZ55t0MRSmHmys\ntGrYgBmAkzgFStm0Fe5CefkZwi+KKeeb7EilElZ4A3TZGT1E81eVwrJF2fD1F4Az\ntVZ5qVE5acyGotqBF5SXSEFEIxSjwpPP1mPIiZOv/E/VoJyGHx/wdW5wTE2tKtQ6\nkp9TCxwi/9tmYjSCjGcVjr5T1g2bzAGlPx1J3NAabzcJVfFhQeQfVbXezYhW5SFd\n2jKXKYIw5EE6alVEWv3IJ4aA3LV1tSG950wsbkPzgArZZoYNf8mdzf6KWoMaXKRm\nkAIcuRlPAgMBAAECggEALM+KA69MOCy8Rj0Wo2hn1NgVA8RlT5f/p/ynKDmeKjnZ\nW9LsKZuIM1HWftDfkUaTLaboalIVSmBzGCNCNPgtMfvHTSLFiBmfHYJQxhmIYPwY\nihgS2AjVziFhHQdKisVpYzrxae3N2c9dcqX2Rm8oSe/LQng20DvAWlTIsazVTQIz\n7BjD7ldR8u/I11IJSjVuPo/kAvHcYL+E2ev5JTBoMY0GPI1b0V2EBpmVmuh6qzgt\nj3UmhmXH7g6olkeChJLcnqAxPSEDUvhopChYxMRdlBZRrwmKoEZoumNve23QTOU9\nKYCatgY4BeaDem7vMZ4pzDmykoHT4405qTz6c6Vx4QKBgQDgACiGM/xZ3blmCLi6\nXz6j6L1iXHO+shCpBiCAU74D1juOLZBGEBk5zXjSgm4UgUyJ4QWg3aGTmzW4zo19\nHshU6nQbhWhgsYCWF9TceOCmtaN0fjWeO6Qj1PASg99o4mO5sYyr3oNsUyz46KLQ\nZKcEYfPP0PjSQ5QJ91Ps+plwcQKBgQDD9vM0e0HfdkAqlG/wMtLn2+v3DKDcTvE/\n2vHfmpvcWPILCtGY2UvcKWAC2/FQWsXjH1jFTAQEQNOLODnBsxxn42RkgTXqQiH1\n0sdG4qxe0LzKNCsfuggp80YiFG/nLaOsu/yTUiItDCkEn5SOkIHoApE+T5wJ36Fw\nQvtGu8wFvwKBgBSP7yhinUeikuJK6qoxFA73zmq5EebvcZgSd+lPxqGTiOQESroj\nwC0OL4kjb/dx5xTBE0MxFSP3m3bbfyF9MeaZnw7nsC0wHh2pEmEqt3SWN+r5qvJb\nhzXC1kbc1CVMotro8YDVbDsFZ5txv4BhvPMqCreI905V5cEEcy/N0UgBAoGBALrN\niK8JpBSpe6dbUo2NVUESgpBBKIJ6ejzdsF3v2w2keC6QhJaI5WicxFpVYWaw8Rx9\nwDhrKxUG2uFGmsALxlM+D3BDP6rsmcTkxXPMFnZX0u+J5WXcB3Y94igQhU/BUNoT\nZUTmMY/xnJQ8rvdrx3nsIJpedyduV01VfITD9kuvAoGAY0rzZl1J2TwAseoHKJ55\npPtdE5ehYSh/WNYGj6igLTf+KAgvHFTuwSdkvq9NX2yZ6l8DzmltnmaeDh87ATn1\n3qWyWNu6WnKyY+lQ0fFPxsScy+UyzYCOWws17l9p5QcCEq8IA3fIRLWmOuDKoqXW\nAFP1ZhMD0FuXsFeF3Yjr6nA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@battarywarenty.iam.gserviceaccount.com",
  "client_id": "102269417770010121570",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40battarywarenty.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});


// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
//   });
// }

export default admin;
