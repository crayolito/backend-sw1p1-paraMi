export interface UsuarioDto {
  id: string;
  nombre: string;
}

export interface SalaSockeDto {
  name: string;
  usuario: UsuarioDto[];
}

export interface InfoSalaSocketDto {
  name: string;
  usuario: UsuarioDto;
}

export interface FrontendSalaPrivadDto {
  idSala: string;
  usuario: UsuarioDto;
}

export interface FrontendInfoEventoSPDto {
  idSala: string;
  evento: string;
}

export interface DataBasicaSPDto {
  id: string;
  usuarios: UsuarioDto[];
}

export interface InfoSPDto {
  infoBase: DataBasicaSPDto;
  infoEventosSw1: string[];
}
