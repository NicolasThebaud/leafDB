# DISCLAIMER

I'm currently working on a web page for LeafDB.

Uhm, subdisclaimer : this is an Alpha version at the moment, there might be bugs somewhere.

# leafDB

Schemaless database-like file-based data management framework (SDLFBDMF doesn't make any sense, plus you can't pronounce it).

Leaf it is. leaf is easy to say.

![](https://media.giphy.com/media/JIS3HjZexQJsk/giphy.gif)

You wouldn't take a tank to shoot a housefly. (I know it's a cat, I couldn't find a gif with a fly in it).


Knowing that, why would you take a full DBMS to handle a tiny dataset ?

# Motivation

Some projects are just small, with little datasets. It's dirty to hardcode data in the code, but It doesn't feel quite clean to use a giant factory like MongoDB either.


As a student, I have a few personnal projects I made for the sake of learning and practicing. Those are small projects, with small datasets (a few documents only). 

I once felt quite stupid installing Mongo & Robomongo, setting both up, having quite a few errors, ...

And all this, for 4-5 JSON documents. yes.



It was at this moment I knew, I f-
 Well, you get the idea.
 
# How to install

Note: LeafDB is not available on npm yet. I'm working on it (kinda)

To install leaf, you have to download the master branch as a zip, put it somewhere on your computer (the same computer your project is on [duh] ), then install it as a local package using npm:

```
> npm install C:/whatever/folder/leafDB/
```

# How to use

Note: I'm currently working on a WEB page that will contains installation & usage tutorials, as well as code samples


To use LeafDB, you may first generate a **.leaf** file, *ie.* a collection.

To do so, leafDB comes with a CLI, named **leafify** (talk about creativity), that includes one simple command:


```
> leafify whatever.json into <collection-name> [-o <output-dir> ] [-a <author> ]
```

This will create a **.leaf** file, named *collection-name* in a **leaves/** directory by default (if *-o* option is unset).
You can also specify an *author* for the collection; This is purely *metadata*, it's optional.


When you have your collections set (*ie.* your **.leaf** files), you can dive into your code.


LeafDB currently implements :

```
getCollection(name, callback)  -> Parse a collection with a given name
getCollectionName()            -> Returns the collection's name
getCollectionAuthor()          -> Returns the collection's author
getCollectionDate()            -> Returns the collection's creation date (jj/mm/aaaa-hh:mm:ss)

findAll()                      -> Return all documents in the collection
find(options)                  -> Return documents matching the pattern
insert(doc, callback)          -> Insert a document into the collection
update(ref, doc, callback)     -> Update all documents matched by the 'ref' object
remove(ref, callback)          -> Remove all documents matched by the 'ref' object
```


# What is Leaf ?

Think about Mongo (yes again...I love mongo, it just an example)

Think about Mongo as a big tree, like a Tree of knowledge (nice metaphore by the way)



Well leaf is just that, a leaf.


It works the same way as a big DBMS, but it's just small. small enough to be installed and managed easily, but powerful enough to still work nicely.


# How does it works ?


Leaf works with files. A collection of data is saved in a file, along with some other informations, like the Author, the collection's name, etc.


-> All the FileSystem mess that you don't like is already done.

-> All the redundant work doesn't exist anymore, because leaf includes functions, like a real database.


In simpler terms, when you want to access your data in the code, you simply have to do something like

```
collection.find( {'someKey': 'whatever'}, callback);
```

I told you there were database-like functions.

# What can it do


Well, it can do obvious things, like **Inserting, Updating, Removing** documents, 

and also **Find** one or many documents within a collection.


# Is it all there is to it ? (aka Future/TODO list)


That's basically it, for now.


I will continue to develop this project of course, by adding more advanced functions, refactoring the code, etc.

Any suggestion and/or contributions are accepted and very much welcomed


PS: While the front page is under development, you can find a test routine [**HERE**](https://github.com/NicolasThebaud/leafDB_test)
