# Setup file to upload data to MongoDB 
mongo xflix --eval "db.dropDatabase()"
mongoimport -d xflix -c videos --file data/export_xflix_videos.json