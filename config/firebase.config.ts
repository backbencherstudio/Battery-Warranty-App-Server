import admin from "firebase-admin";
import path from "path";

const serviceAccount = {
  "type": "service_account",
  "project_id": "battarywarenty",
  "private_key_id": "0061a760dbfe82314681a248f4acfef47ae8b671",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn9nAuj1n5keV7\nfCwqKiCsvCOBmialQ6V1sjcjCUYLtZEzyWXRW4EXo5M4imYvKd7ox5UiFAvLLctv\nISXTAQ07NoKoBFTyt7Hls2r7FQORkwNllXr+3l7U3U+NgWDA3M4hZ7VGtHiAnem5\n4GSAj1RF7XrOJav9kgN32w2iM1yqBhSecH/3QWxZPS5AIeih8t/tKf1Ud+26tK0H\nnxeE4LdgnjVZbdiCzo/S6ywLDUL+gH9tOTMfLGx2NSMeQEayC0Xgu+mj/kNni9IA\nkt+hU7BFITKrTULoGeu03YizDgleK8sGQcPGgAlKLJ/seVYP1PlnlaK6MCSfBwZ+\nf9mdjcjtAgMBAAECggEAISEADoby4cFvqJQc5/IoQLnZLQJ5NeaqV5Ufv/bfzIZz\nDepe/VTVmRKIAsJ1lj7lezeGiFK44sn1EsXQfpZ6BCBj0/0KvlcSLTLe2ohSDGAZ\nbut1d5jnzoeaXdhTe6bxt3ALttb437GF/MYwPJVIs4Q8UTXn/xtSOM1JmqET2WsI\naJQSFE5tFEtuJ0ArlwCdamrTFhtiy9hA2eLG50G4IU88Rn1eCpeV2Ga54ea5SHGd\nlnPc/BHQcxXcTu6YIPnMsNqb9IZKlERl+64ilBFcYTwWL7Pz+qcQmy+CIs3/af0P\nq53/nr3ouj0ArA//dSXtbJqDLD3ONObeiGwiBYn5YQKBgQDlB8YC+xMGoIj38Q91\n54C95ZwlOhjcFogGbMlltr/M11ilcVQU0Mnyp6MbN44FuD3BspqJ/qOnU2Ml6V8D\nTMP+/ySL3ogqRSFwO04nYPKKA4TkO5YRSR98+g191n+OxiERPQybfn+0UH+udM3A\nUBXlg7tGGA0gJE+/LJBqb8OOEQKBgQC7vcAIOzzqiNY6HhwG1MgOL1sdjE5RACJ1\nJpnUlLGZOqvUakLtUJuxLnp94DqkwiX8FNbRIhAr6YzQmf4bY7wwKaSoo4WVRDjO\njc3hCMzL79575DETXi2DNll3xNur78Fqw2vkRMNBkvdM19YiUR853ThErM/NCwc4\nSGf5YS6hHQKBgCz2Y7c+FzQb3Afg+UoKUsn1A7yDNVIv0jCAtuETCYBrXmnMX9de\nTecnZev38hfJXcZjC9e/d91nj3Vn5VE+htPOvxv+afjybWgdHHC6paLWogY0dHec\nRWRBqthjfdNHrkI2G/2CzgtWKlrTb3krv8C5JdDS8/C1cDp1wzxCCMAhAoGBAKON\nUW6aVJ4pKR+mPVpCIiohXSonoc505I/UWezUwMcxUqIRFE7ziz7Ws8VXAx+nNzoc\n2WuFVjs7Ef5kOPeZckcu8BAtrGD19tsStAlYBjmftN2PVKV/xPxq65QoPgrSKlic\n+C/7K3LD2obp/NUWgLKDItLJDZqeAeMpSNL6s4mNAoGAXun5jM6BH+I9T356EYjl\njXv0H9MyeuvK8+EmdVGe9untgrNfgp8Hr850IU+kCVaNfy8mUOnIUx4kVKiV66AP\nU1FnzTkGC4l7Lty14xdngF3pMCmbB18PCCqyQx0RP7JJ9et2JhS7PHQX6/5yNHY6\nvSE2PMuXAMrsJk0bkTBhUOc=\n-----END PRIVATE KEY-----\n",
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
