# Perbaikan Timezone WIB - Backend MyHIPMI

## 🕐 Masalah
- Backend menyimpan timestamp dengan timezone UTC, bukan WIB (GMT+7)
- Timestamp database: `2025-12-04 23:12:38` (seharusnya `2025-12-05 06:12:38` WIB)
- Selisih waktu 7 jam karena tidak menggunakan timezone WIB

## ✅ Solusi yang Diterapkan

### 1. **Update Konfigurasi Database (config/db.js)**
```javascript
const sequelize = new Sequelize(dbUrl, {
  timezone: "+07:00", // WIB timezone
  dialectOptions: {
    timezone: "+07:00",
  },
});
```
- Sequelize sekarang menggunakan timezone WIB (GMT+7)
- Semua query database akan menggunakan offset +07:00

### 2. **Buat Time Helper Utility (utils/timeHelper.js)**
Utility functions untuk handle waktu WIB:

```javascript
const { getWIBTime } = require("../utils/timeHelper");

// Mendapatkan waktu WIB saat ini
const wibTime = getWIBTime();
```

**Available Functions:**
- `getWIBTime()` - Dapatkan waktu WIB saat ini
- `toWIBTime(date)` - Konversi date ke WIB
- `formatWIBTime(date, format)` - Format tanggal WIB
- `getWIBOffset()` - Dapatkan offset WIB (420 menit)

### 3. **Update AbsenController**
```javascript
// Sebelum
timestamp: new Date(),

// Sesudah
timestamp: getWIBTime(),
```

## 📋 Testing

### Test di Postman:
```
POST http://localhost:3000/absen
Body:
{
  "id_agenda": 12,
  "id_pengurus": 71,
  "photobuktiUrl": "https://example.com/test.jpg",
  "status": "present"
}
```

### Verifikasi Database:
```sql
SELECT id_absenRapat, timestamp, status 
FROM absen_rapat 
ORDER BY timestamp DESC 
LIMIT 5;
```

**Hasil yang diharapkan:**
- Timestamp sekarang akan sesuai dengan waktu WIB (GMT+7)
- Jika sekarang pukul 13:00 WIB, database akan menyimpan 13:00, bukan 06:00

## 🔄 Cara Restart Server

1. Stop server yang sedang berjalan
2. Restart server: `npm start` atau `npm run dev`
3. Test endpoint absen untuk verifikasi timestamp

## 📝 Catatan Penting

- **Semua timestamp** di database akan menggunakan WIB (GMT+7)
- Helper function bisa digunakan di controller lain yang butuh handle waktu
- Timezone WIB juga berlaku untuk `createdAt` dan `updatedAt` dari Sequelize

## ⚠️ Breaking Changes
Jika ada data lama dengan timezone UTC, perlu migrasi data:

```sql
-- Konversi timestamp lama dari UTC ke WIB (+7 jam)
UPDATE absen_rapat 
SET timestamp = DATE_ADD(timestamp, INTERVAL 7 HOUR)
WHERE timestamp < '2025-12-05';
```

## 🚀 Next Steps
- Test semua endpoint yang menggunakan timestamp
- Verifikasi tampilan waktu di frontend Android
- Pastikan semua waktu display menggunakan format WIB yang benar
