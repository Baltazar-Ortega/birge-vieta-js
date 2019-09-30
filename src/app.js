
var camera = document.getElementById('camera');
var frame = document.getElementById('frame');
var myinfo = document.getElementById('informacion');
var latex = document.getElementById('latex');
var cargando = document.getElementById('cargando');
var imagenesEjemplo = document.querySelectorAll('.img-ejemplo')

console.log(imagenesEjemplo)

var ejemploSeleccionado = false

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
    console.log('file', file)
    myinfo.innerText = file.type
    let resBase64 = await toBase64(file)
    console.log(resBase64)
            
    mathpix(resBase64)
});

function estilizarBorde(e){
    e.type === "mouseover" ? e.target.style.border = "3px dotted blue" : e.target.style.border = ""
}

imagenesEjemplo.forEach(function(el){
    el.addEventListener('click', function(e){
        imagenesEjemplo.forEach(function(el){
            el.removeEventListener('mouseover', estilizarBorde)
            el.removeEventListener('mouseleave', estilizarBorde)
        })
        e.target.style.border = "3px solid green"
        // console.log(e.srcElement.id)
        let base64Img = ""
        if (e.srcElement.id === "ej-1"){
            let base64Img = unoBase64

        } else if (e.srcElement.id === "ej-2"){
            let base64Img = dosBase64
        }
        console.log(unoBase64)
        // mathpix(base64Img)
    })
    el.addEventListener('mouseover', estilizarBorde)
    el.addEventListener('mouseleave', estilizarBorde)
})


function mathpix(base64Img){
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
            latex.innerText = latexString
            
           // Ejemplo: x ^ { 3 } - 4 x ^ { 2 } - 3 x - 10 = 0
    })
    .catch(err => {
        console.log('Ocurrio un error', err)
    })
    }