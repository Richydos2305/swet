import { MonnifyBaseResponse } from '@swet/integration/provider/monnify/dto/monnify-base-response.dto';

export class MonnifyNinRequest {
  nin: string;
}

export class MonnifyNinResponse extends MonnifyBaseResponse<MonnifyNinResponse> {
  nin: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
}
