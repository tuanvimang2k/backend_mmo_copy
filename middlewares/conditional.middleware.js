const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const conditionalMiddleware = (middleware) => {
    return (req, res, next) => {
        if (req.files && req.files.length > 0) {
            return middleware(req, res, next);
        }
        next();
    };
};
module.exports = conditionalMiddleware;
