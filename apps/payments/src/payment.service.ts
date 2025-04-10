import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { PaymentsCreateChartDto } from './dto/payments-create-charge.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly _stripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {
    this._stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-03-31.basil',
        typescript: true,
      },
    );
  }

  async createCharge({ amount, email }: PaymentsCreateChartDto) {
    const paymentIntent = await this._stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of ${amount} has been completed succesfully`,
    });

    return paymentIntent;
  }
}
