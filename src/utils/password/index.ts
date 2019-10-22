import { hash, compare } from 'bcrypt'

import { SALT } from '../../environments'

export const hashPassword = async (password: string) => {
	return await hash(password, SALT)
}

export const comparePassword = async (password: string, hash: string) => {
	return await compare(password, hash)
}
