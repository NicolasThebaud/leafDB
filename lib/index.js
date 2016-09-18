const fs = require('fs')

var Collection, Parser
var leaves = new Set()
leaves.add('lel')

!(function() {
	'use strict'

	Collection = class Collection {
		constructor(filename) { this.filename = filename }
	
		parseFile(callback) {
			fs.readFile('leaves/'+this.filename, (err,data)=>{
				if(err) throw err
				data = data.toString()
				let parser = new Parser()
				this.collection = parser.parse(data)
				callback()
			})
		}
	
		getCollectionName() { return this.collection.head.collection || '' }
		getCollectionAuthor() { return this.collection.head.author || '' }
		getCollectionDate() {
			let date = this.collection.head.creation || ''
			return date.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, (w,d,m,y,h,m_)=>{
				return `${d}/${m}/${y}-${h}:${m_}`
			})
		}
	
		findAll() { return this.collection.body.documents }
		find(options) {}
		insert(document) {}
		update(document) {}
		remove(document) {}
	}

	Parser = class Parser {
		parse(data) {
			let lines = data.split('\n'), tmp = null
			if(!data.includes('##LEAF_SOH') || !data.includes('##LEAF_EOH')) console.log('[LEAFDB-CORE][ERROR] Collection could not be parsed, file is corrupted')
			else {
				//**DEBUG**
					//console.log('*** header ***', "\r\n\r\n", this.extractHeader(lines))
					//console.log("\r\n")
					//console.log('*** body ***', "\r\n\r\n", this.extractBody(lines))
				tmp = {"head": JSON.parse(this.extractHeader(lines)), "body": JSON.parse(this.extractBody(lines))}
			}
			return tmp
		}
	
		extractHeader(data) {
			let tmp = new Array()
			for(let line of data) {
				line = line.replace(/\r|\t/g, '')
				if(line==="##LEAF_SOH") continue
				else if(line==="##LEAF_EOH") break
				else tmp.push(line)
			}
			return tmp.join('')
		}
	
		extractBody(data) {
			let tmp = new Array(), eoh = false
			for(let line of data) {
				line = line.replace(/\r|\t/g, '')
				if(line==="##LEAF_EOH") eoh=true
				else if(!eoh) continue
				else tmp.push(line)
			}
			return tmp.join('')
		}
	}
})()

module.exports = {
	getCollection: function(name, callback) {
		'use strict'
		fs.readdir("leaves", (err,res)=>{
			if(err) throw err
			var isLeaf = new RegExp(name+'\.leaf$')
			for(let collection of res) if(isLeaf.test(collection)) {
				let c = new Collection(collection)
				c.parseFile((err,res)=>{
					if(err) throw err
					leaves.add(c)
					callback(c)
				})
			}
		})
	}
}


//************************************************
/*module.exports = function() {
	'use strict'

	console.log('[LEAFDB-CORE] LeafDB service started')

	var init = function() {
		fs.readdir("leaves", (err,res)=>{
			if(err) throw err
			var isLeaf = new RegExp(/\.leaf$/)
			for(let collection of res) if(isLeaf.test(collection)) {
				let c = new Collection(collection)
				c.parseFile((err,res)=>{
					if(err) throw err
					leaves.add(c)
					// console.log(c)
				})
			}
		})
	}
	init()

	function validate(document) {

	}

	var getCollection = function(name) {
		return [...leaves].filter((c,i,a)=>{ c.getCollectionName()===c })
	}

	class Collection {
		constructor(filename) { this.filename = filename }
	
		parseFile(callback) {
			fs.readFile('leaves/'+this.filename, (err,data)=>{
				if(err) throw err
				data = data.toString()
				let parser = new Parser()
				this.collection = parser.parse(data)
				callback()
			})
		}
	
		getCollectionName() { return this.collection.head.collection || '' }
		getCollectionAuthor() { return this.collection.head.author || '' }
		getCollectionDate() {
			let date = this.collection.head.creation || ''
			return date.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, (w,d,m,y,h,m_)=>{
				return `${d}/${m}/${y}-${h}:${m_}`
			})
		}
	
		findAll() { return this.collection.body.documents }
		find(options) {}
		insert(document) {}
		update(document) {}
		remove(document) {}
	}

	class Parser {
		parse(data) {
			let lines = data.split('\n'), tmp = null
			if(!data.includes('##LEAF_SOH') || !data.includes('##LEAF_EOH')) console.log('[LEAFDB-CORE][ERROR] Collection could not be parsed, file is corrupted')
			else {
				//**DEBUG**
					//console.log('*** header ***', "\r\n\r\n", this.extractHeader(lines))
					//console.log("\r\n")
					//console.log('*** body ***', "\r\n\r\n", this.extractBody(lines))
				tmp = {"head": JSON.parse(this.extractHeader(lines)), "body": JSON.parse(this.extractBody(lines))}
			}
			return tmp
		}
	
		extractHeader(data) {
			let tmp = new Array()
			for(let line of data) {
				line = line.replace(/\r|\t/g, '')
				if(line==="##LEAF_SOH") continue
				else if(line==="##LEAF_EOH") break
				else tmp.push(line)
			}
			return tmp.join('')
		}
	
		extractBody(data) {
			let tmp = new Array(), eoh = false
			for(let line of data) {
				line = line.replace(/\r|\t/g, '')
				if(line==="##LEAF_EOH") eoh=true
				else if(!eoh) continue
				else tmp.push(line)
			}
			return tmp.join('')
		}
	}
}*/