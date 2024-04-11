//MUY PARECIDO LA ESTRUCTURA A LA DEL JUEGO DE LAS NAVES

//Objeto inicial
game = {
    canvas: null,
    ctx: null,
    caratula: true,
    x: 0,
    y: 0,
    imagen: null,
    radianes: null,
    teclaPulsada: null,
    tecla_array: new Array(),
    balas_array: new Array(),
    enemigos_array: new Array(),
    colorEnemigo: ["red", "blue", "black", "brown", "yellow", "pink", "purple"],
    colorBala: "blue",
    centroX: 0,
    centroY: 0,
    w:0,
    h: 0,
    puntos: 0,
    vidas: 3,
    endGame: false,
    balas:200,
}

sonidos = {
    inicio: null,
    juego: null,
    disparo: null,
    endGame:null,
}

const BARRA = 32;

function bala(x, y, radianes) {
    this.x = x;
    this.y = y;
    this.w = 5;
    this.velocidadDx = 8;
    this.radianes = radianes-45.6;//MUY IMPORTANTE PARA CUADRAR PERFECTAMENTE EL TIRO CON EL MOUSE
    this.dibujar = function () {
        game.ctx.save();
        game.ctx.fillStyle = game.colorBala;
        this.x += Math.cos(this.radianes) * this.velocidadDx;//Nos guarda en el this.X&Y la coordenada exacta de la bala;
        this.y += Math.sin(this.radianes) * this.velocidadDx;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);//Le pasamos la coordenada de la x, la de la y que hemos elaborado arriba;
                                                                 //Luego es ancho por alto;
        game.ctx.restore();
    }

}
function tanque(x, y, radio) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.escala = 0.3;
    this.rotacion = 45;//Para que se mueva 360;
    this.w = 0;
    this.h = 0;
    this.dibujar = function () {
        game.tanque_img.src = "recursos/imagenes/tanque.jpg";
        game.tanque_img.onload = function () {
                this.w = game.canvas.width;
                this.h = game.canvas.height;
                let ww = this.w / 10;//La medida del tanque que en este caso es la mitad
                let hh = this.h /10;//Igual que el alto de la imagen;
                game.ctx.drawImage(game.tanque_img, -15 + ww, -5 + hh,90,90);

             }
    }//HE TENIDO QUE TOCAR LAS MEDIDAS DEL TANQUE PARA QUE SE ADECUE A UN TAMAÑO PROPORCIONAL;

}
function enemigo(x, y) {//El enemigo siempre tenderá hacia el centro
    this.x = x;
    this.y = y;
    this.n = 0;
    this.inicioX = x;
    this.inicioY = y;
    this.estado = 1;
    this.r = 10;
    this.w = this.r * 2;
    this.vive = true;//Cuando el enemigo muera le ponemos false;
    this.VelocidadDx = 0.5 + Math.random();//cada enemigo tendrá una velocidad distinta dentro del canvas;
    this.color = game.colorEnemigo[Math.floor(Math.random() * game.colorEnemigo.length)];
    //De tal manera que los enemigos saldrán con los colores aleatorios establecidos arriba en el objeto, en vez de multiplicar>>
    //<< por un numero multiplicamos por el lnegth de los colores, que serán aleatorios aunque siempre dentro de los parámetros;
    this.dibujar = function () {
        if (this.n < 100 && this.vive) {
            game.ctx.save();
            game.ctx.beginPath();
            game.ctx.fillStyle = this.color;
            game.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);//El ultimo hace que sea una esfera por el Math.PI*2;
            game.ctx.fill();
            this.n += this.VelocidadDx;
            this.x = game.centroX * this.n / 100 +
            this.inicioX * (100 - this.n) / 100;
            this.y = game.centroY * this.n / 100 +
            this.inicioY * (100 - this.n) / 100;
            game.ctx.restore();
        }
    }
}

const caratula = () => {
    let imagen = new Image();
    imagen.src = "caratula.png";
    imagen.onload = () => {
        game.ctx.drawImage(imagen, 0, 0, 700, 500);

    }

}

const seleccionar = (e) => {//Seleccionar hace de cascada con inicio y a la vez con animar que tiene los métodos maestros;
    if (game.caratula) {
        inicio();
        sonidos.inicio.play();
    }
}

const inicio = () => {
    limpiarCanvas();
    game.caratula = false;
    sonidos.disparo.play();
    sonidos.juego.play();
    document.addEventListener("mousemove", function (e) {
        let { x, y } = ajustar(e.clientX, e.clientY);
        let velocidadDX = x - game.centroX;
        let velocidadDY = y - game.centroY;
        game.radianes = Math.atan2(velocidadDX, -velocidadDY);//TODO ESTO PARA HACER EL EFECTO DE QUE LA TORRETA SE MUEVA
        //ES MUY IMPORTANTE DEJAR LA VELOCIDADDY EN MENOS YA QUE SI NO PARA GUIAR AL TANQUE HAY QUE HACERLO DE FORMA INVERTIDA;
    });
    game.tanque.dibujar();
    setTimeout(lanzaEnemigo, 2000);
    animar();
}

