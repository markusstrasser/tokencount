from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pathlib import Path
import tiktoken
import os


template_dir = os.path.abspath("api/templates")

app = Flask(__name__, template_folder=Path(__file__).parent / 'templates', static_folder=Path(__file__).parent.parent / 'static')
app.config["TEMPLATES_AUTO_RELOAD"] = True

CORS(app)

encoding = tiktoken.get_encoding("cl100k_base")

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/count_tokens", methods=["POST"])
def count_tokens():
    text = request.form.get("text")
    if text is not None:
        tokens = encoding.encode(text)
        token_count = len(tokens)
        byte_strings = [encoding.decode_single_token_bytes(token) for token in tokens]
        token_strings = [x.decode('utf-8') for x in byte_strings]
        return jsonify({"token_count": token_count, "token_strings": token_strings})
    else:
        return jsonify({"error": "Invalid input"}), 400

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
