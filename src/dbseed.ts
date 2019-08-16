import { MongoClient } from 'mongodb'
import * as uuid from 'uuid'

async function main() {
	console.log('🌱  Database seeder is running')

	const url = process.env.MONGO_PORT
		? 'mongodb://localhost:' + process.env.MONGO_PORT
		: 'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql'
	// 'mongodb://admin:chnirt1803@ds161397.mlab.com:61397/database-test'
	const dbName = process.env.MONGO_PORT ? 'lunch4' : 'nest-graphql'

	const client = new MongoClient(url, { useNewUrlParser: true })

	try {
		await client.connect()
		console.log('🚀  Server ready')

		const db = client.db(dbName)

		const users = [
			{
				_id: 'c30c0730-be4f-11e9-9f04-f72d443f7ef2',
				username: 'admin',
				fullName: 'admin'
			},
			{
				_id: '4a858710-bfed-11e9-ae42-4b976ee8364c',
				username: 'mod',
				fullName: 'mod'
			}
		]

		users.map(async item => {
			await db.collection('user').findOneAndUpdate(
				{ username: item.username },
				{
					$setOnInsert: {
						_id: item._id
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
				_id: 'f1dbbda0-be4d-11e9-bc7c-2117bce2f37c',
				code: 'USER_CREATE',
				description: 'Tạo người dùng'
			},
			{
				_id: 'ad5a65e0-be4e-11e9-a6ad-c109fb49072b',
				code: 'USER_UPDATE',
				description: 'Cập nhật người dùng'
			},
			{
				_id: '6ca4ffb0-be4e-11e9-b75c-d915f7b6e00b',
				code: 'USER_DELETE',
				description: 'Xóa người dùng'
			},
			{
				_id: 'a6957510-be4e-11e9-a6ad-c109fb49072b',
				code: 'USER_LOCK_AND_UNLOCK',
				description: 'Khóa và mở khóa người dùng'
			},
			{
				_id: '19355210-bf04-11e9-83da-09d22932d6d6',
				code: 'MENU_CREATE',
				description: 'Tạo menu'
			},
			{
				_id: 'f1f12d40-bf04-11e9-a629-29525b452984',
				code: 'MENU_UPDATE',
				description: 'Cập nhật menu'
			},
			{
				_id: '08fcd5c0-bf05-11e9-a629-29525b452984',
				code: 'MENU_DELETE',
				description: 'Xóa menu'
			},
			{
				_id: 'b9966ac0-be4e-11e9-a6ad-c109fb49072b',
				code: 'MENU_PUBLISH_AND_UNPUBLISH',
				description: 'Công khai và khóa công khai menu'
			},
			{
				_id: 'c168d3f0-be4e-11e9-a6ad-c109fb49072b',
				code: 'MENU_LOCK_AND_UNLOCK',
				description: 'Khóa và mở khóa menu'
			},
			{
				_id: 'c67b32c0-be4e-11e9-a6ad-c109fb49072b',
				code: 'MENU_CLOSE',
				description: 'Đóng menu'
			},
			{
				_id: 'b4592b60-be4e-11e9-a6ad-c109fb49072b',
				code: 'ORDER_CREATE',
				description: 'Đặt món'
			},
			{
				_id: 'ce33d260-be4e-11e9-a6ad-c109fb49072b',
				code: 'ORDER_CONFIRM',
				description: 'Xác nhận đã ăn'
			},
			{
				_id: 'de68afc0-be4e-11e9-a7b3-2bff9d9c9d9e',
				code: 'REPORT_VIEW',
				description: 'Xem báo cáo'
			}
		]

		permissions.map(async item => {
			await db.collection('permission').findOneAndUpdate(
				{ code: item.code, description: item.description },
				{
					$setOnInsert: {
						_id: item._id
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
			{
				_id: '52be5550-be4f-11e9-aa89-2b0626c97f03',
				name: 'Sư Vạn Hạnh'
			},
			{
				_id: '684077a0-be4f-11e9-acfc-5300d53ade69',
				name: 'Nha Trang'
			},
			{
				_id: '6f6e1550-be4f-11e9-acfc-5300d53ade69',
				name: 'Hoa Hồng'
			}
		]

		sites.map(async item => {
			await db.collection('site').findOneAndUpdate(
				{ name: item.name },
				{
					$setOnInsert: {
						_id: item._id
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

		const userpermissions = [
			{
				_id: '23011420-be5d-11e9-929b-3f86ce9ab9b6',
				userId: 'c30c0730-be4f-11e9-9f04-f72d443f7ef2',
				siteId: '52be5550-be4f-11e9-aa89-2b0626c97f03'
			},
			{
				_id: '28a88700-be5d-11e9-929b-3f86ce9ab9b6',
				userId: 'c30c0730-be4f-11e9-9f04-f72d443f7ef2',
				siteId: '684077a0-be4f-11e9-acfc-5300d53ade69'
			},
			{
				_id: '2d9c1330-be5d-11e9-929b-3f86ce9ab9b6',
				userId: 'c30c0730-be4f-11e9-9f04-f72d443f7ef2',
				siteId: '6f6e1550-be4f-11e9-acfc-5300d53ade69'
			}
		]

		userpermissions.map(async item => {
			await db.collection('user_permission').findOneAndUpdate(
				{ userId: item.userId, siteId: item.siteId },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						userId: item.userId,
						siteId: item.siteId,
						permissions: permissions.map(item1 => {
							delete item1.description
							return item1
						}),
						createdAt: new Date(),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)
		})

		const shops = [
			{
				_id: 'da5a0fe0-be4f-11e9-9f04-f72d443f7ef2',
				name: 'ShopA'
			},
			{
				_id: 'e1385510-be4f-11e9-9f04-f72d443f7ef2',
				name: 'ShopB'
			},
			{
				_id: 'e6fd3b00-be4f-11e9-9f04-f72d443f7ef2',
				name: 'ShopC'
			}
		]

		shops.map(async item => {
			await db.collection('shop').findOneAndUpdate(
				{ name: item.name },
				{
					$setOnInsert: {
						_id: item._id
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

		const siteshops = [
			{
				_id: 'd9000ae0-be5f-11e9-bb59-a71ca301ac7a',
				siteId: '52be5550-be4f-11e9-aa89-2b0626c97f03',
				shopId: 'da5a0fe0-be4f-11e9-9f04-f72d443f7ef2'
			},
			{
				_id: 'e011bc20-be5f-11e9-bb59-a71ca301ac7a',
				siteId: '684077a0-be4f-11e9-acfc-5300d53ade69',
				shopId: 'e1385510-be4f-11e9-9f04-f72d443f7ef2'
			},
			{
				_id: 'e56801c0-be5f-11e9-bb59-a71ca301ac7a',
				siteId: '6f6e1550-be4f-11e9-acfc-5300d53ade69',
				shopId: 'e6fd3b00-be4f-11e9-9f04-f72d443f7ef2'
			}
		]

		siteshops.map(async item => {
			await db.collection('site_shop').findOneAndUpdate(
				{ siteId: item.siteId, shopId: item.shopId },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						siteId: item.siteId,
						shopId: item.shopId,
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
