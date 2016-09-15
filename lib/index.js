const fs = require('fs')

var parser, Factory, leaves,
	main = new LeafMain()


class LeafMain {

	constructor() {
		parser = new Parser()
		factory = new Factory()
		fs.readdir("leaves", (err,res)=>{
			if(err) throw err
			console.log(res)
		})
	}

	retrieveCollection(name) {}
	getCollectionName() {}
	getCollectionAuthor() {}
	getCollectionDate() {}
}

class Parser {

	constructor() {}

	parse(file) {}
	validate(document) {}
	extractHeader(file) {}
	extractBody(file) {}
}

class Factory {

	constructor() {}

	find(options) {}
	findAll() {}
	//toArray()
	insert(document) {}
	update(document) {}
	delete(document) {}
}