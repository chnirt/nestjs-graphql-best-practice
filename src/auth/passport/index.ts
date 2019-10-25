import * as passport from 'passport'
import * as GooglePlusStrategy from 'passport-google-plus-token'

import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL
} from '../../environments'

// GOOGLE PLUS STRATEGY
const GooglePlusTokenStrategyCallback = (
	accessToken,
	refreshToken,
	profile,
	next
) =>
	next(null, {
		accessToken,
		refreshToken,
		profile
	})

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
