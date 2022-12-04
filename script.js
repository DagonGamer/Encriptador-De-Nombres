let Caracteres = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "#",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "+",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "$", "%", "?", "¿", "=", "(", ")", "&", "€", "¡", "<", ">", ":", "-", "_", "*", "/",
    "|", ":", ";", ",", ".", "ç"
];

// El espacio se traducirá a #
// Comprime 4 caracteres del nombre (solo primera fila) por 3 caracteres del codigo

let KeyInput = document.querySelector("input.Key");
let NombreInput = document.querySelector("input.Nombre");
let CodigoInput = document.querySelector("input.Codigo");

let pEncriptado = document.querySelector("p.Encriptado");
let pDesencriptado = document.querySelector("p.Desencriptado");

let Random = (PrimNum = 0) => {

    let num = PrimNum;

    num *= 102;
    num += 54;
    num /= 503;
    num *= 786 + PrimNum;
    num /= 435;
    num = num % 1;
    num *= 2;
    num = num % 1;

    return num;

}

let CreateCharacterArray = (num = 0) => {

    let BufferArr = [...Caracteres];
    let RandomNumber = Random(num);
    let arr = [];

    for (let i = Caracteres.length; i > 0; i--) {

        let idx = Math.floor(RandomNumber * i);
        arr.push(...BufferArr.splice(idx, 1));
        RandomNumber = Random(RandomNumber);

    }

    return arr;

}

let Codificar = () => {

    let Key = KeyInput.value;
    let Nombre = NombreInput.value.replaceAll(" ", "#");

    let NumberKey = Array.from(Key)
                            .map(el => Caracteres.indexOf(el))
                            .reduce((GlobVal, el, idx) => GlobVal + el * Math.pow(Caracteres.length, idx), 0);

    let CarArr = CreateCharacterArray(NumberKey);
    
    let newName = [];
    for (let o = 0; o < Nombre.length; o++) {

        newName[o] = CarArr[ ( Caracteres.indexOf(Nombre[o]) + NumberKey + Math.ceil( o * Random( o + NumberKey ) ) ) % Caracteres.length ]

    }

    newName[Nombre.length] = Array.from(Key)
                                    .map( el => Caracteres[ (Caracteres.indexOf(el) + 12) % Caracteres.length ] )
                                    .join("");

    pEncriptado.innerText = newName.join("");

}

let Descodificar = () => {

    let Codigo = CodigoInput.value;
    let KeyEncriptada = Array.from(Codigo).slice(-2).join("");
    let Nombre = Array.from(Codigo).slice(0, -2).join("");

    let NumberKey = Array.from(KeyEncriptada)
                            .map( el => ( Caracteres.indexOf(el) - 12 ) < 0 ?
                                    Caracteres.indexOf(el) - 12 + Caracteres.length :
                                    Caracteres.indexOf(el) - 12 )
                            .reduce((GlobVal, el, idx) => GlobVal + el * Math.pow(Caracteres.length, idx), 0);

    let CarArr = CreateCharacterArray(NumberKey);
    
    let newName = [];
    for (let o = 0; o < Nombre.length; o++) {

        let idx = ( CarArr.indexOf(Nombre[o]) - NumberKey - Math.ceil( o * Random( o + NumberKey ) ) ) % Caracteres.length;
        while ( idx < 0 ) idx += Caracteres.length;

        newName[o] = Caracteres[ idx ];

    }

    pDesencriptado.innerText = newName.join("").replaceAll("#", " ");

}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./ServiceWorker.js");
}