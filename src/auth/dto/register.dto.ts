export class RegisterRequestDto {
  nama: string;
  email: string;
  username: string;
  fullname?: string;
  password: string;
  confirmPassword: string;
}

export class RegisterResponseDto {
  nama: string;
  email: string;
  username: string;
  role: string;
  fullname: string | null;
}
