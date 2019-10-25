import { MongoClient } from 'mongodb'

async function main() {
	console.log('🚀  Server ready')

	const url = process.env.MONGO_PORT
		? `mongodb://localhost:${process.env.MONGO_PORT}`
		: 'mongodb://admin:chnirt1803@ds147420.mlab.com:47420/chnirt-nest'

	const dbName = 'chnirt-nest'

	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	try {
		await client.connect()

		console.log('🌱  Database seeder is running')

		const db = client.db(dbName)

		// const tests = [...Array(10000).keys()].map(item => ({
		// 	_id: item,
		// 	userId: 'c30c0730-be4f-11e9-9f04-f72d443f7ef2',
		// 	description: 'test' + item,
		// 	createdAt: new Date(),
		// 	updatedAt: new Date()
		// }))

		// await db.collection('history').insertMany(tests)

		const users = [
			{
				_id: 'c30c0730-be4f-11e9-9f04-f72d443f7ef2',
				firstName: 'Chin',
				lastName: 'Trinh',
				gender: 'MALE',
				email: 'trinhchinchin@gmail.com'
			},
			{
				_id: 'd9dacf10-edb5-11e9-ba96-217967694746',
				firstName: 'Chin Chin',
				lastName: 'Trinh',
				gender: 'MALE',
				email: 'nhocpo.juzo@gmail.com'
			},
			{
				_id: '964879b0-ee4f-11e9-8659-0d1c206c3c76',
				firstName: 'Hung',
				lastName: 'Luu',
				gender: 'MALE',
				email: 'luuvinhhung159@gmail.com'
			}
		]

		users.map(async item => {
			await db.collection('users').findOneAndUpdate(
				{ _id: item._id },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						local: {
							email: item.email,
							password:
								'$2b$10$KeRbjXtzdK1nR0AR1BKjFu5AOh/PjYACgS.4OQV5KtykJZRFSEo22'
						},
						firstName: item.firstName,
						lastName: item.lastName,
						gender: item.gender,
						isVerified: true,
						isOnline: false,
						isLocked: false,
						reason: '',
						isActive: true,
						createdAt: +new Date(),
						updatedAt: +new Date()
					}
				},
				{ upsert: true }
			)
		})

		const permissions = [
			{
				_id: 'f1dbbda0-be4d-11e9-bc7c-2117bce2f37c',
				code: 'FORM_READ',
				description: 'Xem biên bản'
			},
			{
				_id: 'ad5a65e0-be4e-11e9-a6ad-c109fb49072b',
				code: 'FORM_CREATE',
				description: 'Tạo biên bản'
			},
			{
				_id: '6ca4ffb0-be4e-11e9-b75c-d915f7b6e00b',
				code: 'FORM_ACCEPT_1ST',
				description: 'Duyệt biên bản lần 1'
			},
			{
				_id: 'a6957510-be4e-11e9-a6ad-c109fb49072b',
				code: 'FORM_ACCEPT_2ND',
				description: 'Duyệt biên bản lần 2'
			}
		]

		permissions.map(async item => {
			await db.collection('permissions').findOneAndUpdate(
				{ code: item.code, description: item.description },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						code: item.code,
						description: item.description,
						createdAt: +new Date(),
						updatedAt: +new Date()
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
