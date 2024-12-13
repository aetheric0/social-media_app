import { Schema, model, Document} from 'mongoose';

interface IComment extends Document {
    user: Schema.Types.ObjectId,
    post: Schema.Types.ObjectId,
    content: string,
    date: Date,

}

const commentSchema = new Schema<IComment>({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now},
})

const Comment = model<IComment>('Comment', commentSchema);
export default Comment;