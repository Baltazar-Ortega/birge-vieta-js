let latexString = "9x ^ { 3 } - 4 x ^ { 2 } + 3 x - 10 = 0"
let latexStringNoWhitespace = latexString.replace(/\s/g, "")
            console.log("latexString without whitespaces", latexStringNoWhitespace) // atexString without whitespaces 9x^{3}-4x^{2}+3x-10=0
let newlatex = latexStringNoWhitespace.replace(/(\^\{\d\})/g, "")
console.log(newlatex)  // 9x-4x+3x-10=0
if (newlatex[0].localeCompare("x") === 0){
	let coeficientes = newlatex.match(/([-]?\d)+/g)
    coeficientes.unshift("1")
    coeficientes.pop()
    console.log(coeficientes) // [ "1", "-4", "3", "-10" ]
}else {
	let coeficientes = newlatex.match(/([-]?\d)+/g)
    coeficientes.pop()
    console.log(coeficientes) // [ "9", "-4", "3", "-10" ]
}