import re

# Definición de tokens
TOKENS = {
    'VARIABLE': r'[a-zA-Z]+',
    'ASIGNACION': r'=',
    'DIGITO': r'[0-9]+',
    'OPERADOR': r'[+\-*/]',
    'FIN': r';'
}

def analizar_lexico(codigo):
    tokens = []
    lineas = codigo.split("\n")
    
    # Patrón que captura cada token individualmente
    patron = f"({TOKENS['VARIABLE']})|({TOKENS['DIGITO']})|({TOKENS['ASIGNACION']})|({TOKENS['OPERADOR']})|({TOKENS['FIN']})"
    
    for numero_linea, linea in enumerate(lineas, start=1):
        linea = linea.strip()
        if not linea:  # Ignorar líneas vacías
            continue
        
        resultados = []
        resultados.append(f"Línea {numero_linea}:")
        
        for match in re.finditer(patron, linea):
            token = match.group(0)
            if re.match(TOKENS['VARIABLE'], token):
                resultados.append(f"Variable: {token}")
            elif re.match(TOKENS['DIGITO'], token):
                resultados.append(f"Digito: {token}")
            elif token == '=':
                resultados.append(f"Asignación: {token}")
            elif re.match(TOKENS['OPERADOR'], token):
                resultados.append(f"Operador: {token}")
            elif token == ';':
                resultados.append(f"Fin: {token}")
        
        tokens.append('\n'.join(resultados))
    
    return '\n\n'.join(tokens)