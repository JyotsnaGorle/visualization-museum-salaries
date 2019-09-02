import json
import csv
from flask import Flask, jsonify, Response, request
from datetime import datetime
import calendar
from flask_cors import CORS, cross_origin

from functools import wraps

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
        "Could not verify your access level for that URL.\n"
        "You have to login with proper credentials",
        401,
        {"WWW-Authenticate": 'Basic realm="Login Required"'},
    )

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# @cross_origin()
@app.route("/getData")
def get_temp():
    with open('roleCategory.json', encoding="utf8") as json_file:
        data = json_file.read()
    return Response(data, mimetype='application/json')

if __name__ == "__main__":
    app.run(host="0.0.0.0")
