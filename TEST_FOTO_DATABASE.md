## TEST SCRIPT: Check Foto Bukti in Database

Anda bisa jalankan query ini di MySQL untuk melihat apakah foto tersimpan dengan benar:

```sql
-- Lihat data absen piket terakhir
SELECT 
    id_absen_piket,
    id_pengurus,
    tanggal_absen,
    LENGTH(foto_bukti) as foto_length,
    SUBSTRING(foto_bukti, 1, 50) as foto_preview
FROM absen_piket 
ORDER BY id_absen_piket DESC 
LIMIT 5;
```

Cek hasil:
1. `foto_length` harus lebih dari 100 karakter (minimal)
2. `foto_preview` harus dimulai dengan `data:image/jpeg;base64,` atau langsung base64 string

Jika foto_bukti NULL atau sangat pendek, berarti ada masalah saat menyimpan.
