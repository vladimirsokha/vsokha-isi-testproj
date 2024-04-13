import { UserTypeEnum } from "../enums/user-type.enum";

export interface IUser {
    id: number;
    username: string;
    first_name: string;    
    last_name: string;
    email: string;
    password: string;
    user_type: UserTypeEnum;
}
