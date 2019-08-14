import { MongoClient } from 'mongodb'
import * as uuid from 'uuid'

async function main() {
	console.log('🌱  Database seeder is running')

	const url = process.env.MONGO_PORT
		? 'mongodb://localhost:' + process.env.MONGO_PORT
		: 'mongodb+srv://tuti:B4WgyRXQ3WBOQ86i@cluster0-pvh5w.mongodb.net/lunchapp?retryWrites=true&w=majority'
	// 'mongodb://admin:chnirt1803@ds161397.mlab.com:61397/database-test'
	const dbName = process.env.MONGO_PORT ? 'lunch4' : 'database-test'

	const client = new MongoClient(url, { useNewUrlParser: true })

	try {
		await client.connect()
		console.log('🚀  Server ready')

		const db = client.db(dbName)

		const users = [
			{
				username: 'admin',
				fullName: 'admin'
			}
		]

		users.map(async item => {
			await db.collection('user').findOneAndUpdate(
				{ username: item.username },
				{
					$setOnInsert: {
						_id: uuid.v1()
					},
					$set: {
						username: item.username,
						password:
							'$2b$10$zZlBfV2IMrXPnbtHd1Bwqus97HvLE28N9.rCvNSUURFQdDD945fXK',
						fullName: item.fullName,
						isLocked: false,
						reason: '',
						isActive: true,
						createdAt: new Date(),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)
		})

		const permissions = [
			{
				code: 'USER_CREATE',
				description: 'Tạo người dùng'
			},
			{
				code: 'USER_DELETE',
				description: 'Xóa người dùng'
			},
			{
				code: 'USER_LOCK_AND_UNLOCK',
				description: 'Khóa và mở khóa người dùng'
			},
			{
				code: 'USER_UPDATE',
				description: 'Cập nhật người dùng'
			},
			{
				code: 'ORDER_CREATE',
				description: 'Đặt món'
			},
			{
				code: 'MENU_PUBLISH_AND_UNPUBLISH',
				description: 'Công khai và khóa công khai menu'
			},
			{
				code: 'MENU_LOCK_AND_UNLOCK',
				description: 'Khóa và mở khóa menu'
			},
			{
				code: 'MENU_CLOSE',
				description: 'Đóng menu'
			},
			{
				code: 'ORDER_CONFIRM',
				description: 'Xác nhận đã ăn'
			},
			{
				code: 'REPORT_VIEW',
				description: 'Xem báo cáo'
			}
		]

		permissions.map(async item => {
			await db.collection('permission').findOneAndUpdate(
				{ code: item.code, description: item.description },
				{
					$setOnInsert: {
						_id: uuid.v1()
					},
					$set: {
						code: item.code,
						description: item.description,
						createdAt: new Date(),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)
		})

		const sites = [
			{ name: 'Sư Vạn Hạnh' },
			{ name: 'Nha Trang' },
			{ name: 'Hoa Hồng' }
		]

		sites.map(async item => {
			await db.collection('site').findOneAndUpdate(
				{ name: item.name },
				{
					$setOnInsert: {
						_id: uuid.v1()
					},
					$set: {
						name: item.name,
						createdAt: new Date(),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)
		})

		const shops = [
			{
				name: 'ShopA'
			},
			{
				name: 'ShopB'
			},
			{
				name: 'ShopC'
			}
		]

		shops.map(async item => {
			await db.collection('shop').findOneAndUpdate(
				{ name: item.name },
				{
					$setOnInsert: {
						_id: uuid.v1()
					},
					$set: {
						name: item.name,
						isActive: true,
						createdAt: new Date(),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)
		})

		client.close()
		console.log('💤  Server off')
	} catch (err) {
		console.log('❌  Server error', err.stack)
	}
}

main()
