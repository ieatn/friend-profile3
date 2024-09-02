from flask import Flask, request, jsonify
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

@app.route('/')
def hello_world():
    return "Hello, World!"

# READ: Get all profiles
@app.route('/profiles', methods=['GET'])
def get_all_profiles():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM friend_profiles")
        profiles = cursor.fetchall()

        return jsonify(profiles), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()


# CREATE: Insert a new profile
@app.route('/profiles', methods=['POST'])
def create_profile():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        profile_data = request.json.get('profile_data')

        cursor.execute(
            "INSERT INTO friend_profiles (profile_data) VALUES (%s)",
            (json.dumps(profile_data),)
        )
        conn.commit()

        return jsonify({'message': 'Profile created successfully!'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# READ: Get a profile by ID
@app.route('/profiles/<int:id>', methods=['GET'])
def get_profile(id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM friend_profiles WHERE id = %s", (id,))
        profile = cursor.fetchone()

        if profile:
            return jsonify(profile), 200
        else:
            return jsonify({'message': 'Profile not found!'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# UPDATE: Update a profile by ID
@app.route('/profiles/<int:id>', methods=['PUT'])
def update_profile(id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        profile_data = request.json.get('profile_data')

        cursor.execute(
            "UPDATE friend_profiles SET profile_data = %s WHERE id = %s",
            (json.dumps(profile_data), id)
        )
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Profile not found!'}), 404
        else:
            return jsonify({'message': 'Profile updated successfully!'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# DELETE: Delete a profile by ID
@app.route('/profiles/<int:id>', methods=['DELETE'])
def delete_profile(id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM friend_profiles WHERE id = %s", (id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Profile not found!'}), 404
        else:
            return jsonify({'message': 'Profile deleted successfully!'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
