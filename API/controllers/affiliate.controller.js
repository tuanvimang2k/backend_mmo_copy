const affiliateModel = require("../../models/affiliate.model");
const userModel = require("../../models/user.model");

const affiliateController = {
    saveAffiliate: async (affiliate, gmail) => {
        if (affiliate.startsWith("https://")) {
            const split = affiliate.split("ref=");
            //console.log("split:", split);
            const refAffiliate = split[1];
            // const gmailAffiliate = split[1];
            const findUser = await userModel.findOne({ linkRef: refAffiliate });
            if (!findUser) {
                return false;
            }
            const saveAffiliate = await new affiliateModel({
                userGrand: findUser._id,
                userChild: gmail,
            });
            //console.log("saveAffiliate:", saveAffiliate);
            await saveAffiliate.save();
        } else {
            //console.log("+++++++++++++++++++++++++++");
            const findUsername = await userModel.findOne({
                linkRef: affiliate,
            });

            if (!findUsername) {
                return false;
            }
            const saveAffiliate = await new affiliateModel({
                userGrand: findUsername._id,
                userChild: gmail,
            });
            await saveAffiliate.save();
        }
    },
    // reward: async (Gmail) => {
    //     const gmail = Gmail;
    //     let currentGmail = gmail;
    //     let reward = await affiliateController.rewardOrder(currentGmail);
    //     let level = 0;
    //     let results = [];
    //     while (reward !== null) {
    //         level++;
    //         results.push({ gmail: reward, level });
    //         currentGmail = reward;
    //         reward = await affiliateController.rewardOrder(currentGmail);
    //     }
    //     return results;
    // },
    // rewardOrder: async (gmail) => {
    //     const findRef = await affiliateModel.findOne({ userChild: gmail });
    //     if (findRef) {
    //         const find = await userModel.findOne({
    //             _id: findRef.userChild,
    //         });
    //         return find.gmail;
    //     } else {
    //         return null;
    //     }
    // },
};
module.exports = affiliateController;
