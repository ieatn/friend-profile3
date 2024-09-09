from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import pooling
import os
import json
from flask_cors import CORS
from dotenv import load_dotenv

# debugging
import requests
import logging
logging.basicConfig(level=logging.DEBUG)

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

# Initialize LangChain components
openai_api_key = os.getenv('OPENAI_API_KEY')

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
        sql = "INSERT INTO friend_profiles (profile_data) VALUES (%s)"
        cursor.execute(sql, (profile_data,))

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
            (profile_data, id)  # No need to use json.dumps here
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

# Add this new route for searching profiles
@app.route('/profiles/search', methods=['GET'])
def search_profiles():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        keyword = request.args.get('keyword', '').lower()
        
        sql = """
        SELECT id, profile_data
        FROM friend_profiles 
        WHERE LOWER(JSON_EXTRACT(profile_data, '$.personalInfo.name')) LIKE %s
        OR LOWER(JSON_EXTRACT(profile_data, '$.personalInfo.location')) LIKE %s
        """
        search_param = f'%{keyword}%'
        
        cursor.execute(sql, (search_param, search_param))
        result = cursor.fetchone()

        if result:
            return jsonify({'id': result['id'], 'profile_data': result['profile_data']}), 200
        else:
            return jsonify({'message': 'No matching profile found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/distance', methods=['GET'])
def get_distance():
    try:
        origins = request.args.get('origins')
        destinations = request.args.get('destinations')
        api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
        print(f"Google Maps API Key: {os.environ.get('GOOGLE_MAPS_API_KEY')}")
        
        if not api_key:
            app.logger.error("Google Maps API key is not set")
            return jsonify({"error": "API key is not configured"}), 500
        
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origins}&destinations={destinations}&key={api_key}"
        
        app.logger.debug(f"Requesting URL: {url}")
        
        response = requests.get(url)
        response.raise_for_status()  # This will raise an exception for HTTP errors
        
        data = response.json()
        app.logger.debug(f"Received data: {data}")
        
        return jsonify(data)
    except requests.RequestException as e:
        app.logger.error(f"Request to Google Maps API failed: {str(e)}")
        return jsonify({"error": "Failed to fetch data from Google Maps API"}), 500
    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
