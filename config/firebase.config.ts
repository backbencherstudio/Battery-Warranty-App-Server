import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "46067759181e388630cd1a1f149d92ca390378c9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDG7GnuEXpEWlha\no52ofIGmc885TBxhey5ZX5WtgO+BqVWSLOxtW7uwtMdW+GDss5s248wPj6pRj6kC\nmXNc5tbk4IWMfeAYNeQHx0VdnB4xP3PZ81kDlPHH2o2QQz/rEffjdjh1EVX6ftea\nIXECAbfQep457zdffcDCSObbItexQtQl4H6q8UsOMS+Jnum8vFhgI7WgbUz0bxut\ntcY2Tvw+rgtcFCFGkNqE+JTFiJzLxnPogSj6uahqLcaZalVPtCu3dsbZVCnjoRwd\ndqYQS6kUoPj1jEY0XDfVvCpJa9RTxXMhVirZb/f9WwnPrxSlKSj+mU+aDwwwxapK\nnH/8Vjq/AgMBAAECggEAJPP9F68iffkkia30VzzN3uyLldLIQOmfqhWiGgmmNHmO\n/mkfAI+2dbSXhVX9t2sEDfXSTh+7nYwo8uUrs5nkWL9Gv9sQWp8EPdesUJ/0UeS+\nMkJNCmfMZHp6qs57XMFJQfWPtluik7alean1stA749wrcYq5SCF1wgHF9PZriC+U\nbatMtokofmQogjsxMqqDlLEvhywGFT5+bv1fRp/Ah6RX6y6Dqc1RfJt8rRgGcBSf\nIuuKGpsbCjUZe3zr06HhTqDcNW7l3dM+3arj7Iw6uX04YyeL6AED2r9Xme+5xhxN\nQDsM4yXkncph6GU33nEiclhaJo/8Iv5TL2/JOyy+hQKBgQDxdLBDWC9HImvktKEw\nFP5iqNw5VOd9KXStpKcukJrnpTxxy11XwCLnJoFjXQT/qlntE8OKzUjs9R54aYJz\nHjUd07Xk0ekjQ8psRqk9li8ggRA2tdtVrz1UfpCg0ezUPT1viCF9eLlLfJrR3w7H\ncca4mVN+JbgjRl4Af8BaNXS01QKBgQDS592jUYp9zmGnw/8is44YjeQzBFfkhTps\nZ/VdPkoRGbxMinL/ZBznhYOquZz47JSXEu0OOEPgneyFl8ixbed1FQyN1BZqSlEz\nLdR+EteGncPWWpDW9b7z6ku2WtFx6eNht5WR2+sskUHsPtM0J03a/BYreagX0WzM\n/K9zMM7LQwKBgQCsojp4G+/Jk1HC9macoxXyYjr6frr34RD8KdIiV995KcnaroUx\nfT03OW+fJF2zkg+zksLnVbkDOoorm3xaZEmj5r+RN4fR3+E1oxvT3bIaMkzuYP3N\n+HoIFGnBofYLFTH8sT8In60TzKZA0ZOWg8GKMI3ijoNmLSR+hNh5ZujndQKBgA2R\nTPjMrhQZyr54JVmeI24A8sU1alIRIAkJRweQkkM3XJ2v6mXzkshyFl5NQoPg9E4j\nsYxQok0425ZchVSktVca24vkMOz1ivO35wuVOrg2Pfr0KI0rkfUvBV/dx8uEOFR4\n8u5HL4HWdl80S3H3dVK5FNQHJ4Egv9cQCllmsmbxAoGBAMpGClQ4g2t+ca90qSmo\nRtCmxeRQGdKCTecBCyO9l1QadKR3RI5a1z9+goxbWNRMS2v9Zc1z5calNaZowCFF\nH172Mem7kO+aOxS0uS0gQNp0DygQ/ByIfEZjGfdy3IBvRtj400bOMaj1x0cd3jEp\nb3DZVoL78y4hfWtXJTrK+vYK\n-----END PRIVATE KEY-----\n",
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
