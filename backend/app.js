var express = require("express");
var path = require("path");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var cartRouter = require("./routes/cart");
var ordersRouter = require("./routes/orders");
var reviewsRouter = require("./routes/reviews");
var chatRouter = require("./routes/Chat");
var adminRouter = require("./routes/admin");
const subscriptionRouter = require("./routes/subscription");

require("dotenv").config();

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/chat", chatRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/reviews", reviewsRouter);
app.use("/admin", adminRouter); 
app.use("/subscription", subscriptionRouter); 

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