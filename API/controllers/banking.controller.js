// const fetch = require("node-fetch");
const axios = require("axios");
const bankingApiController = {
    transactionApiVtb: async (req, res) => {
        try {
            console.log("/////////////////");
            const url =
                "https://api.web2m.com/historyapivtb/Koanh123@/102881934814/2F6F35EE-E100-1DE2-14D6-4D643E5F1971";

            const response = await axios.get(url);
            const data = response.data;

            return res.status(200).json({
                success: true,
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    transactionApiAcb: async (req, res) => {
        try {
            console.log("/////////////////");
            const url =
                "https://api.web2m.com/historyapiacbv3/Koanh123@/40683507/60C2A833-61AA-3F6E-110B-10B1CEB2A36B";

            const response = await axios.get(url);
            const data = response.data;

            return res.status(200).json({
                success: true,
                data: data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
};

module.exports = bankingApiController;
