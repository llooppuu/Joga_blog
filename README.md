.env stuff
<pre>
MONGO_HOST=localhost
MONGO_PORT=27017 
MONGO_USER=admin 
MONGO_PASSWORD=qwerty 
MONGO_DATABASE=joga_blog
</pre>


<pre>
use joga_blog

db.createUser({
  user: "admin",
  pwd: "qwerty",
  roles: [{ role: "dbOwner", db: "joga_blog" }]
})
</pre>