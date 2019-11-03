import * as passport from 'passport'
import * as GooglePlusTokenStrategy from 'passport-google-plus-token'
import * as FacebookTokenStrategy from 'passport-facebook-token'
import { Strategy as GoogleTokenStrategy } from 'passport-google-token'

import {
	FACEBOOK_APP_ID,
	FACEBOOK_APP_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '@environments'

interface OAuthResponse {
	readonly data: any
	readonly info: any
}

// GOOGLE PLUS STRATEGY
const googlePlusTokenStrategyCallback = async (
	accessToken,
	refreshToken,
	profile,
	done
) =>
	done(null, {
		accessToken,
		refreshToken,
		profile
	})

passport.use(
	new GooglePlusTokenStrategy(
		{
			clientID: GOOGLE_CLIENT_ID!,
			clientSecret: GOOGLE_CLIENT_SECRET!
		},
		googlePlusTokenStrategyCallback
	)
)

// FACEBOOK STRATEGY
const facebookTokenStrategyCallback = (
	accessToken,
	refreshToken,
	profile,
	done
) =>
	done(null, {
		accessToken,
		refreshToken,
		profile
	})

passport.use(
	new FacebookTokenStrategy(
		{
			clientID: FACEBOOK_APP_ID!,
			clientSecret: FACEBOOK_APP_SECRET!
		},
		facebookTokenStrategyCallback
	)
)

// GOOGLE STRATEGY
const googleTokenStrategyCallback = async (
	accessToken,
	refreshToken,
	profile,
	done
) =>
	done(null, {
		accessToken,
		refreshToken,
		profile
	})

passport.use(
	new GoogleTokenStrategy(
		{
			clientID: GOOGLE_CLIENT_ID!,
			clientSecret: GOOGLE_CLIENT_SECRET!
		},
		googleTokenStrategyCallback
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

/**
 * Returns oauth response by authenticate facebook.
 *
 * @remarks
 * This method is part of the {@link auth/passport}.
 *
 * @returns The oauth response
 *
 * @beta
 */
export const authenticateFacebook = (req, res): Promise<OAuthResponse> =>
	new Promise((resolve, reject) => {
		passport.authenticate(
			'facebook-token',
			{ session: false },
			(err, data, info) => {
				if (err) {
					reject(err)
				}
				resolve({ data, info })
			}
		)(req, res)
	})

/**
 * Returns oauth response by authenticate google.
 *
 * @remarks
 * This method is part of the {@link auth/passport}.
 *
 * @returns The oauth response
 *
 * @beta
 */
export const authenticateGoogle = (req, res): Promise<OAuthResponse> =>
	new Promise((resolve, reject) => {
		passport.authenticate(
			'google-token',
			{ session: false },
			(err, data, info) => {
				if (err) {
					reject(err)
				}
				resolve({ data, info })
			}
		)(req, res)
	})
