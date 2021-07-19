require ('dotenv').config()

const {leerInput,inquirerMenu,pausa, listadoLugares} = require('./helpers/inquirer');
require('colors');
const Busqueda = require('./models/busqueda')



const main = async ()=> {
    
    let opt;
    const busqueda = new Busqueda();


    do{
        opt = await inquirerMenu()

        switch(opt){
            case 1:
               const lugar = await leerInput('Ciudad');
               const lugares = await busqueda.cuidad(lugar);
               const id = await listadoLugares(lugares);

               if(id === '0')continue;

               const lugarSeleccionado = lugares.find( l => l.id ==id);
               busqueda.agregarHistorial(lugarSeleccionado.nombre);
               

               const clima = await busqueda.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
               
               //mostrar detalle
               console.log('\n Informacion de la cuidad'.blue);
               console.log('*****************************\n')

               console.log('Cuidad:', lugarSeleccionado.nombre);
               console.log('Lat:', lugarSeleccionado.lat);
               console.log('Log:', lugarSeleccionado.lng)
               console.log('Temperatura:', clima.temp.toFixed(1).yellow)
               console.log('Maxima:', clima.max.toFixed(1).yellow)
               console.log('Minima:',clima.min.toFixed(1).yellow)
               console.log('Descripcion:', clima.desc)

            break;
            case 2:
                busqueda.historial.forEach((lugar, i) => {
                    const idx =`${ i + 1}.`.blue;
                    console.log(`${idx} ${lugar}`)

                });

            break;
            case 0:

            break;
        }
        await pausa()
    }while(opt !==0);


}

main();

