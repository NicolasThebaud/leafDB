const fs = require('fs')

!(function() {
	'use strict'

	console.log('[LEAFDB-CORE] LeafDB service started')

	var leaves = new Set()

	init()
	function init() {
		fs.readdir("leaves", (err,res)=>{
			if(err) throw err
			for(let collection of res) leaves.add(new Collection(collection))
		})
	}
	
	function retrieveCollection(name) {

	}

	function validate(document) {}
	function find(options) {}
	function findAll() {}
	//toArray()
	function insert(document) {}
	function update(document) {}
	function remove(document) {}

	class Collection {

		constructor(filename) {
			fs.readFile('leaves/'+filename, (err,data)=>{
				if(err) throw err
				data = data.toString()
				let parser = new Parser()
				this.collection = parser.parse(data)
			})
		}

		getCollectionName() {}
		getCollectionAuthor() {}
		getCollectionDate() {}
	}

	class Parser {
		parse(data) {
			let lines = data.split('\n'), tmp = null
			if(!data.includes('##LEAF_SOH') || !data.includes('##LEAF_EOH')) console.log('[LEAFDB-CORE][ERROR] Collection could not be parsed, file is corrupted')
			else {
				/**DEBUG**/
					/*console.log('*** header ***', "\r\n\r\n", this.extractHeader(lines))
					console.log("\r\n")
					console.log('*** body ***', "\r\n\r\n", this.extractBody(lines))*/
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