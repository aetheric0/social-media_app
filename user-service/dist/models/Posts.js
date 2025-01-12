"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, maxlength: 2200, required: true },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: [] }],
    location: { type: String },
    tags: { type: [String] },
    imageUrl: [{ type: String, required: true }],
    imageId: [{ type: String, required: true }],
}, {
    timestamps: true,
});
const Posts = (0, mongoose_1.model)('Posts', postSchema);
exports.default = Posts;
