const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

const initializeGridFS = () => {

    bucket = new GridFSBucket(
        mongoose.connection.db,
        {
            bucketName: "sessions"
        }
    );

    console.log("GridFS Initialized");

};

const getBucket = () => bucket;

module.exports = {
    initializeGridFS,
    getBucket
};