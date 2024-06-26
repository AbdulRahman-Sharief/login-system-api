import { IsNumber, IsString } from 'class-validator';

export class SocialLoginDTO {
  @IsNumber()
  userId: number;
  @IsString()
  provider: string;
  @IsString()
  type: string;
  @IsString()
  providerAccountId: string;
  @IsString()
  refresh_token: string;
  @IsString()
  access_token: string;
  @IsNumber()
  expires_at: Date;
  @IsString()
  token_type: string;
  @IsString()
  scope: string;
  @IsString()
  id_token: string;
  @IsString()
  session_state: string;
}
