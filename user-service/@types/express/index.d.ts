import { JwtPayload } from 'jsonwebtoken';

interface ExtendedJwtPayload extends JwtPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: string | ExtendedJwtPayload;
        }
    }
}

