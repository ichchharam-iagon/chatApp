const mongoose = require('mongoose')

const connection = async () => {
	try {
		console.log(process.env.MONGODB_URI)
		await mongoose.connect(process.env.MONGODB_URI)
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error(`Error: ${error.message}`)
		process.exit(1)
	}
}

module.exports = connection
