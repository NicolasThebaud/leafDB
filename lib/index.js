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
					let IDs = Object.keys(docs).map(e=>e.__leafID), id = (+(''+Math.random()).substring(2)).toString(36)
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
			if(Object.keys(options).length) {
				for(let doc of collection) {
					for(let key in options) {
						if(doc.hasOwnProperty(key) && doc[key]==options[key]) res.push(doc)
					}
				}
			} else res = this.findAll()
			return res
		}
		
		insert(doc, callback) {
			let docs = this.findAll()
			if(docs) {
				doc.__leafID = this.private_.get(this).genID(docs)
				docs.push(doc)
				this.private_.get(this).updateFile(this, callback, null, docs)
			} else callback("An error ocurred", {})
		}
		update(ref, doc, callback) {
			let existing = this.find(ref), 
				dump = this.collection.body.documents.clone()
			if(Object.keys(existing).length) {
				for(let ref_doc of dump) {
					if(Object.keys(ref).every(e=>Object.keys(ref_doc).indexOf(e)>-1)) {
						console.log("\r\n")
						console.log("\t"+"DEBUG**", ref_doc)
						for(let key of Object.keys(doc)) {
							console.log("\t"+ref_doc[key], '-->', doc[key])
							ref_doc[key] = doc[key]
						}
						console.log("\t"+"DEBUG**", ref_doc)
					}
				}
				console.log("\r\n")
				console.log("DUMP**", dump)
				console.log("\r\n")
				this.private_.get(this).updateFile(this, callback, null, dump)
			} else callback("An error ocurred", {})
		}
		remove(ref, callback) {
			let existing = this.find(ref), 
				dump = this.collection.body.documents.clone()
			if(Object.keys(existing).length) {
				for(let ref_doc of existing) {
					console.log("REF**", ref_doc)
					dump.forEach((e,i,arr)=>{ if(e.__leafID===ref_doc.__leafID) arr.splice(i,1) })
				}
				console.log("\r\n")
				console.log("DUMP**", dump)
				console.log("\r\n")
				this.private_.get(this).updateFile(this, callback, null, dump)
			} else callback("An error ocurred", {})
		}
	}

	Parser = class Parser {
		parse(data) {
			let lines = data.split('\n'), tmp = null
			if(!data.includes('##LEAF_SOH') || !data.includes('##LEAF_EOH')) console.log('[LEAFDB-CORE][ERROR] Collection could not be parsed, file is corrupted')
			else {
				tmp = {
					"head": JSON.parse(this.extractHeader(lines)), 
					"body": JSON.parse(this.extractBody(lines))
				}
			}
			return tmp
		}
	
		extractHeader(data) {
			let tmp = new Array()
			for(let line of data) {
				line = line.replace(/\r|\t/g, '').replace(' ', '')
				if(line==="##LEAF_SOH") continue
				else if(line==="##LEAF_EOH") break
				else tmp.push(line)
			}
			return tmp.join('')
		}
	
		extractBody(data) {
			let tmp = new Array(), eoh = false
			for(let line of data) {
				line = line.replace(/\r|\t/g, '').replace(' ', '')
				if(line==="##LEAF_EOH") eoh=true
				else if(!eoh) continue
				else tmp.push(line)
			}
			return tmp.join('')
		}
	}

	Array.prototype.clone = function() {
		return this.slice(0)
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