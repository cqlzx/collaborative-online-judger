import json
from flask import Flask
from flask import jsonify
from flask import request
import executor_service

app = Flask(__name__)

@app.route('/')
def hello():
    return 'hello world'

@app.route('/codes', methods=['POST'])
def build_and_run():
    data = json.loads(request.data)

    if 'language' not in data or 'code' not in data:
        return 'Language and code need to be provided!'

    language = data['language']
    code = data['code']

    print 'language and code got. Language: %s, Code: %s' % (language, code)

    result = executor_service.build_and_run(language, code)

    return jsonify(result)



if __name__ == '__main__':
    executor_service.load_image()
    app.run(debug = True)