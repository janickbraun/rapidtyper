import pymongo
import os
from dotenv import load_dotenv
import json

load_dotenv()

db_adr = pymongo.MongoClient(os.getenv('MONGO_DB_ADRESS'))
db = db_adr["rapidtyper"]

col = db["texts"]

with open('quotes.json', encoding="utf8") as json_file:
    data = json.load(json_file)
    for quote in data['quotes']:
        text = quote["text"]
        author = quote["author"]
        col.insert_one({"text": text, "author": author})
