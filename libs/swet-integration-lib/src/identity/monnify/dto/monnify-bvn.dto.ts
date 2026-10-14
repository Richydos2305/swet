import { MonnifyBaseResponse } from '@swet/integration/provider/monnify/dto/monnify-base-response.dto';
import { MatchResult } from '../../dto/match-result.enum';

export class MonnifyBvnRequest {
  bvn: string;
  name: string;
  dateOfBirth: string;
  mobileNo: string;
}

type MonnifyFieldMatch = 'FULL_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';

export class MonnifyBvnResponse extends MonnifyBaseResponse<MonnifyBvnResponse> {
  bvn: string;
  name: {
    matchStatus: MonnifyFieldMatch;
    matchPercentage: number;
  };
  dateOfBirth: MonnifyFieldMatch;
  mobileNo: MonnifyFieldMatch;

  static toMatchResult(value: MonnifyFieldMatch) {
    switch (value) {
      case 'FULL_MATCH':
        return MatchResult.FULL_MATCH;
      case 'PARTIAL_MATCH':
        return MatchResult.PARTIAL_MATCH;
      case 'NO_MATCH':
        return MatchResult.NO_MATCH;
      default:
        throw new Error(`Unrecognized match result "${value}"`);
    }
  }
}
