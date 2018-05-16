import flask
import argparse

app = flask.Flask(__name__)

@app.route('/games/<name>')
def platformer(name):
    return flask.render_template('page.html', dir='games', name=name, stylesheet='<link href=\"../static/css/games.css\" rel=\"stylesheet\" type=\"text/css\"/>')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--debug', help='Set the server into debug', action='store_true', dest='debug')
    parser.add_argument('-p', '--port', help='Set the port that the server runs on', type=int, default=5000, dest='port')
    args = parser.parse_args()
    app.run(**args.__dict__)