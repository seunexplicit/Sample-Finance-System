import { hash, compare } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { userModel } from '@/models';
import { createToken } from './createToken.service';
import { LoginDto } from '@/dtos/auth.dto';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<{token:TokenData, user:User}> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    let findUser: User = await this.users.findOne({ email: userData.email });
    findUser = await this.users.findOne({ bvn: userData.bvn });
    if (findUser) throw new HttpException(409, `User already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    
    const token= createToken(createUserData);
    createUserData.password = undefined;
    return { token, user:createUserData };
  }

  public async login(userData: LoginDto): Promise<{ token: TokenData; findUser: User }> {

    const findUser: User = await this.users.findOne({ email: userData.email })
                .select('+password');
    if (!findUser) throw new HttpException(409, `User not found`);

 
    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "User not found");

    const token = createToken(findUser);
    findUser.password = undefined;

    return { token, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `User not found`);

    return findUser;
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
