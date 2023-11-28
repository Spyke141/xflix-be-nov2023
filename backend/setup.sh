# Setup file to upload data to MongoDB 
mongo xflix --eval "db.dropDatabase()"
mongoimport -d xflix -c videos --file data/export_xflix_videos.json
# mongoimport --uri "mongodb://ac-9ahx1cz-shard-00-00.olsogtu.mongodb.net:27017,ac-9ahx1cz-shard-00-01.olsogtu.mongodb.net:27017,ac-9ahx1cz-shard-00-02.olsogtu.mongodb.net:27017/?replicaSet=atlas-9as7ye-shard-0" --ssl --authenticationDatabase admin --username spyketrash141 --password Linkspyke141 --drop --collection videos --jsonArray --file data/export_xflix_videos.json
