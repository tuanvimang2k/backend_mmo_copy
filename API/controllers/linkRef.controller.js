const affiliateModel = require("../../models/affiliate.model");
const userModel = require("../../models/user.model");

function generateCodeRef(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codeRef = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        codeRef += characters[randomIndex];
    }
    return codeRef;
}
const hrefController = {
    createHref: async () => {
        const codeRef = await generateCodeRef();
        return {
            link: `https://${process.env.domain}?ref=${codeRef}`,
            codeRef: codeRef,
        };
    },
    rewardOrder: async (gmail) => {
        const findHref = await affiliateModel.findOne({ userChild: gmail });
        console.log("findHref:", findHref);
        if (findHref) {
            const find = await userModel.findOne({ _id: findHref.userGrand });
            return find.gmail;
        } else {
            return null;
        }
    },
    reward: async (Gmail) => {
        const gmail = Gmail;
        let currentGmail = gmail;
        let reward = await hrefController.rewardOrder(currentGmail);
        let level = 0;
        let results = [];
        while (reward !== null) {
            level++;
            results.push({ gmail: reward, level });
            currentGmail = reward;
            reward = await hrefController.rewardOrder(currentGmail);
        }
        return results;
    },
};
module.exports = hrefController;
