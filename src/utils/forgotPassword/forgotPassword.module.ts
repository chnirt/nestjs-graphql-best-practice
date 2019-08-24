import { Module } from '@nestjs/common'
import { ForgotPasswordService } from './forgotPassword.service'

@Module({
	providers: [ForgotPasswordService],
	exports: [ForgotPasswordService]
})
export class ForgotPasswordModule {}
