import { Resolver, Mutation, Arg } from 'type-graphql';
import { sendMail } from '../utils/sendMail';
import { User } from '../../entity/User';
import { v4 } from 'uuid';
import { redis } from '../../redis';
import { forgetPasswordPrefix } from '../constants/redisPrefixes';

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() =>Boolean)
    async forgotPassword(
        @Arg("email") email: string,
    ): Promise<boolean> {
        const user = await User.findOne({where: {email}});
        if (!user) {
            return true;
        }
        
        const token = v4();
        await redis.set(forgetPasswordPrefix+ token, user.id, 'ex', 60*60*24); //1day
        await sendMail(email,  `http://localhost:3000/user/change-password/${token}`); 
        return true;
    }
}