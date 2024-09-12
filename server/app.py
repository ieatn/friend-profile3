from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import pooling
import os
import json
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

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

# READ: Get a single profile by unique_id
@app.route('/profiles/<string:unique_id>', methods=['GET'])
def get_profile(unique_id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM friend_profiles WHERE unique_id = %s", (unique_id,))
        profile = cursor.fetchone()

        if profile:
            return jsonify(profile), 200
        else:
            return jsonify({'message': 'Profile not found'}), 404
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
        unique_id = request.json.get('unique_id')
        sql = "INSERT INTO friend_profiles (unique_id, profile_data) VALUES (%s, %s)"
        cursor.execute(sql, (unique_id, profile_data))

        conn.commit()

        return jsonify({'message': 'Profile created successfully!'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# UPDATE: Update a profile by unique_id
@app.route('/profiles/<string:unique_id>', methods=['PUT'])
def update_profile(unique_id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch the existing profile data
        cursor.execute("SELECT profile_data FROM friend_profiles WHERE unique_id = %s", (unique_id,))
        existing_profile = cursor.fetchone()

        if not existing_profile:
            return jsonify({'message': 'Profile not found!'}), 404

        new_profile_data = request.json.get('profile_data')

        # Compare the existing and new profile data
        if existing_profile['profile_data'] == new_profile_data:
            return jsonify({'message': 'No changes detected'}), 200

        # If there are changes, update the profile
        cursor.execute(
            "UPDATE friend_profiles SET profile_data = %s WHERE unique_id = %s",
            (new_profile_data, unique_id)
        )
        
        conn.commit()

        return jsonify({'message': 'Profile updated successfully!'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# DELETE: Delete a profile by unique_id
@app.route('/profiles/<string:unique_id>', methods=['DELETE'])
def delete_profile(unique_id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM friend_profiles WHERE unique_id = %s", (unique_id,))
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


@app.route('/profiles/search', methods=['GET'])
def search_profiles():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Get the search keywords from the query parameters, convert them to lowercase, and split into a list
        keywords = request.args.get('keyword', '').lower().split()

        # Construct the base SQL query
        sql = """
        SELECT unique_id, profile_data
        FROM friend_profiles
        WHERE """

        # Build the search conditions using OR to match any keyword
        conditions = []
        params = []
        for keyword in keywords:
            conditions.append("LOWER(profile_data) LIKE %s")
            params.append(f'%{keyword}%')

        # Join the conditions using OR to allow any matching keyword
        sql += " OR ".join(conditions)

        # Execute the query with the prepared parameters
        cursor.execute(sql, tuple(params))
        results = cursor.fetchall()

        # If results are found, return them as JSON
        if results:
            # Ensure profile_data is valid JSON before sending
            formatted_results = []
            for result in results:
                try:
                    profile_data = json.loads(result['profile_data'])
                    formatted_results.append({
                        'unique_id': result['unique_id'],
                        'profile_data': profile_data
                    })
                except json.JSONDecodeError:
                    app.logger.error(f"Invalid JSON in profile_data for unique_id {result['unique_id']}")
                    continue

            return jsonify(formatted_results), 200
        else:
            # Return a 404 if no matching profiles are found
            return jsonify({'message': 'No matching profiles found'}), 404
    except mysql.connector.Error as err:
        # Handle any SQL errors
        return jsonify({'error': str(err)}), 500
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

        
@app.route('/profiles/login', methods=['POST'])
def login():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        unique_id = request.json.get('unique_id')
        if not unique_id:
            return jsonify({'error': 'unique_id is required'}), 400

        # Check if the unique_id already exists
        cursor.execute("SELECT * FROM friend_profiles WHERE unique_id = %s", (unique_id,))
        existing_profile = cursor.fetchone()

        if existing_profile:
            return jsonify({'message': 'Profile already exists'}), 409

        # Insert new profile with empty profile_data
        cursor.execute(
            "INSERT INTO friend_profiles (unique_id, profile_data) VALUES (%s, %s)",
            (unique_id, json.dumps({}))
        )
        conn.commit()

        return jsonify({'message': 'Profile created successfully', 'unique_id': unique_id}), 201

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
