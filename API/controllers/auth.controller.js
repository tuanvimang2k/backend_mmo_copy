const userModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const authController = {
    generateAccessToken: (user) => {
        console.log(process.env.JWT_SECRET);
        return jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: "30d" }
        );
    },
    requestRefreshToken: async (req, res) => {
        const _id = req.body._id;
        console.log(req.headers);
        const refreshTokenHeader = req.headers.refreshtoken;
        console.log("refreshTokenHeader:", refreshTokenHeader);
        const refreshToken = refreshTokenHeader.split(" ")[1];
        console.log("refreshToken:", refreshToken);
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "You are not authenticated!",
            });
        }
        const findUser = await userModel.findOne({ _id: _id });
        console.log("findUser:", findUser);
        const checkRefreshToken = await findUser.refreshToken;
        // console.log("checkRefreshToken:", checkRefreshToken);
        if (!checkRefreshToken.includes(checkRefreshToken)) {
            return res.status(403).json({
                success: false,
                message: "Refresh token is valid!",
            });
        }
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            // console.log("user:", user);
            if (err) {
                // console.log(err);
                return res.status(403).json({
                    success: false,
                    message: "Refresh token is expired or invalid!",
                });
            }
            console.log("user payload:", user);
            const newAccessToken = authController.generateAccessToken(user);
            return res.status(200).json({ accessToken: newAccessToken });
        });
    },
};
module.exports = authController;