const lanzaEnemigo = () => {//Cada vez que se lanze la f(x) se generarán nuevos y diferentes enemigos segun el Math.random;
    let lado = Math.floor(Math.random() * 4) + 1;
    let x, y;
    if (lado == 1) {//Posiciones en las que van a aparecer los enemigos los cuatro vertices del canvas;
        x = -10;
        y = Math.floor(Math.random() * game.h);//Valor al azar multiplicado por la altura;
    } else if (lado == 2) {
        x = Math.floor(Math.random() * game.w);//Valor al azar multiplicado por la anchura;
        y = -10;
    } else if (lado == 3) {
        x = game.w + Math.random() * 10;
        y = Math.floor(Math.random() * game.h);
    } else if (lado == 4) {
        x = Math.floor(Math.random() * game.w);
        y = game.h + Math.random() * 10;
    }
    game.enemigos_array.push(new enemigo(x, y));//Añadir distintos enemigos;
    setTimeout(lanzaEnemigo, 2000);//Establecemos un timeout por el que la f(x) se genere cada 2000 milisegundos;
}

const animar = () => {
    requestAnimationFrame(animar);
    verificar();
    pintar();
    colisiones();
}

const colisiones = () => {
    game.enemigos_array.map((enemigo, i) => {//Mapeamos el indice de los enemigos array, asi como las balas también para generar condicionales
        //>>de tal modo que si se cumplen los requisitos tanto de las balas como de los enemigos desaparecen con el null que podemos ver
        //>> debajo del 2º if;
        game.balas_array.map((bala, j) => {
            if (enemigo != null && bala != null) {
                if ((bala.x > enemigo.x) &&
                    (bala.x < enemigo.x + enemigo.w) &&
                    (bala.y > enemigo.y) &&
                    (bala.y < enemigo.y + enemigo.w)) {

                    game.enemigos_array[i] = null;//Se eliminan tantos las balas como los enemigos
                    game.balas_array[j] = null;
                    game.puntos += 10;
                }
            }
        });
        if (enemigo != null) {
            if (enemigo.n > 95) {
                game.enemigos_array[i] = null;//Cuando el enemigo nos choque va a desaparecer y nos restará vida;
                game.vidas--;
                sonidos.endGame.play();
                if (game.vidas <= 0) {
                    endGame();
                    alert("Acepta y juega de nuevo");
                    

                    
                }
            }
        }
    })
}

const endGame = () => {
    alert("Game Over, " + "obtuviste: " + game.puntos + " puntos "+"Click a aceptar para intentar de nuevo", 0, 300, "bold 40px times", "black")
    game.endGame = true;
    location.reload();
    sonido.endGame.play();
}

const verificar = () => {
    if (game.tecla_array[BARRA]) {
        if (game.balas > 0) {
            game.balas_array.push(
                new bala(
                    game.centroX + Math.cos(game.radianes) - 12 * 0,
                    game.centroY + Math.sin(game.radianes) - 0.3 * 10,//Los numeros -12&-0.3 corrigen la posicion de la bala;
                    game.radianes)
            )
        };
        
        //Añadiendo balas nuevas, con los parámetros previamente hablados, (x,y,radianes);
        game.balas--;
        game.tecla_array[BARRA] = false;//En python es True; T=Mayus;
        sonidos.disparo.play(); 
    }
}
const pintar = () => {
    //game.tanque.dibujar();//Es esencial dibujar el tanque aqui ya que está es la f(x) que enseñará todo el en canvas
    //mensaje(String(game.radianes), -20, 300);//Usamos el string ya que radianes estaba en una posicion numerica y necesitabamos
    //convertirlo a texto;
    limpiarCanvas(); //Otra forma de limpiar el canvas es mediante un clearRect
                       //game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    score();
    game.ctx.save();//De esta forma guardamos la nueva configuración;
    game.ctx.translate(game.centroX, game.centroY);//F(x) para fjiar en el centro de la X&Y como un compás y que el tanque pueda ir girando;
    game.ctx.scale(game.tanque.escala, game.tanque.escala);
    game.ctx.rotate(game.radianes);//Poduce ese efecto del tanque;
    game.ctx.drawImage(game.tanque_img, -game.tanque_img.width / 2, -game.tanque_img.height / 2);//Transladamos la iamgen que queremos que se meuva
    game.ctx.restore();
    for (let i = 0; i < game.balas_array.length; i++) {
        if (game.balas_array[i] != null) {//Si es diferente a null entonces hablamos de que tiene balas;
            game.balas_array[i].dibujar();//cada una de las balas que se encuentre en el array tendrá que ser dibujada
            if (game.balas_array[i].x < 0 ||//Realizamos este IF para que el caché se borre y por lo tanto pueda cargar más rápido;
                game.balas_array[i].x > game.w ||
                game.balas_array[i].y < 0||
                game.balas_array[i].y > game.h) {

                game.balas_array[i] = null;
            }
        }
    }
    game.enemigos_array.map((enemigo, i) => {//Recorrido del Array;
        if (enemigo != null) {//Identificamos si dentro del array hay enemigos;
            enemigo.dibujar();//Ya hemos creado una f(x) en enemigo, estamos invocando;
        }
    });//Es como si usamos un bucle for, equivalente;
}

