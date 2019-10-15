import { MongoClient } from 'mongodb'

async function main() {
	console.log('🚀  Server ready')

	const url = process.env.MONGO_PORT
		? 'mongodb://localhost:' + process.env.MONGO_PORT
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
						firstName: item.firstName,
						lastName: item.lastName,
						email: item.email,
						password:
							'$2b$10$KeRbjXtzdK1nR0AR1BKjFu5AOh/PjYACgS.4OQV5KtykJZRFSEo22',
						gender: item.gender,
						isVerified: true,
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

		client.close()
		console.log('💤  Server off')
	} catch (err) {
		console.log('❌  Server error', err.stack)
	}
}

main()
