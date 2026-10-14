import { MonnifyBaseResponse } from './monnify-base-response.dto';

export class MonnifyLoginResponse extends MonnifyBaseResponse<MonnifyLoginResponse> {
  accessToken: string;
  expiresIn: number;
}
