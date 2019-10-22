import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Form } from '../../models'
import { FormResolver } from './form.resolver'

@Module({
	imports: [TypeOrmModule.forFeature([Form])],
	providers: [FormResolver],
	exports: [FormResolver]
})
export class FormModule {}
