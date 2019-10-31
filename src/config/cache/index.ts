import {
	Injectable,
	CacheOptionsFactory,
	CacheModuleOptions
} from '@nestjs/common'

@Injectable()
export class CacheService implements CacheOptionsFactory {
	createCacheOptions(): CacheModuleOptions {
		return {
			ttl: 5, // seconds
			max: 10 // maximum number of items in cache
		}
	}
}
