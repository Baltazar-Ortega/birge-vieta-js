let gradoPolinomio = 3
// let coeficientes = [1, -11, 32, -22]
let coeficientes = [1, -0.5, -8, 7.5]
let raices = []
let aux = coeficientes.slice(0); // Copiar array
let p = aux.slice(0)
let bandera = 0

function obtenerValorInicial(coeficientes){
  let xSubCero = coeficientes[coeficientes.length - 1]
  let xSubUno = coeficientes[coeficientes.length - 2]
  let aproximacion = -(xSubCero / xSubUno )
  return aproximacion
}

function resultadoSuma(gradoPolinomio, r){
  // console.log("gradoPolinomio: ", gradoPolinomio)
  aux[0] = p[0]
  for (let i = 1; i <= gradoPolinomio; i++){
  	aux[i] = (aux[i - 1] * r) + p[i]
  }
  return aux[gradoPolinomio]
}


for(let k= 0; k < gradoPolinomio;k++){
    let x = obtenerValorInicial(coeficientes)
    console.log("Valor inicial", x)
    do{
        let numeradorMasDerecha = resultadoSuma(gradoPolinomio - k, x)
        if(numeradorMasDerecha === 0 || parseFloat(numeradorMasDerecha.toFixed(3)) === 0){
            console.log("Ya es un numero muy pequeño")
            break
        }
        console.log("numerador mas derecha", numeradorMasDerecha)
        p = aux.slice(0)
        // Segunda etapa
        let denominadorMasDerecha = resultadoSuma(gradoPolinomio - 1 - k, x)
        console.log("denominador mas a la derecha", denominadorMasDerecha)
        let nuevaX = x - (numeradorMasDerecha/denominadorMasDerecha)
        // console.log(Math.abs(nuevaX - x))
        if (Math.abs(nuevaX - x) <= 0.0009){
            bandera = 1
        }
        x = parseFloat(nuevaX.toFixed(4))
        p = coeficientes.slice(0)
        console.log("nueva x", x)
        console.log("Comienza sig. iteracion \n\n")
    } while (bandera != 1)
  console.log("raiz ", (k+1), " ", x)
  raices.push(x)
  coeficientes = aux.slice(0)
  coeficientes.pop() // Eliminar ultimo elemento (es un 0)
  aux = coeficientes.slice(0)
  console.log("aux", aux)
  console.log("nuevos coeficientes", coeficientes)
  p = coeficientes.slice(0)
  bandera = 0
}

console.log("\n\n Raices: ", raices)
