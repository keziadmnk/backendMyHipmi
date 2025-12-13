const sequelize = require("./config/db");
require("./models/Relation");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRoute = require("./routes/authRoute");
const eventRoute = require("./routes/eventRoute");
const agendaRoute = require("./routes/agendaRoute");
const absenRoute = require("./routes/absenRoute");
const notificationRoute = require("./routes/notificationRoute");
const { Event } = require("./models/EventModel");

var app = express();

app.use(logger("dev"));

// PENTING: Route yang menggunakan multer HARUS dipanggil SEBELUM body parser
// karena multer memerlukan raw body stream untuk multipart/form-data
app.use("/events", eventRoute);

// Body parser untuk route lainnya (JSON dan URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database & tables have been synced.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRoute);
app.use("/agenda", agendaRoute);
app.use("/absen", absenRoute);
app.use("/notifications", notificationRoute);
app.use("/uploads", express.static("uploads"));


module.exports = app;
