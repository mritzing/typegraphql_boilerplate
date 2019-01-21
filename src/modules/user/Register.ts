import {Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import {User} from "../../entity/User";
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { sendMail } from '../utils/sendMail';
import { createConfirmationURL } from '../utils/createConfirmationURL';


@Resolver()
export class RegisterResolver {

  @UseMiddleware(isAuth)
  @Query(() => String, {name: 'helloWorld'})
  async hello() {
    return "Hello World";
  }


  @Mutation(() => User)
  async register(
    @Arg("data") {email, firstName, lastName, password}: RegisterInput,
  ): Promise<User> {
    const hashedPW = await bcrypt.hash(password,12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPW
    }).save();

    await sendMail(email, await createConfirmationURL(user.id)); 
    return user;
  }
}