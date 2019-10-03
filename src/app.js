// Elementos del DOM
var camera = document.getElementById('camera');
var frame = document.getElementById('frame');
var latex = document.getElementById('latex');
var tuPolinomioTitulo = document.getElementById('titulo-tu-polinomio')
var cargando = document.getElementById('cargando');
var error = document.getElementById('error')
var imagenesEjemplo = document.querySelectorAll('.img-ejemplo')
var raicesContainer = document.getElementById('raices')

// Convertir foto a base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Eventos        
camera.addEventListener('change', async function(e) {
    cargando.style.display = 'block'
    var file = e.target.files[0]; 
    frame.src = URL.createObjectURL(file);
    let resBase64 = await toBase64(file)
    imagenesEjemplo.forEach(function(el){
        el.removeEventListener('mouseover', estilizarBorde)
        el.removeEventListener('mouseleave', estilizarBorde)
    })
    latex.innerHTML = ""
    camera.disabled = true
    mathpix(resBase64)
});

imagenesEjemplo.forEach(function(el){
    el.addEventListener('click', mandarAMathPix)
    el.addEventListener('mouseover', estilizarBorde)
    el.addEventListener('mouseleave', estilizarBorde)
})

// Funciones principales
function mathpix(base64Img){
    imagenesEjemplo.forEach(function(el){
        el.removeEventListener('click', mandarAMathPix)
    })
    const uri = 'https://api.mathpix.com/v3/latex'
    axios({method: 'post', url: uri, data: {"src": base64Img, "ocr": ["math", "text"], 
            "skip_recrop": true,
            "formats": [
                "text",
                "latex_simplified",
                "latex_styled",
            ]
            },
            headers:{
                "content-type": "application/json",
                "app_id": "kalbertog121_gmail_com",
                "app_key": "c2aadddfff6ca123ba8f"
            }
    }).then(respuesta => {
        console.log(respuesta)
        cargando.style.display = 'none'
        let { data: { latex_simplified: latexString } } = respuesta 

        let mensajeError = `
            <div>
                <h3 class="error">El input es incorrecto</h3>
                <p>Debe insertar un polinomio adecuado</p>
                <p>Si quiere usar uno de los ejemplos, recargue la pagina</p>
            </div>
        `
        console.log(latexString) // ej. x ^ { 3 } - 4 x ^ { 2 } - 3 x - 10 = 0
        
        if (latexString === undefined) { // Se mandó una imagen que no es una ecuacion
            error.style.display = 'block'
            error.innerHTML = mensajeError
            return
        }
        let latexStringNoWhitespace = latexString.replace(/\s/g, "")
        if (formaCorrecta(latexStringNoWhitespace)) { // Determinar si la ecuacion tiene la forma correcta para el metodo
            mostrarResultados(latexString, latexStringNoWhitespace)
        } else {
            error.style.display = 'block'
            error.innerHTML = mensajeError
        }
    })
    .catch(error => {
        console.log('Ocurrio un error', error)
        error.innerHTML = `Ocurrio un error \n Descripcion: ${err} \n Se recargará la pagina`
    })
}

function mostrarResultados(latexString, latexStringNoWhitespace){
    scriptsMathJax(latexString) // Usar MathJax (ecuacion en estilo editorial)
                
    let datosLimpios = obtenerNumerosDeInput(latexStringNoWhitespace)
    let gradoPolinomio = datosLimpios.gradoPolinomio
    let coeficientes = datosLimpios.coeficientes
                
    // BIRGE VIETA
    // Obtener raices
    let respuesta = birgeVieta(gradoPolinomio, coeficientes)
    if (!respuesta.error) {
        let { raices } = respuesta
        // Mostrar raices
        raicesContainer.style.display = 'block'
        raices.forEach((el,index) => {
            raicesContainer.innerHTML += `
            <h4>Raiz ${index + 1}: <strong>${el}</strong></h4>
            `
        })
    } else {
        raicesContainer.style.display = 'block'
        raicesContainer.innerHTML = `
            <h4><strong style="color:red;">Error:</strong> ${respuesta.mensajeError}</h4>
        `
    }
}

// Funciones auxiliares
function formaCorrecta(latex) {
    let potenciasString = latex.match(/[x]\^{\d+}/g)
    if(potenciasString){
        let potencias = potenciasString.map(el => {
           el = el.slice(0, -1) 
           el = el.slice(3, el.length)
           el = parseFloat(el)
           return el
        })
        console.log("potencias", potencias)
         
        let mayor = 0
        potencias.forEach(num => {
            if (num > mayor){
                mayor = num
            }
        })
         if (mayor === potencias[0] && sonPotenciasConsecutivas(potencias)){
            return true
         } else if (mayor !== 0 || mayor === 0){
            return false
         }
    } else {
        return false
    }
    
}

