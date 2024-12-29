import { Schema, model, Document} from 'mongoose';

interface IPost extends Document {
    creator: Schema.Types.ObjectId;
    caption: string;
    likes: Schema.Types.ObjectId;
    location: string,
    tags: string[],
    imageUrl: string,
    imageId: string,
    date: Date;
}

const postSchema = new Schema<IPost>({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    caption: {type: String, maxlength:2200, required: true},
    likes: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: String},
    tags: {type: [String]},
    imageUrl: [{type: String, required: true}],
    imageId: [{type: String, required: true}],
    date: {type: Date, default: Date.now},
})

const Posts = model<IPost>('Posts', postSchema);
export default Posts;