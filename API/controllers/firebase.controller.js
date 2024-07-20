const firebaseController = {
    saveImageToDB: async (imageUrls) => {
        try {
            const image = new Image({ url: imageUrls });
            await image.save();
            return "saved image successfully";
        } catch (error) {
            return error;
        }
    },
};
module.exports = firebaseController;
