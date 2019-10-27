import * as passport from 'passport'
import * as GooglePlusStrategy from 'passport-google-plus-token'

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../environments'

interface OAuthResponse {
	readonly data: any
	readonly info: any
}

// GOOGLE PLUS STRATEGY
const GooglePlusTokenStrategyCallback = async (
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

/**
 * Returns oauth response by authenticate google plus.
 *
 * @remarks
 * This method is part of the {@link auth/passport}.
 *
 * @returns The oauth response
 *
 * @beta
 */
export const authenticateGooglePlus = (req, res): Promise<OAuthResponse> =>
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
