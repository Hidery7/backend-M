import { Injectable, UnauthorizedException } from '@nestjs/common'; //logica prncipal, valida usuarios y enlaza con la bd
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(nombre: string, pass: string): Promise<any> {
    try {
      const user = await this.usuarioService.findOneByNombre(nombre);
      
      if (!user) {
        return null;
      }
      
      const isPasswordValid = pass === user.password;
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.nombre, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { 
      username: user.nombre, 
      sub: user.idUsuario,
      rol: user.rol?.nombre 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.idUsuario,
        nombre: user.nombre,
        rol: user.rol?.nombre
      }
    };
  }
}
