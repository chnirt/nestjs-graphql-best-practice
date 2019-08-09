import { MongoClient } from 'mongodb'
import * as uuid from 'uuid'

async function main() {
	console.log('🌱  Database seeder is running')

	const url =
		'mongodb://localhost:' + process.env.MONGO_PORT ||
		'mongodb://admin:chnirt1803@ds347467.mlab.com:47467/nest-graphql'
	const dbName = 'rtalunchapp'

	const client = new MongoClient(url, { useNewUrlParser: true })

	try {
		await client.connect()
		console.log('🚀  Server ready')

		const db = client.db(dbName)

		const userInput = {
			username: 'admin',
			password: '$2b$10$zZlBfV2IMrXPnbtHd1Bwqus97HvLE28N9.rCvNSUURFQdDD945fXK',
			fullName: 'admin',
			isLocked: false,
			reason: '',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		const sites = ['Sư Vạn Hạnh', 'Nha Trang', 'Hoa Hồng']

		await db.collection('user').findOneAndUpdate(
			{ username: 'admin' },
			{
				$setOnInsert: {
					_id: uuid.v1()
				},
				$set: userInput
			},
			{ upsert: true }
		)

		sites.map(async name => {
			await db.collection('site').findOneAndUpdate(
				{ name },
				{
					$setOnInsert: {
						_id: uuid.v1()
					},
					$set: {
						name,
						createdAt: new Date(),
						updatedAt: new Date()
					}
				},
				{ upsert: true }
			)
		})

		await db.collection('shop').findOneAndUpdate(
			{ name: 'Deli' },
			{
				$setOnInsert: {
					_id: uuid.v1()
				},
				$set: {
					name: 'Deli',
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date()
				}
			},
			{ upsert: true }
		)

		client.close()
		console.log('💤  Server off')
	} catch (err) {
		console.log('❌  Server error', err.stack)
	}
}

main()
