from flask import Flask, render_template, request, jsonify
from lexer import analizar_lexico, TOKENS
from parser import analizar_sintaxis
from turing import maquina_turing

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/switch.html')
def switch():
    return render_template('switch.html')

@app.route('/analizar_lexico', methods=['POST'])
def lexico():
    codigo = request.json['codigo']
    resultado = analizar_lexico(codigo)
    return jsonify(resultado=resultado)

@app.route('/analizar_sintactico', methods=['POST'])
def sintactico():
    codigo = request.json['codigo']
    errores = analizar_sintaxis(codigo)
    return jsonify(resultado=errores)

@app.route('/simular_turing', methods=['POST'])
def turing():
    cadena = request.json['codigo']
    resultado = maquina_turing(cadena)
    return jsonify(resultado=resultado)

@app.route('/obtener_tokens', methods=['GET'])
def obtener_tokens():
    ejemplos = {
        'VARIABLE': 'nombre, edad, contador, x, y',
        'ASIGNACION': '=',
        'DIGITO': '0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
        'OPERADOR': '+, -, *, /',
        'FIN': ';'
    }
    return jsonify(tokens={token: ejemplos[token] for token in TOKENS})

if __name__ == '__main__':
    app.run(debug=True)