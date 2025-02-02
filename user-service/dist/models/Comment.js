"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const Comment = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = Comment;
