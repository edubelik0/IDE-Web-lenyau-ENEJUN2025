import re

def maquina_turing(cadena):
    # Si la cadena está vacía
    if not cadena:
        return "Error: Debes ingresar una cadena valida"
    
    # Verificar que solo contenga 1's y 0's usando expresión regular
    if not re.match('^[01]+$', cadena):
        return "Cadena no válida, solo se aceptan 1's y 0's"
    
    # Si llegamos aquí, la cadena solo contiene 1's y 0's
    return "Cadena aceptada"
