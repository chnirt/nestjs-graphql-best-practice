import { MongoClient } from 'mongodb'

import { MONGO_URL, MONGO_DB } from './environments'

async function main() {
	console.log('🚀  Server ready')

	const url = MONGO_URL!

	const dbName = MONGO_DB!

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
				_id: 'ffbdd890-f8bd-11e9-9806-8b914d623ae9',
				firstName: 'Chin',
				lastName: 'Trinh',
				gender: 'MALE',
				local: {
					email: 'trinhchinchin@gmail.com',
					password:
						'$2b$10$fcew2jC4VYtB1/tz/L6sA.pTxkqmjL2t7eXQzU19kr.mMnkhGpjsS'
				},
				google: {
					_id: '107178666920276184612',
					email: 'trinhchinchin@gmail.com'
				}
			},
			{
				_id: 'd9dacf10-edb5-11e9-ba96-217967694746',
				firstName: 'Chin Chin',
				lastName: 'Trinh',
				gender: 'MALE',
				local: {
					email: 'nhocpo.juzo@gmail.com',
					password:
						'$2b$10$fcew2jC4VYtB1/tz/L6sA.pTxkqmjL2t7eXQzU19kr.mMnkhGpjsS'
				}
			},
			{
				_id: '964879b0-ee4f-11e9-8659-0d1c206c3c76',
				firstName: 'Hung',
				lastName: 'Luu',
				gender: 'MALE',
				local: {
					email: 'luuvinhhung159@gmail.com',
					password:
						'$2b$10$fcew2jC4VYtB1/tz/L6sA.pTxkqmjL2t7eXQzU19kr.mMnkhGpjsS'
				}
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
						local: item.local,
						google: item.google,
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
