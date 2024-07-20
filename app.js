const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const refundController = require("./API/controllers/refund.controller");
const chatController = require("./API/controllers/chat.controller");

const corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const siteRoute = require("./API/routers/site.route");
const profileRoute = require("./API/routers/profile.route");
const businessTypeRoute = require("./API/routers/businessType.route");
const boothTypeRoute = require("./API/routers/boothType.route");
const discountRoute = require("./API/routers/discount.route");
const boothRoute = require("./API/routers/booth.route");
const statusBoothRoute = require("./API/routers/statusBooth.route");
const resellerRoute = require("./API/routers/reseller.route");
const detailBoothRoute = require("./API/routers/detailBooth.route");
const favoriteRoute = require("./API/routers/favorite.route");
const couponRoute = require("./API/routers/coupon.route");
const orderRoute = require("./API/routers/order.route");
const orderServiceRoute = require("./API/routers/orderService.route");
const orderProductRoute = require("./API/routers/orderProduct.route");
const bankingConfigRoute = require("./API/routers/bankingConfig.route");
const balanceUserRoute = require("./API/routers/balanceUser.route");
const walletConfigRoute = require("./API/routers/walletConfig.router");
const boothProductRoute = require("./API/routers/boothProduct.route");
const boothServiceRoute = require("./API/routers/boothService.route");
const authRoute = require("./API/routers/auth.route");
// const messRoute = require("./API/routers/mess.route");
const refSystem = require("./API/routers/refSystem.route");
const sendEmailRoute = require("./API/routers/sendEmail.route");
const depositCommissionConfigRoute = require("./API/routers/depositCommission.route");
const popupRoute = require("./API/routers/popup.route");
const inforAgentRoute = require("./API/routers/inforAgent.route");
const reviewsRoute = require("./API/routers/reviews.route");
const categoryBlogRoute = require("./API/routers/categoryBlog.route");
const blogRoute = require("./API/routers/blog.route");
const contactRoute = require("./API/routers/contact.route");
const transactionHistoryRoute = require("./API/routers/transactionHistory.route");
const litigiousRoute = require("./API/routers/litigious.route");
const withdrawRoute = require("./API/routers/withdrawConfig.route");
const sliderMobileRoute = require("./API/routers/sliderMobile.route");
const bankingApiRoute = require("./API/routers/banking.route");
const roomRoute = require("./API/routers/room.route");
const chatRoute = require("./API/routers/chat.route");

app.use(siteRoute);
app.use(profileRoute);
app.use(businessTypeRoute);
app.use(boothTypeRoute);
app.use(discountRoute);
app.use(boothRoute);
app.use(statusBoothRoute);
app.use(resellerRoute);
app.use(detailBoothRoute);
app.use(favoriteRoute);
app.use(couponRoute);
app.use(orderRoute);
app.use(orderServiceRoute);
app.use(orderProductRoute);
app.use(bankingConfigRoute);
app.use(balanceUserRoute);
app.use(walletConfigRoute);
app.use(boothProductRoute);
app.use(boothServiceRoute);
app.use(authRoute);
// app.use(messRoute);
app.use(refSystem);
app.use(sendEmailRoute);
app.use(depositCommissionConfigRoute);
app.use(popupRoute);
app.use(inforAgentRoute);
app.use(reviewsRoute);
app.use(categoryBlogRoute);
app.use(blogRoute);
app.use(contactRoute);
app.use(transactionHistoryRoute);
app.use(litigiousRoute);
app.use(withdrawRoute);
app.use(sliderMobileRoute);
app.use(bankingApiRoute);
app.use(roomRoute);
app.use(chatRoute);

// const date = new Date(2024, 5, 16, 11, 25, 0);
const now = new Date();
const runDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10,
    7,
    0
);

const runTimeService = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    16,
    9,
    0
);

const runTimeChat = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    8,
    25,
    0
);
const job = schedule.scheduleJob(runDate, function () {
    console.log("--------------------------------");
    console.log("Running refund job at");
    refundController.refundOrders();
});
// console.log("Refund job scheduled.");

const refundFinishdayService = schedule.scheduleJob(
    runTimeService,
    async function () {
        console.log("--------------------------------");
        refundController.refundFinishdayService();
    }
);

const deleteChat = schedule.scheduleJob(runTimeChat, async function () {
    console.log("111111111111111111111111111");
    chatController.deleteOldChat();
});
module.exports = app;
