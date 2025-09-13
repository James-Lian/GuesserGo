# app.py
from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient
from bson.objectid import ObjectId
import io
import base64

app = Flask(__name__)

# --- MongoDB Atlas connection ---
mongo_uri = "mongodb+srv://darshg321:<db_password>@htn-scavenger.im7ke3.mongodb.net/?retryWrites=true&w=majority&appName=htn-scavenger"
client = MongoClient(mongo_uri)
db = client.get_database()
images_collection = db.images

# --- Upload PNG + GPS endpoint ---
@app.route("/upload", methods=["POST"])
def upload_image():
    data = request.json
    png_blob = data.get("pngBlob")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not png_blob or latitude is None or longitude is None:
        return jsonify({"error": "Missing required fields"}), 400

    # Convert base64 string to bytes
    image_bytes = base64.b64decode(png_blob)

    doc = {
        "data": image_bytes,
        "latitude": latitude,
        "longitude": longitude
    }

    result = images_collection.insert_one(doc)
    return jsonify({"message": "Image saved successfully", "id": str(result.inserted_id)}), 201

# --- Retrieve PNG + GPS endpoint ---
@app.route("/image/<id>", methods=["GET"])
def get_image(id):
    try:
        doc = images_collection.find_one({"_id": ObjectId(id)})
        if not doc:
            return jsonify({"error": "Image not found"}), 404

        return jsonify({
            "pngBlob": base64.b64encode(doc["data"]).decode("utf-8"),
            "latitude": doc["latitude"],
            "longitude": doc["longitude"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=4000)
