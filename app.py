
from huggingface_hub import hf_hub_download
from llama_cpp import Llama
from flask import Flask, request, jsonify

app = Flask(__name__)

print("Downloading/loading model...")

model_path = hf_hub_download(
    repo_id="Qwen/Qwen2.5-3B-Instruct-GGUF",
    filename="qwen2.5-3b-instruct-q4_k_m.gguf"
)

llm = Llama(
    model_path=model_path,
    n_ctx=2048,
    n_threads=4
)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "")

    output = llm(
        prompt,
        max_tokens=200,
        temperature=0.3
    )

    return jsonify({
        "response": output["choices"][0]["text"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
