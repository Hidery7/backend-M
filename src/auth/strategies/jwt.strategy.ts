import { ExtractJwt, Strategy } from 'passport-jwt'; //verifica el token (la autorización)
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extrae el token
      ignoreExpiration: false,
      secretOrKey: 'clave_secreta_para_desarrollo',
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username,
      rol: payload.rol 
    };
  }
}