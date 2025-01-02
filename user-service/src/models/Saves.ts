import { Schema, model, Document} from 'mongoose';

interface ISave extends Document {
    user: Schema.Types.ObjectId;
    post: Schema.Types.ObjectId;
}

const saveSchema = new Schema<ISave>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}, {
    timestamps: true
});

const Save = model<ISave>('Save', saveSchema);
export default Save;