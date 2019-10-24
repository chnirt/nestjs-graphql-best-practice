import * as passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth'

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../environments'

const GoogleStrategy = OAuth2Strategy

// FACEBOOK STRATEGY
// passport.use(
// 	new FacebookTokenStrategy(
// 		{
// 			clientID: 'your-facebook-app-id',
// 			clientSecret: 'your-facebook-app-secret'
// 		},
// 		(accessToken, refreshToken, profile, done) =>
// 			done(null, {
// 				accessToken,
// 				refreshToken,
// 				profile
// 			})
// 	)
// )

// GOOGLE STRATEGY
passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://www.example.com/auth/google/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			// User.findOrCreate({ googleId: profile.id }, function(err, user) {
			// 	return done(err, user)
			// })
			return done(null)
		}
	)
)

// promisified authenticate functions
// export const authenticateFacebook = (req, res) =>
// 	new Promise((resolve, reject) => {
// 		passport.authenticate(
// 			'facebook-token',
// 			{ session: false },
// 			(err, data, info) => {
// 				if (err) {
// 					reject(err)
// 				}
// 				resolve({ data, info })
// 			}
// 		)(req, res)
// 	})

// export const authenticateGoogle = (req, res) =>
// 	new Promise((resolve, reject) => {
// 		passport.authenticate(
// 			'google-token',
// 			{ session: false },
// 			(err, data, info) => {
// 				if (err) {
// 					reject(err)
// 				}
// 				resolve({ data, info })
// 			}
// 		)(req, res)
// 	})

// export const upsertFbUser = async ({ accessToken, refreshToken, profile }) => {
// 	const User = this

// 	const user = await User.findOne({ 'social.facebookProvider.id': profile.id })

// 	// no user was found, lets create a new one
// 	if (!user) {
// 		const newUser = await User.create({
// 			name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
// 			email: profile.emails[0].value,
// 			'social.facebookProvider': {
// 				id: profile.id,
// 				token: accessToken
// 			}
// 		})

// 		return newUser
// 	}
// 	return user
// }

// export const upsertGoogleUser = async ({
// 	accessToken,
// 	refreshToken,
// 	profile
// }) => {
// 	const User = this

// 	const user = await User.findOne({ 'social.googleProvider.id': profile.id })

// 	// no user was found, lets create a new one
// 	if (!user) {
// 		const newUser = await User.create({
// 			name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
// 			email: profile.emails[0].value,
// 			'social.googleProvider': {
// 				id: profile.id,
// 				token: accessToken
// 			}
// 		})

// 		return newUser
// 	}
// 	return user
// }
