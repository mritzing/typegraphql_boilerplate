import {Length, IsEmail} from "class-validator";
import { Field, InputType } from "type-graphql";
import { EmailExists } from "./EmailExists";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;
  
  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @EmailExists({message: "email already in use"})
  email: string;

  @Field()
  password: string; 
}