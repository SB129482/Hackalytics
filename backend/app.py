from flask import Flask, request
import librosa
import numpy as np
from keras.models import load_model

# from flask_cors import CORS, cross_origin

app = Flask(__name__)
# cors = CORS(app)
# app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/upload", methods=["POST"])
# @cross_origin()
def upload_blob():
    print("reached")
    if "file" not in request.files:
        return "No file part"

    print("reached2")
    file = request.files["file"]
    file.save("temp.wav")
    print("reached3")

    # Process the data
    y, sr = librosa.load("./test.wav")
    D = librosa.stft(y)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    X_new = S_db.flatten()

    # Load the saved model
    loaded_model = load_model("./model.h5")
    predictions = loaded_model.predict(X_new)

    # Set a threshold (you can experiment with different values)
    threshold = 0.0001

    # Convert probabilities to binary values based on the threshold
    binary_predictions = (predictions > threshold).astype(int)

    # Interpret the results
    categories = [
        "Unsure",
        "PoorAudioQuality",
        "Prolongation",
        "Block",
        "SoundRep",
        "WordRep",
        "DifficultToUnderstand",
        "Interjection",
        "NoStutteredWords",
        "NaturalPause",
        "Music",
        "NoSpeech",
    ]

    result_dict = dict(zip(categories, binary_predictions.flatten()))

    # Display the results
    res = ""
    for category, prediction in result_dict.items():
        print(f"{category}: {prediction}")
        res += f"{category}: {prediction}"

    return res


if __name__ == "__main__":
    app.run(debug=True, port=5002)
