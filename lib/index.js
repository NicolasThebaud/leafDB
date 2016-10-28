const fs = require('fs')

var Collection, Parser
var leaves = new Set()

!(function() {
	'use strict'

	Collection = class Collection {
		constructor(filename) { 
			this.filename = filename 
			this.private_ = new WeakMap()
			this.private_.set(this, {
				genID: function(docs) {
					let IDs = docs.map(e=>e.__leafID), id = (+(''+Math.random()).substring(2)).toString(36)
					while(IDs[id]||false) id = (+(''+Math.random()).substring(2)).toString(36)
					return id
				},
				updateFile: function(collection, callback, err_, res_) {
					fs.rename('leaves/'+collection.filename, 'leaves/'+collection.filename+'_bkp', (err,res)=>{
						if(err) throw err
						fs.writeFile('leaves/'+collection.filename, 
							`##LEAF_SOH 
${JSON.stringify(collection.collection.head)} 
##LEAF_EOH 
{"documents": ${JSON.stringify(res_)}}`, (err,res)=>{
							if(err) throw err
							callback(err_, res_)
						})
					})
				}
			})
		}
	
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
		find(options) {
			let collection = this.findAll(), res = new Array()
			if(options.length) for(let doc of collection)
				for(let key in options) {
					console.log(key, '->', options[key])
					if(doc.hasOwnProperty(key) && doc[key]==options[key]) res.push(doc)
				}
			else res = this.findAll()
			return res
		}
		
		insert(document, callback) {
			let docs = this.findAll()
			if(docs) document.__leafID = this.private_.get(this).genID(docs), docs.push(document), this.private_.get(this).updateFile(this, callback, null, docs)
			else callback("An error ocurred", {})
		}
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