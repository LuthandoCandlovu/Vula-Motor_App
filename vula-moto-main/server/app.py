import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
from api.app import app
from flask import jsonify, make_response
from api.blueprints import blueprint


class AppConfig:
    PORT = 3001
    DEBUG = True


app.register_blueprint(blueprint, url_prefix="/api/v1")


@app.route("/", methods=["GET"])
def meta():
    return make_response(
        jsonify(
            {
                "main": "Translation Server",
                "description": "This is a rest server that does machine translations.",
                "language": "python",
                "libraries": ["googletrans"],
            }
        )
    ), 200


if __name__ == "__main__":
    app.run(debug=AppConfig().DEBUG, port=AppConfig().PORT, host="0.0.0.0")
