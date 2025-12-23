const cron = require('node-cron');
const { sendKasReminder } = require('../controllers/kasController');

const startKasReminderScheduler = () => {
  
  cron.schedule('0 9 24 * *', async () => {
    console.log('🔔 Running kas payment reminder scheduler...');
    console.log(`📅 Date: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
    
    try {
      await sendKasReminder();
      console.log('✅ Kas reminder scheduler completed successfully');
    } catch (error) {
      console.error('❌ Error in kas reminder scheduler:', error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
  
  console.log('✅ Kas reminder scheduler initialized');
  console.log('📆 Schedule: Every 24th of the month at 09:00 WIB');
};

module.exports = { startKasReminderScheduler };