const ajustar = (xx,yy) => {
    const pos = game.canvas.getBoundingClientRect();//Metodo asociado al canvas y lo guardamos en pos;
    const x = xx - pos.left;
    const y = yy - pos.top;
    return {x,y}//Cuando se retornan estas variables, se almacenan a la vez en las var(x,y) que hemos creado en la f(x) del "mousemove";
}


const mensaje = (cadena, x, y, fuente = "bold 20px Times", color = "black") => {
    let medio = (game.canvas.width - x) / 2;
    game.ctx.save();
    game.ctx.fillStyle = "black";
    game.ctx.strokeStyle = "black";
    game.ctx.textBaseline = "top";
    game.ctx.font = "bold 20px Times";
    game.ctx.textAlign = "center";
    game.ctx.clearRect(x, y, game.canvas.width, game.canvas.height);
    game.ctx.fillText(cadena, x + medio, y);
    game.ctx.restore();

}
const score = () => {//Marcador de las vidas;
            /*game.ctx.save();
            game.ctx.fillStyle = "black";
            game.ctx.clearRect(0, 0, game.canvas.width, 40);
            game.ctx.font = "bold 20px Verdana";
            game.ctx.fillText("Vidas:" + game.vidas + " Score: " + game.puntos+" Balas: "+game.balas, 10, 20);//10 y 20 es el tamaño de la letra de los puntos;
            game.ctx.restore();*/ 
    let m = "Vidas:" + game.vidas + " Score: " + game.puntos + " Balas: " + game.balas;
    mensaje(m, 0, 10, "bold 20px Verdana", "black");
}

//Listeners or events
        //Es esencial tener conocimientos de los movimientos del raton si quieremos disparar a los enemigos;
document.addEventListener("mousemove", function (e) {
    var { x, y } = ajustar(e.clientX, e.clientY);
    var velocidadDX = x - game.centroX;
    var velocidadDY = y - game.centroY;//Estos valores que hemos recogido en la parte superior, que se han almacenado en estas x,y;
            //Y que otorgan la velocidad de DX y DY y luego se pasa a los radianes;
    game.radianes = Math.atan2(velocidadDX, velocidadDY);//Math.atan2 es la tangente entre el punto x, las coordenadas dads
    //y devuelve los radianes que recorren desde -pi hasta +pi, lo que devuelve se almacena en game.radianes;
});

const limpiarCanvas = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

}

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 17); }
})();
document.addEventListener("keydown", function (e) {//Detectar el teclado, en este caso la barra espaciadora;
    game.teclaPulsada = e.keyCode;
    game.tecla_array[game.teclaPulsada] = true;//Cuando presionemos la barra se ejecuta el true que cambia a false una vez disparada
                                                    //la bala, y cuando volvamos a presionar la tecla se tornará de nuevo en true;CICLO;
});

window.onload = function() {
    game.canvas = document.getElementById("canvas");
    if (game.canvas && game.canvas.getContext) {
        game.ctx = game.canvas.getContext("2d");
        if (game.ctx) {
            caratula();
            game.canvas.addEventListener("click", seleccionar, false);
            sonidos.inicio = document.getElementById('inicio');
            sonidos.juego = document.getElementById('juego');
            sonidos.disparo = document.getElementById('disparo');
            sonidos.endGame = document.getElementById('endGame');
            game.w = game.canvas.width;
            game.h = game.canvas.height;
            game.centroX = game.w / 2;
            game.centroY = game.h / 2;
            game.tanque_img = new Image();
            game.tanque = new tanque(game.centroX, game.centroY,5,5);//le pasamos los parametros que hemos escrito en la f(x)

        } else {
            alert("NO funciona el desarrollo");
        };
    }
}