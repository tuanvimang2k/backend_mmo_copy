const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const tokenMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            console.log(accessToken);
            jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid!");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You're not authenticated!");
        }
    },
    verifyTokenAndAdmin: (req, res, next) => {
        const verifyToken = tokenMiddleware.verifyToken;
        console.log(verifyToken);
        verifyToken(req, res, () => {
            if (req.user.role === "admin") {
                next();
            } else {
                return res.status(403).json("You are not allowed to do that!");
            }
        });
    },
    authorizeRole: (roles) => {
        return (req, res, next) => {
            tokenMiddleware.verifyToken(req, res, (err) => {
                if (err)
                    if (!req.user) {
                        return res
                            .status(401)
                            .json("You're not authenticated!");
                    }
                if (!roles.includes(req.user.role)) {
                    return res
                        .status(403)
                        .json("You do not have the required permission!");
                }
                next();
            });
        };
    },
    // verifyTokenAndUser: (req, res, next) => {
    //     const verifyToken = tokenMiddleware.verifyToken
    //     verifyToken(req, res, () => {
    //         if(req.user.role === 'admin')
    //     })
    // }
};
// tokenMiddleware.authorizeRole = (roles) => {
//     return (req, res, next) => {
//         if (!req.user) {
//             return res.status(401).json("You're not authenticated!");
//         }
//         if (!roles.includes(req.user.role)) {
//             return res
//                 .status(403)
//                 .json("You do not have the required permission!");
//         }
//         next();
//     };
// };
module.exports = tokenMiddleware;
