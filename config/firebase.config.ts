import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "69c48964a90b9f1b96829bab8892215f0a5ceae6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtrynBZzvCB5Co\nZ5hxwlJSHs+QhsQs7zOXZB9AAoplyeT6Z8HX18HGoVaByPaSjRsZ+pM3dyIRkewi\nBe8b1XGAnga0iao98sXpxf49w+SdvKXFJ60r8ee8Wp282LCpCNGqlIDPg8sDxGQV\nDpkhEe8yF5ZakXIlPYyXLEOVf6aSIBuJqhOhYR2BMs/LWQZlfjumzK5JjUwjPORG\nPX4K0Mmc/mff7nHk8CIqgsNDFAASTOTyp6FJBvTqTqdXrx0Pwta/7pPxAgkJbN0B\nnNY76U3/VO4qePFz3vCZu0zMJvfa7LMvZdVSlxyFAlcvIfmuiil0ErgFNRrIw/fT\nTGmq8acfAgMBAAECggEABq4EbJhET5eL5DYrwkBHezoNIJFWTSYb9VgX7ZXLbdPA\ndzLzXRJCtRlyYsZwWT2NC8g7zjfKOyPCEaLpycfBOEGbn2jl/8DtBKslNonoqnpd\nY8I9YkHI+FEB3Qf2b2HT8nwIojJ+5dOxR7AKip+Oc/49PZl3auA9nnjI1qCUruz1\n6q4gKyQgb0ZxuvLXT1eSSmrMnv7TnPG9gi/ngyEy+0MxzpuBRI3wd3IZytTsH1+E\nmAvFVZb6XRdAPDfxdGRcsxnhNrPzmWZnuT5S2lkz8Q/SRhvSy3qZE8v97kfYCxsr\nggkATadkaM8FsYbrBJ6Jz92nXz21//vIE9oJd/ct+QKBgQDlwkJtRAbWx4oxJu/O\nfL1/PBmhvCXyxfatSKPpfJQec9PgrQThUYTvxqXlL7crfszxwzIF8Ycs8y7TPlmD\nfXnEV5DyFYv0ktXjrxjpI6FDGypjyBg+AnR6VFf/fTcQMcjRuwpG/H5hT2J5U4ua\nUrQJp1CEGv+qki8WqEjsO8pNKQKBgQDBhWHGOsoyEPfKbbW5FYFYONIf6/fRPKKl\nTMfF6e4/WeaFmAqjNRe03WGKcSNZF17Xp3mHf+QiWmUDbq72Had4IYO9HqGSHevS\nGjEJniQo7aLQEQM32xt84jNW0/ZST7BJIj1bLncuq8EHMMp4zCn5kc1m3Ioe8JK9\njiGsdaOTBwKBgQCpkzDX2Gd7yhZSpLxFmId8Cu2YE3emsTmZN43S3GGuACsXHlwF\nuNb26ZSzjP4SGipFHZ4kCNmN8YZT3ybOB6QBp+eQ5RpAzscSnr8yA1wYXUpyDtLl\noYY6a1nvdYlYaIYhVX0GW4EjbSXvChx1MCk1HsosVojwaahbfqUjxhVP0QKBgQCM\nYCeLdovDA4HrCef+6PWZPCZX14A8++HzTB3Bl64lsB3CnIZi2xlmLgwaM3Vzo7s9\nbZN/Uar3rGCHu9sYVmxrfMwl/DkxV5j/H9agZmFOewpWKXEPLFXlIeQhwMF19a4n\nbrnZEXyMkzQC9kZ4l4h/K182lRVv2gxnidktU2wjMwKBgGI9QG3YVwFnUWB/jCJ8\n/buljFm5ZYdyQH26CTTin48/Ja1OOvwzd9GPUMO0tLy3PvhdqaRrGAH3Eqjz6N1B\nx2Bro6BRUWerTD2UgPGqO7lWT82txsNpgOJudAJ83ETdFtJ8MZANwuxTqmFqWTlQ\n/XUR6knNYw2RAKjMH9UxBjhg\n-----END PRIVATE KEY-----\n",
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
