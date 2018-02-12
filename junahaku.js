window.onload = function () {
    req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if(req.readyState === 4){
            if(req.status === 200){
                var data = JSON.parse(req.responseText);
                console.dir(data);
                var ulos = document.getElementById("lista");
                for(var i = 0; i < data.length; i++){
                    var juna = data[i];
                    var lahtoaika = new Date(juna.timeTableRows[0].scheduledTime);
                    var saapumisaika = new Date(juna.timeTableRows[juna.timeTableRows.length-1].scheduledTime);
                    var lahtopaikka = juna.timeTableRows[0].stationShortCode;
                    var saapumispaikka = juna.timeTableRows[juna.timeTableRows.length-1].stationShortCode;

                    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};
                    ulos.innerHTML += "<li>" + juna.trainCategory +
                        ": " + juna.trainType + juna.trainNumber + ", lähtee (" + lahtopaikka + "): "
                        + lahtoaika.toLocaleDateString("fi", optiot) + " saapuu (" + saapumispaikka + "): "
                        + saapumisaika.toLocaleDateString("fi", optiot) ;
                }
            } else {
                alert("Pyyntö epäonnistui");
            }
        }
    };

    document.getElementById("nappi").onclick = function(){
        req.open('GET', 'https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/SK', true);
        req.send(null);
    }

}