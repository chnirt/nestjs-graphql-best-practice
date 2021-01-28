import Stripe from 'stripe'

import { STRIPE_SECRET_KEY } from '@environments'

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27',
	maxNetworkRetries: 1,
	timeout: 1000
})
