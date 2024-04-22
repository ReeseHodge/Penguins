from flask import Flask, render_template
from flask_json import FlaskJSON

app = Flask(__name__,template_folder="templates",static_folder='static')

FlaskJSON(app)

@app.route('/') #endpoint
def site():
    return render_template("index.html")
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=53501)

