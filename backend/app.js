var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var cartRouter = require("./routes/cart");
var ordersRouter = require("./routes/orders");
require("dotenv").config();

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);

const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Mero_Kitchen",
    })
    .then((data) => {
      console.log("Database connected successfully", data.connection.name);
    });
}

module.exports = app;
