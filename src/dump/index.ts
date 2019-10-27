import * as child from 'child_process'
// mongorestore --host hostname.com --port 27017 --username user --password pass mongodump/db/

const dump: child.ChildProcess = child.exec(
	'mongodump -h @ds147420.mlab.com:47420 -d chnirt-nest -c users -u admin -p chnirt1803 -o /backup/mongodump',
	() => {
		console.log('hihi')
	}
)
