import * as Stripe from 'stripe'

import { STRIPE_SECRET_KEY } from '@environments'

export const stripe = new Stripe(STRIPE_SECRET_KEY!)
