from flask import Flask, request, jsonify, Response
import mysql.connector
from mysql.connector import pooling
import os
import json
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

db_host = os.getenv('DB_HOST')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_database = os.getenv('DB_DATABASE')

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    user=db_user,
    password=db_password,
    host=db_host,
    database=db_database
)

try:
    conn = mysql.connector.connect(
        user=db_user,
        password=db_password,
        host=db_host,
        database=db_database
    )
    print("Connection successful!")
except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    if conn.is_connected():
        conn.close()

@app.route('/')
def hello_world():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)
