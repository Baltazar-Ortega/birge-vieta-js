
var camera = document.getElementById('camera');
var frame = document.getElementById('frame');
var myinfo = document.getElementById('informacion');
var latex = document.getElementById('latex');
var tuPolinomioTitulo = document.getElementById('tu-polinomio-titulo')
var cargando = document.getElementById('cargando');
var error = document.getElementById('error')
var imagenesEjemplo = document.querySelectorAll('.img-ejemplo')

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
        
camera.addEventListener('change', async function(e) {
    cargando.style.display = 'block'
    var file = e.target.files[0]; 
    // Do something with the image file.
    frame.src = URL.createObjectURL(file);
    let resBase64 = await toBase64(file)
    imagenesEjemplo.forEach(function(el){
        el.removeEventListener('mouseover', estilizarBorde)
        el.removeEventListener('mouseleave', estilizarBorde)
    })
    latex.innerHTML = ""
    mathpix(resBase64)
});

function estilizarBorde(e){
    e.type === "mouseover" ? e.target.style.border = "3px dotted blue" : e.target.style.border = ""
}

function mandarAMathPix(e) {
    imagenesEjemplo.forEach(function(el){
        el.removeEventListener('mouseover', estilizarBorde)
        el.removeEventListener('mouseleave', estilizarBorde)
    })
    e.target.style.border = "3px solid green"
    
    let base64Img = ""
    camera.disabled = true
    if (e.srcElement.id === "ej-1"){
        console.log("Seleccionado ej-1")
        cargando.style.display = 'block'
        let base64Img = unoBase64
        
        mathpix(base64Img)
    } else if (e.srcElement.id === "ej-2"){
        console.log("Seleccionado ej-2")
        cargando.style.display = 'block'
        let base64Img = dosBase64

        mathpix(base64Img)
    } else if (e.srcElement.id === "ej-3") {
        console.log("Seleccionado ej-3")
        cargando.style.display = 'block'
        let base64Img = tresBase64

        mathpix(base64Img)
    }
}

imagenesEjemplo.forEach(function(el){
    el.addEventListener('click', mandarAMathPix)
    el.addEventListener('mouseover', estilizarBorde)
    el.addEventListener('mouseleave', estilizarBorde)
})


function mathpix(base64Img){
    imagenesEjemplo.forEach(function(el){
        el.removeEventListener('click', mandarAMathPix)
    })
    const uri = 'https://api.mathpix.com/v3/latex'
    axios({
            method: 'post',
            url: uri,
            data: {
                "src": base64Img,
            "ocr": ["math", "text"], 
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
    }).then(res => {

            console.log("Respuesta", res)
            cargando.style.display = 'none'
            let { data: { latex_simplified: latexString } } = res
            // Validar que sea de Birge Vieta
            console.log("latexString", latexString);
            let mensajeError = `
            <div class="error-contenedor">
            <p class="error">El input es incorrecto</p>
            <p>Debe insertar un polinomio adecuado</p>
            <p>Si quiere usar uno de los ejemplos, recargue la pagina</p>
            </div>
            `
            if (latexString === undefined){
                latex.innerHTML = mensajeError
                return
            }
            let latexStringNoWhitespace = latexString.replace(/\s/g, "")
            console.log("latexString without whitespaces", latexStringNoWhitespace)
            if (latexStringNoWhitespace.match(/^\W?\d*[x]/)) {
                console.log("Si hace match")
                scriptsMathJax(latexString)
                
            } else {
                latex.innerHTML = mensajeError
            }
            
           // Ejemplo: x ^ { 3 } - 4 x ^ { 2 } - 3 x - 10 = 0
        })
        .catch(err => {
            console.log('Ocurrio un error', err)
            error.innerHTML = `Ocurrio un error \n Descripcion: ${err} \n Se recargará la pagina`
        })
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