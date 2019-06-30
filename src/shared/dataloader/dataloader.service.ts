import { Injectable } from '@nestjs/common'
import * as DataLoader from 'dataloader'
import { User } from '../../modules/user/user.entity'
import { UserService } from '../../modules/user/user.service'

// type BatchUser = (ids: string[]) => Promise<User[]>

@Injectable()
export class DataloaderService {
	constructor(private readonly userService: UserService) {}

	// async batchUsers(ids: string[]): Promise<BatchUser> {
	// 	// 1 sql call
	// 	// to get all users
	// 	const users = await User.findByIds(ids)

	// 	const userMap: { [key: string]: User } = {}
	// 	users.forEach(u => {
	// 		userMap[u.id] = u
	// 	})

	// 	return ids.map(id => userMap[id])
	// }
}

// export const userLoader = () => new DataLoader<string, User>(batchUsers)
