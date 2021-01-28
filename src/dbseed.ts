import { MongoClient } from 'mongodb'

import { MLAB_URL, MLAB_DATABASE } from './environments'

async function main() {
	console.log('🚀  Server ready')

	const url = MLAB_URL!

	const dbName = MLAB_DATABASE!

	const client = new MongoClient(url, {
		// useUnifiedTopology: true,
		// useNewUrlParser: true,
	})

	try {
		await client.connect()

		console.log('🌱  Database seeder is running')

		const db = client.db(dbName)

		const users = [
			{
				_id: 'ffbdd890-f8bd-11e9-9806-8b914d623ae9',
				firstName: 'Chin',
				lastName: 'Trinh',
				gender: 'MALE',
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
			},
			{
				_id: '284b98b0-0ab6-11ea-8f2a-3967714b286f',
				firstName: 'Hieu',
				lastName: 'Tran',
				gender: 'MALE',
				local: {
					email: 'hieuhutieu98@gmail.com',
					password:
						'$2b$10$fcew2jC4VYtB1/tz/L6sA.pTxkqmjL2t7eXQzU19kr.mMnkhGpjsS'
				}
			},
			{
				_id: 'b0053a50-0a9c-11ea-84d9-2b143e93bb9e',
				firstName: 'Chin',
				lastName: 'Trinh',
				gender: 'MALE',
				local: {
					email: 'trinhchin.innos@gmail.com',
					password:
						'$2b$10$dIYDOSkHYv4lwEEDIdF3aedBDZvKNtsrweQuDyXiwTOIarrwSksBe'
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
						type: 'BASIC',
						createdAt: +new Date(),
						updatedAt: +new Date()
					}
				},
				{ upsert: true },
				function(err, res) {}
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
				{ code: item.code },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						code: item.code,
						description: item.description,
						isActive: true,
						createdAt: +new Date(),
						updatedAt: +new Date()
					}
				},
				{ upsert: true }
			)
		})

		const nodes = [
			{
				_id: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
				parentId: null,
				name: 'Acexis',
				category: 'COMPANY',
				company: {
					name: 'Acexis'
				},
				city: null,
				store: null,
				department: null,
				position: null
			},
			{
				_id: '8292d480-0a9f-11ea-a435-9d991513b2d7',
				parentId: null,
				name: 'Song tan',
				category: 'COMPANY',
				company: {
					name: 'Song tan'
				},
				city: null,
				store: null,
				department: null,
				position: null
			},
			{
				_id: 'bd398510-0aa0-11ea-a435-9d991513b2d7',
				parentId: 'a1f97720-0a9f-11ea-a435-9d991513b2d7',
				name: 'Giamdoc',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'Giamdoc'
				}
			},
			{
				_id: 'c226cfb0-0aa0-11ea-a435-9d991513b2d7',
				parentId: 'a1f97720-0a9f-11ea-a435-9d991513b2d7',
				name: 'Phogiamdoc',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'Phogiamdoc'
				}
			},
			{
				_id: '267f70c0-0aa1-11ea-a435-9d991513b2d7',
				parentId: 'a1f97720-0a9f-11ea-a435-9d991513b2d7',
				name: 'Codong',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'Codong'
				}
			},
			{
				_id: 'a1f97720-0a9f-11ea-a435-9d991513b2d7',
				parentId: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
				name: 'Directorate',
				category: 'DEPARTMENT',
				company: null,
				city: null,
				store: null,
				department: {
					name: 'Directorate'
				},
				position: null
			},
			{
				_id: 'ae507e10-0a9f-11ea-a435-9d991513b2d7',
				parentId: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
				name: 'HR',
				category: 'DEPARTMENT',
				company: null,
				city: null,
				store: null,
				department: {
					name: 'HR'
				},
				position: null
			},
			{
				_id: 'b31977d0-0a9f-11ea-a435-9d991513b2d7',
				parentId: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
				name: 'LT',
				category: 'DEPARTMENT',
				company: null,
				city: null,
				store: null,
				department: {
					name: 'LT'
				},
				position: null
			},
			{
				_id: '484d0ad0-0aad-11ea-9935-f578ac4d70fd',
				parentId: 'b31977d0-0a9f-11ea-a435-9d991513b2d7',
				name: 'Truongbophan',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'Truongbophan'
				}
			},
			{
				_id: '519dfdb0-0aad-11ea-9935-f578ac4d70fd',
				parentId: 'b31977d0-0a9f-11ea-a435-9d991513b2d7',
				name: 'CHA',
				category: 'STORE',
				company: null,
				city: null,
				store: {
					name: 'CHA'
				},
				department: null,
				position: null
			},
			{
				_id: '55e85190-0aad-11ea-9935-f578ac4d70fd',
				parentId: 'b31977d0-0a9f-11ea-a435-9d991513b2d7',
				name: 'CHB',
				category: 'STORE',
				company: null,
				city: null,
				store: {
					name: 'CHB'
				},
				department: null,
				position: null
			},
			{
				_id: 'b274cb00-0aad-11ea-9935-f578ac4d70fd',
				parentId: '519dfdb0-0aad-11ea-9935-f578ac4d70fd',
				name: 'Truongcuahang',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'Truongcuahang'
				}
			},
			{
				_id: 'e2d792a0-0aad-11ea-9935-f578ac4d70fd',
				parentId: '519dfdb0-0aad-11ea-9935-f578ac4d70fd',
				name: 'Nhanvien',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'Nhanvien'
				}
			},
			{
				_id: '0886f790-0ab6-11ea-8f2a-3967714b286f',
				parentId: 'ae507e10-0a9f-11ea-a435-9d991513b2d7',
				name: 'NhanvienHR',
				category: 'POSITION',
				company: null,
				city: null,
				store: null,
				department: null,
				position: {
					name: 'NhanvienHR'
				}
			}
		]

		nodes.map(async item => {
			await db.collection('nodes').findOneAndUpdate(
				{ _id: item._id },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						parentId: item.parentId,
						name: item.name,
						category: item.category,
						company: item.company,
						city: item.city,
						store: item.store,
						department: item.department,
						position: item.position,
						isActive: true,
						createdAt: +new Date(),
						createdBy: null,
						updatedAt: +new Date(),
						updatedBy: null
					}
				},
				{ upsert: true }
			)
		})

		const trees = [
			{
				_id: '7d1c35a0-0a9f-11ea-a435-9d991513b2d7',
				treeData: [
					{
						id: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
						title: 'Acexis',
						parentId: null,
						expanded: true,
						children: [
							{
								id: 'a1f97720-0a9f-11ea-a435-9d991513b2d7',
								title: 'Directorate',
								parentId: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
								expanded: true,
								children: []
							},
							{
								id: 'ae507e10-0a9f-11ea-a435-9d991513b2d7',
								title: 'HR',
								parentId: '7caef4e0-0a9f-11ea-a435-9d991513b2d7'
							},
							{
								id: 'b31977d0-0a9f-11ea-a435-9d991513b2d7',
								title: 'LT',
								parentId: '7caef4e0-0a9f-11ea-a435-9d991513b2d7',
								expanded: true,
								children: [
									{
										id: '519dfdb0-0aad-11ea-9935-f578ac4d70fd',
										title: 'CHA',
										parentId: 'b31977d0-0a9f-11ea-a435-9d991513b2d7'
									},
									{
										id: '55e85190-0aad-11ea-9935-f578ac4d70fd',
										title: 'CHB',
										parentId: 'b31977d0-0a9f-11ea-a435-9d991513b2d7'
									}
								]
							}
						]
					},
					{
						id: '8292d480-0a9f-11ea-a435-9d991513b2d7',
						title: 'Song tan',
						parentId: null
					}
				]
			}
		]

		trees.map(async item => {
			await db.collection('trees').findOneAndUpdate(
				{ _id: item._id },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						treeData: item.treeData,
						createdAt: +new Date(),
						updatedAt: +new Date()
					}
				},
				{ upsert: true }
			)
		})

		const roles = [
			{
				_id: '6d592f10-0aae-11ea-9935-f578ac4d70fd',
				nodeId: 'e2d792a0-0aad-11ea-9935-f578ac4d70fd',
				code: 'LT_EMPLOYEE',
				description: 'Nhân viên Lập Trình',
				permissions: ['ad5a65e0-be4e-11e9-a6ad-c109fb49072b']
			},
			{
				_id: 'a0ef0e30-0aae-11ea-9935-f578ac4d70fd',
				nodeId: 'b274cb00-0aad-11ea-9935-f578ac4d70fd',
				code: 'CHA_MANAGER',
				description: 'Trưởng của hàng A',
				permissions: ['6ca4ffb0-be4e-11e9-b75c-d915f7b6e00b']
			},
			{
				_id: 'eb8c01f0-0aae-11ea-9935-f578ac4d70fd',
				nodeId: 'ae507e10-0a9f-11ea-a435-9d991513b2d7',
				code: 'HR',
				description: 'Bộ phận HR',
				permissions: ['f1dbbda0-be4d-11e9-bc7c-2117bce2f37c']
			},
			{
				_id: 'be45e3a0-0aae-11ea-9935-f578ac4d70fd',
				nodeId: '484d0ad0-0aad-11ea-9935-f578ac4d70fd',
				code: 'LT_MANAGER',
				description: 'Trưởng bộ phân Lập Trình',
				permissions: [
					'a6957510-be4e-11e9-a6ad-c109fb49072b',
					'f1dbbda0-be4d-11e9-bc7c-2117bce2f37c'
				]
			}
		]

		roles.map(async item => {
			await db.collection('roles').findOneAndUpdate(
				{ _id: item._id },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						nodeId: item.nodeId,
						code: item.code,
						description: item.description,
						isActive: true,
						createdAt: +new Date(),
						updatedAt: +new Date()
					}
				},
				{ upsert: true }
			)
		})

		const userRoles = [
			{
				_id: '43fbcd90-0ab7-11ea-bcbf-675de3f924a3',
				userId: 'd9dacf10-edb5-11e9-ba96-217967694746',
				roleId: 'eb8c01f0-0aae-11ea-9935-f578ac4d70fd'
			},
			{
				_id: '6c6e1cb0-0ab7-11ea-bcbf-675de3f924a3',
				userId: '284b98b0-0ab6-11ea-8f2a-3967714b286f',
				roleId: 'be45e3a0-0aae-11ea-9935-f578ac4d70fd'
			},
			{
				_id: '93e2aae0-0ab7-11ea-bcbf-675de3f924a3',
				userId: 'b0053a50-0a9c-11ea-84d9-2b143e93bb9e',
				roleId: 'a0ef0e30-0aae-11ea-9935-f578ac4d70fd'
			},
			{
				_id: 'b6a48670-0ab7-11ea-bcbf-675de3f924a3',
				userId: '964879b0-ee4f-11e9-8659-0d1c206c3c76',
				roleId: '6d592f10-0aae-11ea-9935-f578ac4d70fd'
			}
		]

		userRoles.map(async item => {
			await db.collection('user_role').findOneAndUpdate(
				{ _id: item._id },
				{
					$setOnInsert: {
						_id: item._id
					},
					$set: {
						userId: item.userId,
						roleId: item.roleId,
						createdAt: +new Date(),
						updatedAt: +new Date()
					}
				},
				{ upsert: true }
			)
		})

		// const companies = [
		// 	{
		// 		_id: '828ffd60-0454-11ea-a419-df3cbac30251',
		// 		name: 'Acexis',
		// 		manager: 'Le Si Phu'
		// 	}
		// ]

		// companies.map(async item => {
		// 	await db.collection('companies').findOneAndUpdate(
		// 		{ _id: item._id },
		// 		{
		// 			$setOnInsert: {
		// 				_id: item._id
		// 			},
		// 			$set: {
		// 				name: item.name,
		// 				manager: item.manager,
		// 				createdAt: +new Date(),
		// 				updatedAt: +new Date()
		// 			}
		// 		},
		// 		{ upsert: true }
		// 	)
		// })

		// const cities = [
		// 	{
		// 		_id: 'e3be2790-0456-11ea-9cc4-fde334d55778',
		// 		name: 'Ho Chi Minh'
		// 	},
		// 	{
		// 		_id: 'f6361720-0456-11ea-9cc4-fde334d55778',
		// 		name: 'Ha Noi'
		// 	}
		// ]

		// cities.map(async item => {
		// 	await db.collection('cities').findOneAndUpdate(
		// 		{ _id: item._id },
		// 		{
		// 			$setOnInsert: {
		// 				_id: item._id
		// 			},
		// 			$set: {
		// 				name: item.name,
		// 				createdAt: +new Date(),
		// 				updatedAt: +new Date()
		// 			}
		// 		},
		// 		{ upsert: true }
		// 	)
		// })

		// const stores = [
		// 	{
		// 		_id: '2d778730-0459-11ea-b749-517949f46e8e',
		// 		name: 'Cua hang A'
		// 	},
		// 	{
		// 		_id: '3601ceb0-0459-11ea-b749-517949f46e8e',
		// 		name: 'Cua hang B'
		// 	}
		// ]

		// stores.map(async item => {
		// 	await db.collection('stores').findOneAndUpdate(
		// 		{ _id: item._id },
		// 		{
		// 			$setOnInsert: {
		// 				_id: item._id
		// 			},
		// 			$set: {
		// 				name: item.name,
		// 				createdAt: +new Date(),
		// 				updatedAt: +new Date()
		// 			}
		// 		},
		// 		{ upsert: true }
		// 	)
		// })

		// const departments = [
		// 	{
		// 		_id: '764d0bf0-045a-11ea-8b63-27df4f2cc906',
		// 		name: 'Kinh doanh'
		// 	},
		// 	{
		// 		_id: '7e1eb1d0-045a-11ea-8b63-27df4f2cc906',
		// 		name: 'Nhan su'
		// 	}
		// ]

		// departments.map(async item => {
		// 	await db.collection('departments').findOneAndUpdate(
		// 		{ _id: item._id },
		// 		{
		// 			$setOnInsert: {
		// 				_id: item._id
		// 			},
		// 			$set: {
		// 				name: item.name,
		// 				createdAt: +new Date(),
		// 				updatedAt: +new Date()
		// 			}
		// 		},
		// 		{ upsert: true }
		// 	)
		// })

		// const positions = [
		// 	{
		// 		_id: '8cd3d790-045b-11ea-a27e-576ab14235fd',
		// 		name: 'Nhan vien',
		// 		isActive: true,
		// 		createdAt: 1573460183945,
		// 		updatedAt: 1573460183945
		// 	},
		// 	{
		// 		_id: '963ac370-045b-11ea-a27e-576ab14235fd',
		// 		name: 'Truong Cua Hang',
		// 		isActive: true,
		// 		createdAt: 1573460199719,
		// 		updatedAt: 1573460199719
		// 	},
		// 	{
		// 		_id: '9cf79df0-045b-11ea-a27e-576ab14235fd',
		// 		name: 'Truong Bo Phan',
		// 		isActive: true,
		// 		createdAt: 1573460211023,
		// 		updatedAt: 1573460211023
		// 	}
		// ]

		// positions.map(async item => {
		// 	await db.collection('positions').findOneAndUpdate(
		// 		{ _id: item._id },
		// 		{
		// 			$setOnInsert: {
		// 				_id: item._id
		// 			},
		// 			$set: {
		// 				name: item.name,
		// 				createdAt: +new Date(),
		// 				updatedAt: +new Date()
		// 			}
		// 		},
		// 		{ upsert: true }
		// 	)
		// })
	} catch (err) {
		console.log('❌  Server error', err.stack)
	} finally {
		console.log('💤  Server off')
		await client.close()
	}
}

main().catch(error => console.log('❌  Server error', error.stack))
