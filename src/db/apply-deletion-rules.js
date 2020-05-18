const { storage } = require('../api');
const { deleteModes } = require('../util');

const applyDeletionRules = async (doc, rules) => {

    for (const { modelName, fieldName, deleteFiles, deleteMode } of rules) {

        try {

            if (deleteFiles) {
    
                const fileDocs = await doc.model(modelName).find({
                    [fieldName]: doc._id
                });
    
                const keynames = fileDocs.map(fileDoc => fileDoc.file.keyname);
    
                await storage.deleteBucketObjects(storage.config.bucketNames[modelName], keynames);
    
            }

            switch (deleteMode) {

                case deleteModes.DELETE_MANY:

                    await doc.model(modelName).deleteMany({
                        [fieldName]: doc._id
                    });

                    break;

                case deleteModes.REMOVE:

                    const docs = await doc.model(modelName).find({
                        [fieldName]: doc._id
                    });

                    for (const doc of docs) {
                        await doc.remove();
                    }

                    break;

                default:
                    break;

            }

        } catch (e) {
            throw e;
        }

    }

};

module.exports = applyDeletionRules;
