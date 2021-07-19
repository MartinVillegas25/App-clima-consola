const fs = require('fs');
const axios = require('axios');


class Busqueda{
       
    historial = [];
    dbPath = './db/database.json'

    constructor(){
          this.leerDb();
    }

    
  
    async cuidad(lugar){    
        
        try {
                       
            const resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?access_token=${process.env.MAPBOX_KEY}&cachebuster=1626462005037&autocomplete=true&limit=5&language=es`);

            return resp.data.features.map( lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
        } catch (err) {
           console.error(err);
        }
      return []
    }

    async climaLugar ( lat, lon){
        try {
            const clima = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}`);

            const { weather, main} = clima.data;
            
            return {
                desc:weather[0].description,
                temp:main.temp - 273,
                max:main.temp_max - 273,
                min:main.temp_min - 273,
                
            };
               
            
        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial(lugar = ''){
        
        if ( this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.slice(0, 5);

        this.historial.unshift(lugar)

        this.guardarDb();
    }

    guardarDb(){
       const payload = {
           historial: this.historial
       }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    };


    leerDb(){

        if(!fs.existsSync(this.dbPath)){
          return null;
        }
        const hist = fs.readFileSync( this.dbPath, { encoding: 'utf8'});
        const data = JSON.parse(hist);

       this.historial = data.historial;

    }

}




module.exports = Busqueda;