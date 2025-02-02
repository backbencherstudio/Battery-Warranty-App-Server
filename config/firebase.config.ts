import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "9a091d5672d2f3c5b4d1e1903a03e4dd1ef9e7c1",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmHhrE0mKzih0O\nitxqpGElTR9HiN6h01g6782FfJlQ0cBkvisiyoRIfqLwlIaWLgPNZapr0/kmIfDw\nhL7lHO5CnIrkIZ3fdPdFSLEVQPAWK7OAD9v8g+q1abGkzFb+GIdOSPL9rIF8ncPh\n0Sb227lbHTc0IrF+NwRrc4EckIOsMLHssx1sk+1s3ZCLrlJTT65V9lvqBP9tedMK\n3OSa8rhEkIk9mwjfirHVKwg47PCSrfE4WBl7gVP9fLKjceapfbuI19Pc0i3ufLqw\ndiFSQxoUa/Bsri46ovJrH/sKEN2JMvrlBg0ERmUXvYoB5/k+QHk8wITw91TrVFV1\ntS8eGlMtAgMBAAECggEABZv8oWrNRGzEgGo1+S/ly+Gnzb2Ubvh5ATx5vyku8Ci1\nC3HUeQ9Hmj8Ud3U8ejPBkxz8vTliL2R0A1soKwpoDT3F/uAXuaT0eJV0zVftA4Kk\nRA3FCujVcxzHj94Kjff8Eauq8N/zW2bkZ2qtmyZeQvJgm9UUE0P+VTaIRJOorpbE\nVUx2ydfMRtx85Q1V+lX8LMXfYVWFMEwR2eIWjpbzoWMS3StbKMJsm8bxEpOXaIhg\nfJncmS117oMhiUqOSZqVyADRnYAKrOOHsbcVtmS7W22plEKfQcoMmufaOTiIUJsc\nsQ+V/+5lMhlE66z2BcSuk4oUHXvQz+xcRiv+uIYAbQKBgQDn9DlCuzMkQNMBwQ4E\nTHoitIZD8pXoGIVtiTg45owyPM77paJjgeHJ9PPfg9RnRDk0SFWo9v+C++cjuIuD\n0PWixa4ugu12/YHJkg6EZA6pMJKu0RRceArcB4mQn1FBMqidrM7CDNwZb4zfg/zY\nmBjVpTymtUpWGeK58KMzPHz7hwKBgQC3Vqm8WWS0gTWA2PGf2bklDOYvbPn2Ylf6\n2tbwzY9VSjDO7L1DmlMHUUl0L8FuVrGy/dnQEJa97A96vYrukaJtX0Lohj0S6j89\nyUouSPZZgQ48pHwlO8qYElPE3s3HAgttvej4bT9dEUodBYJbNuegyjkQJFD+2Syj\nq+hZ/CMwqwKBgFzsg1APjOJ2MdJfFA120es7ZRqtgY603CdQtLxe6EVsBQPdjFvO\n+bSdtGGT/7DLLRub6u1A3oYMAsJVuVa6jN2D0k8B1r43uxoUsEorh5ASTIFKc5zD\n3p3dSygsGzJCaDiatU4aNsbd4JLe3pmq/TAB/XVP5ZLu1dzl4YuyLOPbAoGAQ1gB\nBx9q/2bKyWZm8smd2X8welE0TA15tbp244MOWEzlOsz5BIEGaJSyP4xfJ/GOWmom\nfOfrBx5T3UkMZG94U2Z/hDvy6STEUCTFK9U/MEdYfGwK8f5Rf6STwqf4vFYC7q+o\niMBQWxZDu/9PD8RONuCxLz23xrTtUb2OnqcgIfsCgYBNmFTJbOkgsHxJHMa29Uwu\nXe44GAdPLlBHg4TfKXBl/ER+wfW6U0ydkZG7yiiMKLJC9BfxmiU7SCQkVeNdYbSv\nCElYcIXjLbchAJCUY2QSEGJwYnr/eqfr3Nk4bA1jP164NgaN2/NW8/au7gVAqZPy\nF8fkzdjHLOCZAoyhK2XN9Q==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-gw07m@battarywarenty.iam.gserviceaccount.com",
  "client_id": "110316287568886823497",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gw07m%40battarywarenty.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}





if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

export default admin;
