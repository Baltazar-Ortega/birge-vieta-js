function birgeVieta(gradoPolinomio, coeficientes){
  function resultadoSuma(gradoPolinomio, r) {
    aux[0] = p[0]
    for (let i = 1; i <= gradoPolinomio; i++){
      aux[i] = (aux[i - 1] * r) + p[i]
    }
    return aux[gradoPolinomio]
  }
  let raices = []
  let aux = coeficientes.slice(0); // Copiar array
  let p = aux.slice(0)
  let bandera = 0
  let banderaNumReales = 0
  for(let k= 0; k < gradoPolinomio;k++){
    let x = obtenerValorInicial(coeficientes)
    let controlNumReales = 0
    do {
      controlNumReales++;
        let numeradorMasDerecha = resultadoSuma(gradoPolinomio - k, x)
        if(numeradorMasDerecha === 0 || parseFloat(numeradorMasDerecha.toFixed(3)) === 0){
            console.log("Ya es un numero muy pequeño")
            break
        }
        p = aux.slice(0)
        // Segunda etapa
        let denominadorMasDerecha = resultadoSuma(gradoPolinomio - 1 - k, x)
        let nuevaX = x - (numeradorMasDerecha/denominadorMasDerecha)
        if (Math.abs(nuevaX - x) <= 0.0009){
            bandera = 1
        }
        x = parseFloat(nuevaX.toFixed(4))
        p = coeficientes.slice(0)
        if(controlNumReales > 100){
          console.log("No se podrá resolver")
          banderaNumReales = 1
          bandera = 1
        }
    } while (bandera != 1)
    if (banderaNumReales === 0) {
      raices.push(x)
      coeficientes = aux.slice(0)
      coeficientes.pop() // Eliminar ultimo elemento (es un 0)
      aux = coeficientes.slice(0)
      p = coeficientes.slice(0)
      bandera = 0
    } else {break}
  }
  if (banderaNumReales === 0){
    return { raices, error: false }
  }else{
    return { error: true, mensajeError: "No se puede resolver con numeros reales. Para introducir otro ejemplo recargue la pagina." }
  }
}

function obtenerValorInicial(coeficientes){
  let xSubCero = coeficientes[coeficientes.length - 1]
  let xSubUno = coeficientes[coeficientes.length - 2]
  let aproximacion = -(xSubCero / xSubUno )
  return aproximacion
}

