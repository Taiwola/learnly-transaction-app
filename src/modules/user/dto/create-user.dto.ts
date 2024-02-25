import { IsString, IsEmail, IsNotEmpty, IsEnum} from "class-validator"
import { UserRoles } from "../entities/user.entity";
import { Exclude } from "class-transformer";

export class CreateUserDto {
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

export class CreateUserResponse {
    _id: string

    firstname: string

    lastname: string

    email: string

   @Exclude()
    password: string;

    @IsEnum({UserRoles})
    roles: UserRoles

    createdAt: Date


    constructor(user: any) {
        this._id = user._id.toString(); // Assuming _id is of type ObjectId
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.email = user.email;
        this.roles = user.roles; // Assuming role is present in user object
        this.createdAt = user.createdAt
    }
}
