const { Sequelize } = require("sequelize");

const dialect = "mysql";
const username = "root";
const password = "";
const host = "localhost";
const dbname = "myhipmi";

const dbUrl = `${dialect}://${username}:${password}@${host}/${dbname}`;
// dbUrl = `mysql://root:@localhost/myhipmi`;

const sequelize = new Sequelize(dbUrl, {
  timezone: "+07:00", // WIB timezone
  dialectOptions: {
    timezone: "+07:00",
  },
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports =  sequelize;