import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('PROFILE: ', profile);

    console.log('REFRESHTOKEN: ', _refreshToken);
    const { id, _json, username, photos, provider, displayName } = profile;

    const data = {
      provider: provider,
      providerId: id,
      email: null,
      type: _json.type,
      name: username,
      picture: photos[0].value,
      displayName,
      _accessToken,
      _refreshToken,
    };
    console.log('DATA: ', data);
    done(null, data);
  }
}
