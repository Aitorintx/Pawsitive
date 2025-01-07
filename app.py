from flask import Flask, render_template, request, jsonify
app = Flask(__name__)



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

@app.route('/pantallaInicio')
def pantallaInicio():
    return render_template('pantallaInicio.html')

@app.route('/calendario')
def calendario():
    return render_template('calendario.html')

@app.route('/mascota')
def mascota():
    return render_template('mascota.html')

if __name__ == '__main__':
    app.run(debug=True)
