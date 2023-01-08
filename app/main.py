from os import path, walk

from flask import Flask, render_template, send_from_directory
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/<file>')
def other_page(file):
    return render_template(file)


@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)


@app.route("/.well-known/<path:path>")
def ssl_validation(path):
    return send_from_directory(".well-known", path)


if __name__ == "__main__":
    # Hot reloading for when static files change
    extra_dirs = ['static/css', 'static/components', 'static/data', 'static/doc',
                  'static/img', 'static/js', 'templates', '.well-known/pki-validation']
    extra_files = extra_dirs[:]
    for extra_dir in extra_dirs:
        for dirname, dirs, files in walk(extra_dir):
            for filename in files:
                filename = path.join(dirname, filename)
                if path.isfile(filename):
                    extra_files.append(filename)

    app.run(extra_files=extra_files, host='0.0.0.0')
