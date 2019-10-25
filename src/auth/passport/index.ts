import * as passport from 'passport'
import * as GooglePlusStrategy from 'passport-google-plus-token'
import { User } from '../../models'

import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL
} from '../../environments'
import { getMongoRepository } from 'typeorm'
import { AuthenticationError } from 'apollo-server-core'

// GOOGLE PLUS STRATEGY
const GooglePlusTokenStrategyCallback = async (
	accessToken,
	refreshToken,
	profile,
	next
) => {
	const user = await getMongoRepository(User).findOne({
		where: {
			'googleplus._id': profile.id
		}
	})

	if (user) {
		next(null, user)
	}

	console.log(profile)

	// add create User
	// getMongoRepository(User).save(
	// 	new User({
	// 		googleplus: {
	// 			_id: profile.id,
	// 			email: profile.emails[0].value
	// 		}
	// 	})
	// )

	await next(null, {
		accessToken,
		refreshToken,
		profile
	})
}

passport.use(
	new GooglePlusStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		},
		GooglePlusTokenStrategyCallback
	)
)

// promisified authenticate functions
export const authenticateGooglePlus = (req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate(
			'google-plus-token',
			{ session: false },
			(err, data, info) => {
				if (err) {
					reject(err)
				}
				resolve({ data, info })
			}
		)(req, res)
	})
