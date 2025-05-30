# Mini IDE Web - Analizador Léxico y Sintáctico

## Instrucciones de Ejecución

1. Asegúrate de tener Python instalado en tu sistema (versión 3.6 o superior)
2. Instala las dependencias necesarias:
   ```bash
   pip install flask
   ```
3. Ejecuta el servidor:
   ```bash
   python app.py
   ```
4. Abre tu navegador y accede a:
   ```
   http://localhost:5000
   ```

## Lenguaje Personalizado

### Tokens
- **VARIABLE**: Identificadores [a-zA-Z]+
- **ASIGNACION**: Símbolo =
- **DIGITO**: Números enteros [0-9]+
- **OPERADOR**: Operadores aritméticos [+\-*/]
- **FIN**: Punto y coma ;

### Gramática
```
expresion -> VARIABLE = termino
termino -> DIGITO (OPERADOR DIGITO)* ;
```

### Reglas Sintácticas
1. Toda expresión debe comenzar con una variable
2. Después de la variable debe venir un signo de igual (=)
3. Debe haber al menos un número después del igual
4. Pueden existir operaciones aritméticas después del primer número
5. Toda expresión debe terminar con punto y coma (;)

### Ejemplos

#### Expresiones Válidas
```
x = 5;
suma = 10 + 20;
resultado = 5 * 3 + 2;
valor = 100;
```

#### Expresiones Inválidas
```
5 = x;           // No puede comenzar con número
x + y;           // Falta el operador de asignación
x = ;            // Falta el valor
x = 5 + ;        // Operador sin segundo operando
x = 5            // Falta punto y coma
```

### Manejo de Errores
- Detección en tiempo real de errores sintácticos
- Subrayado ondulado rojo en las líneas con errores
- Panel de salida con descripción detallada de errores encontrados

## Información Académica

**Estudiante**
- Rivera Couoh Yael Eduardo

**Asignatura**
- Materia: Lenguajes y Autómatas I
- Profesor: I.S.C Kevin David Molina Gómez
- Semestre: 6to semextre

## Evidencias del sistema corriendo
- Analizador léxico

<img src="/static/img/analizador-lexico.png" width="800" height="400">

- Analizador Sintactico

<img src="/static/img/analizador-sintactico.png" width="800" height="400">

   - Analizador Sintactico resaltando un error

<img src="/static/img/analizador-sintactico-error.png" width="800" height="400">

- Maquina de Turing aceptando una cadena valida

<img src="/static/img/maquina-turing.png" width="800" heigth="400">

   - Maquina de Turing rechazando una cadena incorrecta
<img src="/static/img/maquina-turing-error.png" width="800" height="400">

   - Maquina de turing resaltando un error cuando no hay una cadena escrita
<img src="/static/img/maquina-turing-vacia.png" width="800" height="400">

## Características del IDE

- Análisis léxico y sintáctico en tiempo real
- Interfaz intuitiva y moderna
- Numeración de líneas automática
- Visualización de errores con subrayado ondulado
- Análisis de máquina de Turing integrado
- Reloj en tiempo real
- Diseño responsivo

## Tecnologías Utilizadas

- Python (Backend)
- Flask (Servidor Web)
- JavaScript (Frontend)
- HTML5 & CSS3 (Interfaz de usuario) 
