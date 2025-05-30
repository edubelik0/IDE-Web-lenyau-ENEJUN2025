import re

def analizar_sintaxis(codigo):
    errores = []
    lineas = codigo.split("\n")
    
    for i, linea in enumerate(lineas, 1):
        linea = linea.strip()
        if linea == "":
            continue
            
        # Analizar cada parte de la línea
        tokens = re.findall(r'[a-zA-Z]+|\d+|[+\-*/=;]|\S+', linea)
        error_pos = None
        error_length = 0
        
        # Estado del análisis
        estado = 0  # 0: espera variable, 1: espera =, 2: espera número, 3: espera operador o ;
        pos_actual = 0
        
        for token in tokens:
            if error_pos is not None:
                break
                
            pos_actual = linea.find(token, pos_actual)
            
            if estado == 0:  # Espera variable
                if not re.match(r'^[a-zA-Z]+$', token):
                    error_pos = pos_actual
                    error_length = len(token)
                    break
                estado = 1
            elif estado == 1:  # Espera =
                if token != '=':
                    error_pos = pos_actual
                    error_length = len(token)
                    break
                estado = 2
            elif estado == 2:  # Espera número
                if not re.match(r'^\d+$', token):
                    error_pos = pos_actual
                    error_length = len(token)
                    break
                estado = 3
            elif estado == 3:  # Espera operador o ;
                if token == ';':
                    estado = 4  # Final
                    break
                elif not re.match(r'^[+\-*/]$', token):
                    error_pos = pos_actual
                    error_length = len(token)
                    break
                estado = 2
            
            pos_actual += len(token)
        
        if error_pos is not None:
            errores.append({
                "linea": i,
                "error": f"Error de sintaxis en la línea {i}",
                "contenido": linea,
                "error_pos": error_pos,
                "error_length": error_length
            })
        elif estado != 4:
            errores.append({
                "linea": i,
                "error": f"Error de sintaxis en la línea {i}: expresión incompleta",
                "contenido": linea,
                "error_pos": len(linea),
                "error_length": 1
            })
            
    return errores