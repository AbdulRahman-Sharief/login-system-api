import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos, provider, displayName, email_verified } =
      profile;

    const data = {
      provider: provider,
      providerId: id,
      email: emails[0].value,
      type: emails[0].type,
      name: name,
      picture: photos[0].value,
      email_verified,
      displayName,
      _accessToken,
      _refreshToken,
    };
    console.log(data);
    done(null, data);
  }
}
