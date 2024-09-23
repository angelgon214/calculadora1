import React, { useState } from "react";
import "../src/Calculadora.css";

const SistemaEcuaciones = () => {
  const [proceso, setProceso] = useState("");

  // Función para convertir fracciones o números decimales
  const convertirNumero = (numStr) => {
    if (numStr.includes("/")) {
      const [numerador, denominador] = numStr.split("/").map(Number);
      return numerador / denominador;
    } else {
      return parseFloat(numStr);
    }
  };

  // Redondear número a 6 decimales
  const redondear = (num, precision = 6) => {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  };

  // Redondear a entero si está cerca de un valor entero
  const redondearCercanoEntero = (num, tolerancia = 0.000001) => {
    if (Math.abs(num - Math.round(num)) < tolerancia) {
      return Math.round(num);
    }
    return redondear(num);
  };

  // Función para analizar ecuaciones
  const parseEcuacion = (ecuacion) => {
    const regex = /([+-]?\d*\.?\d*\/?\d*)\s*x\s*([+-]?\s*\d*\.?\d*\/?\d*)\s*y\s*=\s*([+-]?\d*\.?\d*\/?\d*)/i;
    const match = ecuacion.match(regex);

    if (match) {
      const a = convertirNumero(match[1] === "" || match[1] === "+" ? "1" : match[1] === "-" ? "-1" : match[1]);
      const b = convertirNumero(match[2].replace(/\s/g, "") === "" || match[2].replace(/\s/g, "") === "+" ? "1" : match[2].replace(/\s/g, "") === "-" ? "-1" : match[2].replace(/\s/g, ""));
      const c = convertirNumero(match[3]);

      return { a, b, c };
    } else {
      throw new Error("Asegúrate de que la ecuación esté en el formato ax + by = c.");
    }
  };

  // Función para calcular la solución
  const calcularSolucion = () => {
    try {
      const ecuacion1 = document.getElementById("ecuacion1").value;
      const ecuacion2 = document.getElementById("ecuacion2").value;

      const { a: a1, b: b1, c: c1 } = parseEcuacion(ecuacion1);
      const { a: a2, b: b2, c: c2 } = parseEcuacion(ecuacion2);

      // Cálculo del determinante
      const determinante = a1 * b2 - a2 * b1;
      const determinanteX = c1 * b2 - c2 * b1;
      const determinanteY = a1 * c2 - a2 * c1;

      let explicacion = "<h3>Paso 1: Calculamos el determinante (D)</h3>";
      explicacion += `<p>${ecuacion1}</p>`;
      explicacion += `<p>${ecuacion2}</p>`;
      explicacion += `<p>D = (a1)(b2) - (a2)(b1) = (${a1})(${b2}) - (${a2})(${b1}) = ${determinante}</p>`;

      if (determinante !== 0) {
        explicacion += "<h3>Paso 2: Calculamos Dx y Dy</h3>";
        explicacion += `<p>Dx = (c1)(b2) - (c2)(b1) = (${c1})(${b2}) - (${c2})(${b1}) = ${determinanteX}</p>`;
        explicacion += `<p>Dy = (a1)(c2) - (a2)(c1) = (${a1})(${c2}) - (${a2})(${c1}) = ${determinanteY}</p>`;

        explicacion += "<h3>Paso 3: Calculamos las soluciones de x y y</h3>";
        const x = redondearCercanoEntero(determinanteX / determinante);
        const y = redondearCercanoEntero(determinanteY / determinante);
        explicacion += `<p>x = Dx / D = ${determinanteX} / ${determinante} = ${x}</p>`;
        explicacion += `<p>y = Dy / D = ${determinanteY} / ${determinante} = ${y}</p>`;

        explicacion += "<h3>Paso 4: Comprobación de la solución</h3>";
        const comprobarEcuacion1 = redondearCercanoEntero(a1 * x + b1 * y);
        const comprobarEcuacion2 = redondearCercanoEntero(a2 * x + b2 * y);
        explicacion += `<p>Ecuación 1:(${a1})(${x}) + (${b1})(${y}) = ${c1})</p>`;
        explicacion += `<p>Ecuación 2:(${a2})(${x}) + (${b2})(${y}) = ${c2})</p>`;

        if (Math.abs(comprobarEcuacion1 - c1) < 0.0001 && Math.abs(comprobarEcuacion2 - c2) < 0.0001) {
          explicacion += `<p><strong>La solución es correcta.</strong></p>`;
        } else {
          explicacion += `<p><strong>Error: La solución no satisface una o ambas ecuaciones.</strong></p>`;
        }
      } else {
        if (determinanteX === 0 && determinanteY === 0) {
          explicacion += `<p><strong>El sistema tiene infinitas soluciones (es dependiente).</strong></p>`;
        } else {
          explicacion += `<p><strong>El sistema no tiene solución (es inconsistente).</strong></p>`;
        }
      }

      setProceso(explicacion);
    } catch (error) {
      setProceso(error.message);
    }
  };

  return (
    <div className="calculadora-container">
      <div className="input-column">
        <h2>Calculadora 1 Determinantes</h2>

        <div style={{ textAlign: "center" }}>
          <h4>Jose Angel Gonzalez Santafe</h4>
        </div>

        <div className="input-group">
          <label>Ecuación 1:</label>
          <input
            type="text"
            id="ecuacion1"
            className="input-field"
            placeholder="Ejemplo: 2x + 3y = 5 o 1/2x + 3y = 5"
          />
        </div>
        <div className="input-group">
          <label>Ecuación 2:</label>
          <input
            type="text"
            id="ecuacion2"
            className="input-field"
            placeholder="Ejemplo: 4x - y = 7 o 2/3x + y = 8"
          />
        </div>
        <button className="calculate-button" onClick={calcularSolucion}>
          RESULTADO
        </button>
      </div>

      <div className="result-column">
        <h3>Resultado</h3>
        <div id="resultado" className="resultado-box" dangerouslySetInnerHTML={{ __html: proceso }}></div>
      </div>
    </div>
  );
};

export default SistemaEcuaciones;
