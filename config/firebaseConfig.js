const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Path ke service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let firebaseInitialized = false;

// Cek apakah file serviceAccountKey.json ada
if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized successfully');
    firebaseInitialized = true;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
  }
} else {
  console.warn('⚠️  WARNING: serviceAccountKey.json not found!');
  console.warn('⚠️  Firebase notifications will NOT work.');
  console.warn('⚠️  Please add serviceAccountKey.json to config/ folder.');
  console.warn('⚠️  Backend will continue running without notification feature.');
}

module.exports = { admin, firebaseInitialized };
