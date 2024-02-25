import { IsString, IsEmail, IsNotEmpty, IsEnum} from "class-validator"
import { ObjectId } from "mongoose";
import { UserRoles } from "src/modules/user/entities/user.entity";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    firstname: string

    @IsNotEmpty()
    @IsString()
    lastname: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string;
}


export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string;
}

// export class AuthUserDto {
//     _id: ObjectId
//     firstname: string
//     lastname: string;
//     email: string;
//     password: string;
//     createdAt: string;
//     role: UserRoles

//     constructor(user: any) {
//         this._id = user._id.toString(); // Assuming _id is of type ObjectId
//         this.firstname = user.firstname;
//         this.lastname = user.lastname;
//         this.email = user.email;
//         this.role = user.roles; // Assuming role is present in user object
//         this.createdAt = user.createdAt
//     }
// }