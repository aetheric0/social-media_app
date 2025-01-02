import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.set('debug', true);

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    accountId: string;
    password: string;
    liked: Schema.Types.ObjectId,
    bio: string,
    imageId: string,
    imageUrl: string,
}

const UserSchema: Schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    accountId: {type: String, required: true},
    password: {type: String, required: true},
    liked: {type: Schema.Types.ObjectId, ref: 'Posts'},
    bio: {type: String, maxlength: 2200},
    imageId: {type: String},
    imageUrl: {type: String, required: true},
    
})

UserSchema.pre('save', async function(next) {
    const user = this as unknown as IUser;
    if (this.isModified('password') || this.isNew) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

export default mongoose.model<IUser>('User', UserSchema);