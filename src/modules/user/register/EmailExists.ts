import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class EmailExistsConstraint implements ValidatorConstraintInterface {
    validate(email: string) {
        return User.findOne({ where: {email}}).then(user=> {
            if (user) return false;
            return true;
        });
    }

}

export function EmailExists(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: EmailExistsConstraint
        });
   };
}