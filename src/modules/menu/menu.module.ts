import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuResolver } from './menu.resolver'
import { CommonService } from '../common/services/common.service'

@Module({
	providers: [MenuService, MenuResolver, CommonService]
})
export class MenuModule {}
