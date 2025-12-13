# INSTRUKSI PENTING - SERVICE ACCOUNT KEY

Agar notifikasi Firebase dapat berfungsi, Anda HARUS menambahkan file `serviceAccountKey.json` dari Firebase Console.

## Langkah-langkah:

1. Buka https://console.firebase.google.com/
2. Pilih project "MyHipmi"
3. Klik ⚙️ Settings → Project settings
4. Tab "Service accounts"
5. Klik "Generate new private key"
6. Download file JSON
7. Rename file menjadi `serviceAccountKey.json`
8. **LETAKKAN FILE DI FOLDER INI** (backendMyHipmi/config/)

## Tanpa file ini:
- Backend tidak akan bisa mengirim notifikasi FCM
- Error akan muncul saat membuat event baru

## File Structure yang Benar:
```
backendMyHipmi/
├── config/
│   ├── db.js
│   ├── firebaseConfig.js
│   └── serviceAccountKey.json  ← FILE INI HARUS ADA
├── controllers/
├── models/
...
```
