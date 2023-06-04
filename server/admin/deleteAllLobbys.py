import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

db_adr = pymongo.MongoClient(os.getenv('MONGO_DB_ADRESS'))
db = db_adr["rapidtyper"]

db["lobbys"].delete_many({})

print("Successfully deleted all lobbys")
