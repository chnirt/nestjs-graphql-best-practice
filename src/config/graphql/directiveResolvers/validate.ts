const validate = (next, src, args, context) => {
	return next().then(str => {
		// console.log(str)
		return str
	})
}

export default validate
