const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} = require("firebase/storage");
const storage = require("../config/firebase.config");
const uploadImageMiddleware = {
    uploadImage: async (image) => {
        const imageName = uuidv4();
        console.log("imageName:", imageName);
        const imageRef = ref(storage, `images/${imageName}`);
        console.log("imageRef:", imageRef);
        const metadata = {
            contentType: image.mimetype,
        };
        const imageData = fs.readFileSync(image.path);
        const snapshot = await uploadBytesResumable(
            imageRef,
            imageData,
            metadata
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        // console.log("downloadURL:", downloadURL);
        fs.unlinkSync(image.path);
        return downloadURL;
    },
    uploadMultipleImages: async (req, res, next) => {
        try {
            const images = req.files;
            // console.log(images);
            const listImage = [];
            for (let i = 0; i < images.length; i++) {
                const imageUrl = await uploadImageMiddleware.uploadImage(
                    images[i]
                );
                listImage.push(imageUrl);
            }
            req.listImage = listImage;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({
                error: "An error occurred while uploading images",
            });
        }
    },
};

module.exports = uploadImageMiddleware;