function sonPotenciasConsecutivas(potencias){
    let bandera = 0
    let sigPotencia = potencias[0] - 1
      
    potencias.forEach(num => {
        if (Number(num - 1) === Number(sigPotencia)){
            sigPotencia--
        } else {
            bandera = 1
            return
        }
    })
    if (bandera === 0){
        return true
    }
    else {
        return false
    }
}

function estilizarBorde(e){
    e.type === "mouseover" ? e.target.style.border = "3px dotted blue" : e.target.style.border = ""
}

function mandarAMathPix(e) { // Mandar algun ejemplo a MathPix 
    imagenesEjemplo.forEach(function(el){
        el.removeEventListener('mouseover', estilizarBorde)
        el.removeEventListener('mouseleave', estilizarBorde)
    })
    e.target.style.border = "3px solid green"
    
    let base64Img = ""
    camera.disabled = true
    if (e.srcElement.id === "ej-1"){
        cargando.style.display = 'block'
        base64Img = unoBase64
        
    } else if (e.srcElement.id === "ej-2"){
        cargando.style.display = 'block'
        base64Img = dosBase64

    } else if (e.srcElement.id === "ej-3") {
        cargando.style.display = 'block'
        base64Img = tresBase64
    }
    mathpix(base64Img)
}

function obtenerGradoPolinomio(latexString){
    let potencias = latexString.match(/(\{\d+\})/g)
    let potenciaRealPaso1 = potencias[0].slice(1) // Quitar {
    let potenciaRealPasoFinal = potenciaRealPaso1.slice(0, potenciaRealPaso1.length - 1) // Quitar }
    return potenciaRealPasoFinal
}

function obtenerNumerosDeInput(latexStringNoWhitespace) { 
    // ej. 9x^{5}-4x^{2}+3x-10=0
    let gradoPolinomio = obtenerGradoPolinomio(latexStringNoWhitespace)

    let latexSoloConX = latexStringNoWhitespace.replace(/(\^\{\d\})/g, "") // ej. 9x-4x+3x-10=0
    let coeficientes = []
    let coeficientesFloat = []

    if (latexSoloConX[0].localeCompare("x") === 0){ // 0 significa que SI son iguales
        // En este caso la ecuacion comienza con x (coeficiente 1)
        let nuevoLatex = validarXCoeficienteUno(latexSoloConX)
        coeficientes = nuevoLatex.match(/([-]?\d+[.]?\d*)/g) // Obtener coeficientes (solo numeros)
        coeficientes.unshift("1")
        coeficientes.pop()
        console.log(coeficientes) // ej. [ "1", "-4", "3", "-10" ]
        coeficientesFloat = coeficientes.map(el => parseFloat(el))
    }else {
        console.log("NO comienza con x")
        let nuevoLatex = validarXCoeficienteUno(latexSoloConX)
        coeficientes = nuevoLatex.match(/([-]?\d+[.]?\d*)/g)
        coeficientes.pop()
        console.log(coeficientes) // ej. [ "9", "-4", "3", "-10" ]
        coeficientesFloat = coeficientes.map(el => parseFloat(el))
    }
    return { "gradoPolinomio": gradoPolinomio, "coeficientes": coeficientesFloat }
}

function validarXCoeficienteUno(latex){
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + 	str.substr(index+1);
    }
    let indicesConX = []
    for(let i = 0; i < latex.length; i++){
      if(i > 0){
        if((latex[i-1] === "+" || latex[i-1] === "-") && latex[i] === "x"){
        	indicesConX.push(i)
        }
      }
    }
    let copy = latex
    for (let i = 0; i < latex.length; i++){
      for(let j=0;j<indicesConX.length;j++){
      	if(i === indicesConX[j]){
        	copy = setCharAt(copy, i, "1")
        }
      }
    }
    return copy
}

function scriptsMathJax(latexString) {
    let script = document.createElement('script')
    script.type = "text/javascript"
    script.src = "https://polyfill.io/v3/polyfill.min.js?features=es6"
    script.setAttribute('id', 'scriptMathJax1')
    let script2 = document.createElement('script')
    script2.type = "text/javascript"
    script2.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
    script2.setAttribute('id', 'scriptMathJax2')
    document.getElementsByTagName('head')[0].appendChild(script);
    document.getElementsByTagName('head')[0].appendChild(script2);

    tuPolinomioTitulo.style.display = 'block'
    latex.innerText = "\\("  + latexString + "\\)" 

    script.parentNode.removeChild(script)
    script2.parentNode.removeChild(script2)
}
