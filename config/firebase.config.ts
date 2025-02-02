import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "52500b54967fff18a629550cf0ad7dd48c74d9b1",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxEwWOuC/I1t/7\nE7D4FoQaMe29PnDPqF7pSNmyASZQPD0IhEONPBR8jYIz2gsBnghVPd0zWhGYWg8k\n8QnHK8I+DjbAzGQJ4ZF2B6CzRNotzqcUr15qLGFE2++GhWLTG9jQDnm0OM75eYiO\n0S8ndEwJpl/a39YRxK6zsSm2wuKTH3pv8gHZZqc9qTDJ8Jhcop25YG3G6jcpPWrJ\nzePrscsMkEM+qPJlM7iuh/ZrhVGFn3nknkzpzETZgm6aiM8ueQsFsHTP0VSnoTbV\nHmoJxq2IlDTlI3L6YmH22MvXwShyBqiQ24mhOx3b3yb3PBhLvPbPOshFUqaSARQn\nwdlAgOUVAgMBAAECggEAFAnjiJ2mZrOOYFL/pWui4nYBAfgFezKCHyNL432G0PCo\nNYUGQf7pEJlRAT4tHa89ISxhknSgZh3W9ebDJQN6NVyVbKcUsRuSQwmk8XSavjFT\nLh+Uby57iXfcONxybRKLLCxfMHp3TbsnrYXVsMDT9Amccl//UT5xSMuFPXX7fwuS\nBIVmrATumlCGsRBh+tT+LC1uxY1kpsBNdDfi04V1/tIL5PfO461BiVOXZhpdbApf\nZHx9fKbrQB2rLn1ovCN9BBuiwp/VQ+2CCXxTNJrPOuR00480mlaIGppErSyaJIYT\npePE0ZP1XtrSbN5GtDm0dyhcrUcodAtEJ9rijkzyEQKBgQDo/mincAIjzbUEFoX3\ncKae30ORJd4O9p+4wWnN3L8CtbYrgoosD9HEk5mltQ+r9fmX2G13HaBpc9q3UotQ\nl5gIzBbDA0uusMhCDAL9U8ValVpJb8lkSjJl5dAcXXza4/ZPh7OjhwO6ThmCTrIo\nKG89vnoEy2cz7ph4b6xRaOXveQKBgQDCjxYgbMEnj2UZTH/oPr3G/yEXjRudJ92H\nWdurw7l7lGDOvy9vNigK+GRBFjg4w8tAKjDNMp91vdDinNTXm9MTUz3h1qZXHfJP\ng/BFYWtQ7IGSIFEGgYyqnhg53Fs2MwzxHyETDLXc/kaOj31Ef7pKoYsK59jIdZ0I\nnjY0Y7HvfQKBgCS6bg7u9jdkpwNU9ZtS88EZmtIXsRCUygra2m3sPWQU9vmW42cc\nu0mMpuzbRPQrm0PXhzH+xpm4/KJnbbSvoPTKD1CAhX6tOXRH5nS+rt6fqpLm/01C\n8PzlJFBEYHk09FAHKUc+8lR9GUJUW3s/HIIUM7HryoICO6DIodZXfd+pAoGAIQVN\n+RTcN42j2AZe0xkK9qJIiIm/fQ3OEHHU0bM3YN0PDSfvsg1cAHil81IFGsVIUsyW\nWc1UuRQNRtjdWvasfWQsZY8bzj9b59j5x5zALQzm9NkdR2BncnHApNlcdbd2Y9on\nr+cBWs+hRALgfOa8xHvkcGZnKaakj1ji1ENzaLUCgYAODOrUxNy3INp2IDjzNEhr\nkeSOvC7NmM3bm8qIrRqcGHT+1ymquMGmBhlmEFyEHL/1rYHZ+rYeVNZDswm5B0gM\n/RT/mC/gwtKiZ8BmWhK5w2i4Ws7LTYSSLVr9kzVf15hacrMvKH6MR4sRwKYeRgVH\npxvfIURggwYTxNYGPB1ZvQ==\n-----END PRIVATE KEY-----\n",
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
