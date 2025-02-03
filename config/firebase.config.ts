import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "94895a9ea41a8240cab7a4fd952fedaa17209cc3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC6QwRKXaphBe8+\nvKq4SlHqcKRsdvb6cCPHeWm2zeRFSYaZ7HnLuMV65dpDYsPjDlIpRbg60a7vUTLY\nHpxgU2pduYmGI4D2zTSHGib5l5MG85KNnI6aDWzgzsNvZkYnAgOI7n8oMn+QBMct\nrYEyLGRxaeg29hI11ipYwjwmeDxWuJ5eUcsDsy5R1q+xKHd+vlAJxH/vP+TaNsE7\nvCPHLScObyhUua+su6Yg6zL/cTXTGjzuI4GFt2SVtwsziJ+vADqCeR/e0/CMT7iE\nTqXhoIdkIxf3BX8kf2etmRKsksv4WGchfFV9NWDchcm0TpA6rIg8piQtKE2yG0ot\nBYdb0+ShAgMBAAECggEAMpPoIll03ovB/4MzyH9F5ydXPqy/PBofXRc3AZC/H6Fr\nj3iLSiqOVWT887dqAcntvY9VC4PMwOeHqvAE/pMoGvM6yNXzOxFV5inP0465OfYC\nIboVbveeTR1YLHPVMNp3I0O/+6ZaxTzG6TxoDLvJOpLLn8EKCNxy+08jDj8wA0v/\nSK0FfoDCmUv5OA/FQps9uM0FQMM8lg/TpR4Yr3ideaa5J4v9fP3qf6weUs6ny4DU\nnvGGl0oqp4NKwsv4Rv5MaxCg2TWcuQ/Wn2HTlO23iZCh7dRcADVGibHLdYnvMxUY\nRKqvY3vAvAJ+kbK1STPuvO4D1IdL/+gW7oj98sTiUQKBgQDzio4wghrLRLkd3Nm8\nCbnTCbX3YxyMheOcCGprv/pRb9Swsvew1KQGio8Sat8A5aJEhW3/857LNCvzcx49\nJEDt2IHaR6mgGaSVjtnME3WwWO7lfeW0godXA14aKWyc1Qmycc/T53I2slyyOyr2\nv8oWi3Rc5onFHCPIz59HQqpbwwKBgQDDylKtRX1xHoNwSEvHVXpT25gG4cCHF3DB\nH4ADcRzl0EIoteF0nc/RzDz4B4Ykq4SDM4KeKCb02Nr8C1or81HdauLJ2dHnSDH1\nr2wtULWQkPv8ownmTUARI94GgR18HPlESISSadA5L7IPTLLy5mlDeW0mWsVsda9d\nmBekdAlLywKBgQCcjDDwT4GHrgpMft1bOOlBFdnpRsVgMuRnNSWrU4FFfdw7JR+A\nhH9XURO8pAPrILEY2KgnweMN/eBOom4KoVY3TVfTBwOrTTB1jpjDzLJ3BAO0cyQH\nz2vN6/U+XehaO7r7AJu2O+036ZkaXFw2tnvh2AyZdvuSP49lEsjw1pKJXwKBgQCU\nzmc8Dj6jBP/9DNWbcNoCdjn7sQT1J9mozlorQ4MlH73I10O9sFvNJp+IG5/Wqw2R\n8kpqDjZdjZwSSEaGdO5ZjO1FYOnqELL3+hYL8vWsJKWAhCH4CeqRnGMZKnTQae0B\n+uPXq9h4Pknk2vR/LKQAhn9w0TiPkHpydjAx64dNNQKBgQCYaV+bY3ZmJUenXtiQ\nAgjyvtyHMNa6Ha2JshJJ3AmGqOx0/1nr4yXzlJWzxelRopn75nVOqzu7dx7UxLos\nTA2iYTHgXwHZhsBSp9jHnFS2zAU5ODiCWbuy2JenDY3rgI86vPqOSjozRNq0H/f3\nmEZOo24orv9wsCaOMMmNj0JcKA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@battarywarenty.iam.gserviceaccount.com",
  "client_id": "107446472939527803821",
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
