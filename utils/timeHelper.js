/**
 * Utility untuk menangani waktu WIB (Western Indonesia Time / GMT+7)
 */

/**
 * Mendapatkan waktu saat ini dalam timezone WIB
 * @returns {Date} Waktu WIB dalam format Date object
 */
const getWIBTime = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
};

/**
 * Konversi waktu ke WIB
 * @param {Date|string} date - Tanggal yang ingin dikonversi
 * @returns {Date} Waktu WIB dalam format Date object
 */
const toWIBTime = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Date(dateObj.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
};

/**
 * Format waktu WIB ke string
 * @param {Date} date - Tanggal yang ingin diformat
 * @param {string} format - Format output ('datetime', 'date', 'time')
 * @returns {string} String waktu terformat
 */
const formatWIBTime = (date, format = "datetime") => {
  const wibDate = toWIBTime(date);
  
  const options = {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  if (format === "date") {
    return wibDate.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  if (format === "time") {
    return wibDate.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  // datetime
  return wibDate.toLocaleString("id-ID", options);
};

/**
 * Mendapatkan offset WIB dalam menit
 * @returns {number} Offset dalam menit (420 untuk GMT+7)
 */
const getWIBOffset = () => {
  return 7 * 60; // GMT+7 = 420 minutes
};

module.exports = {
  getWIBTime,
  toWIBTime,
  formatWIBTime,
  getWIBOffset,
};
