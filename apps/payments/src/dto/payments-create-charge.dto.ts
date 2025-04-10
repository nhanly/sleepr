import { CreateChargeDto } from '@app/common';
import { IsEmail } from 'class-validator';

export class PaymentsCreateChartDto extends CreateChargeDto {
  @IsEmail()
  email: string;
}
