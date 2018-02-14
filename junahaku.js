// sijoittaa suosikin hakuehtoihin, mutta ei toteuta hakua. Pitää painaa "Hae" erikseen.
function avaaSuosikki(){
    var splitattava = document.getElementById("suosikki").innerText;
    var splitattu = splitattava.split(" ");
    console.dir(splitattu);
    var lahtoAsemaSuosikki = splitattu[0];
    var paateAsemaSuosikki = splitattu[2];
    console.log(lahtoAsemaSuosikki);
    console.log(paateAsemaSuosikki);
    $('#lahto').val(lahtoAsemaSuosikki);
    $('#paate').val(paateAsemaSuosikki);
}

// kirjaa ulos käyttäjän, eli avaa uuden sivun ilman käyttäjätietoja html:ssä ja urlissa
function kirjauduUlos() {
    window.alert("Olet nyt kirjautunut ulos. Tervetuloa uudestaan!");
    open(url="index.html","_self");
}
//tähän rakennetaan toiminnallisuus, joka lisää käyttäjän suosikin muistiin
function lisaaSuosikki(){
    window.alert("Tallensit reitin");
    lahtoasema = document.getElementById("lahto").value;
    paateasema = document.getElementById("paate").value;
    document.getElementById("kayttajanNimi").innerHTML += "<h2 id=\"suosikki\" onclick=\"avaaSuosikki()\">" + lahtoasema + " - " + paateasema;
}

//Laskee etäisyyden kahden pisteen väliltä. Parametreina kahden pisteen
//latitude ja langitude. Käyttää apufunktiona muutaRadiaaniksi-funktiota.
//Palauttaa etäisyyden kilometreinä.
function laskeEtaisyys(lat1, lon1, lat2, lon2) {
    lat1 = muutaRadiaaniksi(lat1);
    lat2 = muutaRadiaaniksi(lat2);
    lon1 = muutaRadiaaniksi(lon1);
    lon2 = muutaRadiaaniksi(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
}

//tämä funktio muuttaa asteet radiaaneiksi
function muutaRadiaaniksi(deg) {
    return deg * Math.PI / 180;
}

window.onload = function () {

    //printtaa kirjautuneen nimimerkin sivulle ja luo kirjaudu ulos napin
    if (window.location.href.indexOf("#") !== -1){
        var kayttajanNimi = window.location.href.substring((window.location.href.indexOf("#")+1), window.location.href.length)
        console.log(kayttajanNimi);
        document.getElementById("kayttajanNimi").innerHTML = "<h1>" + "Kirjautuneena: " + kayttajanNimi + "<br>";
        document.getElementById("kayttajanNimi").innerHTML += "<input type=\"button\" value=\"Kirjaudu ulos\" onclick=\"kirjauduUlos()\">";
    }

    var asematUrl = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
    var asemat;
    var lahtoasema;
    var paateasema;

    //haetaan asema-data, suodatetaan pois ne asemat, jotka eivät ole matkustaja-asemia
    $.getJSON(asematUrl, function (jsondata) {
        asemat = jsondata;
        var matkustajaAsemat= $.grep(asemat,function (mat) {
            return (mat.passengerTraffic===true);
        })
        luoDropdownMenut(matkustajaAsemat);
    });

    //haetaan käyttäjän geolokaatio ja tallennetaan omaLat- ja omaLon-muuttujiin
    var omaLat;
    var omaLon;
    navigator.geolocation.getCurrentPosition(
        function (loc) {
            omaLat = loc.coords.latitude;
            omaLon = loc.coords.longitude;
        } ,
        function (errordata) {
            console.log('Virhe: ' + errordata.message);
        },
        { enableHighAccuracy: true }
    );

    //käydään läpi kaikki asemat ja etsitään lähin asema
    //esitellään muuttujat, etäisyyden alkuarvo = "ääretön"
    var lahinAsema;
    var etaisyys = Number.MAX_VALUE;

    //funktio käynnistyy napin painalluksella
    document.getElementById("haeAsema").onclick = function(){
        //testitapauksia
        //1: Kamppi
        // omaLat = 60.166296;
        // omaLon = 24.932770;
        //2: Seinäjoen maaseutu
        // omaLat = 62.553988;
        // omaLon = 23.004272;
        // //3: Lappi
        // omaLat = 67.456916;
        // omaLon = 27.656982;
        // //4: Pitäjänmäki
        // omaLat = 60.228396;
        // omaLon = 24.847777;

        //varmistetaan, millä tiedoilla haku tehdään
        console.log('Oma leveyspiiri: ' + omaLat);
        console.log('Oma pituuspiiri: ' + omaLon);

        //käydään läpi asemat ja haetaan pienintä etäisyyttä (linnuntietä)
        for(var i = 0; i < asemat.length; i++){
            var asemanLat = asemat[i].latitude;
            var asemanLon = asemat[i].longitude;
            //otetaan hakuun mukaan vain matkustajaliikenteelle sallitut asemat
            if(asemat[i].passengerTraffic && laskeEtaisyys(asemanLat, asemanLon, omaLat, omaLon) < etaisyys){
                etaisyys = laskeEtaisyys(asemanLat, asemanLon, omaLat, omaLon);
                lahinAsema = asemat[i];
            }
        }

        console.log(etaisyys);
        console.log(lahinAsema.stationName);

        //sijoitetaan alasvetovalikkoon lähin asema
        $('#lahto').val(lahinAsema.stationShortCode);
    }

    req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if(req.readyState === 4){
            if(req.status === 200){
                console.dir(asemat);
                var data = JSON.parse(req.responseText);
                console.dir(data);

                $('<p></p>', {
                    text: "Lähtöasema: " + palautaAsemanTiedot(lahtoasema).stationName
                }).appendTo('#lista');

                for(var i = 0; i < data.length; i++){
                    var juna = data[i];
                    var lahtoasemanIndeksi = palautaJunanTiedot(lahtoasema, juna.timeTableRows);
                    var paateasemanIndeksi = palautaJunanTiedot(paateasema, juna.timeTableRows);
                    var lahtoaika = new Date(juna.timeTableRows[lahtoasemanIndeksi].scheduledTime);
                    var saapumisaika = new Date(juna.timeTableRows[paateasemanIndeksi].scheduledTime);
                    var junanNimi = (juna.trainCategory==="Commuter")? (juna.commuterLineID+"-juna") : (juna.trainType+juna.trainNumber);
                    // var lahtopaikka = palautaAsemanTiedot(juna.timeTableRows[0].stationShortCode).stationName;
                    // var saapumispaikka = palautaAsemanTiedot(juna.timeTableRows[juna.timeTableRows.length-1].stationShortCode).stationName;

                    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};
                    //listataan junat
                    $('<p></p>', {
                        text: junanNimi + ", lähtee: "
                        + lahtoaika.toLocaleDateString("fi", optiot) + " saapuu (" + palautaAsemanTiedot(paateasema).stationName + "): "
                        + saapumisaika.toLocaleDateString("fi", optiot),
                        id: juna.trainNumber,
                    }).appendTo('#lista');


                    //listataan junan tarkemmat tiedot
                    for(var j = lahtoasemanIndeksi+1; j <= paateasemanIndeksi; j += 2){

                        if (juna.timeTableRows[j].trainStopping) {
                            var aika = new Date(juna.timeTableRows[j].scheduledTime);
                            var asemanNimi = palautaAsemanTiedot(juna.timeTableRows[j].stationShortCode).stationName;

                            $('<p></p>', {
                                text: asemanNimi + ", " + aika.toLocaleTimeString("fi", optiot) ,
                            }).appendTo('#' + juna.trainNumber).hide();
                        }
                    }
                    $("#"+juna.trainNumber).on('click', function () {
                        $(this).children().slideToggle();
                    });
                }
            } else {
                alert("Pyyntö epäonnistui");
            }
        }
    };

    //funktio joka palauttaa aseman koko nimen shortCoden perusteella
    function palautaAsemanTiedot(syote) {
        var a = $.grep(asemat, function (e) {
            return (e.stationShortCode === syote);
        });
        return a[0];
    }

    //funktio joka palauttaa haetun aseman indeksin junan tiedoista
    function palautaJunanTiedot(asemakoodi, data) {
        return data.findIndex(x => x.stationShortCode === asemakoodi);
    }


    // luodaan valittujen asemien väliset yhteydet listaksi
    document.getElementById("nappi").onclick = hae;
        function hae(){
        var ulos = document.getElementById("lista");
        ulos.innerHTML ='';
        lahtoasema = document.getElementById("lahto").value;
        paateasema = document.getElementById("paate").value;
        req.open('GET', 'https://rata.digitraffic.fi/api/v1/live-trains/station/' + lahtoasema + '/' + paateasema, true);
        req.send(null);
        // Onnistuneen haun jälkeen tsekataan onko käyttäjä kirjautunut. Jos on, luodaan nappi, jolla käyttäjä voi tallentaa hakutietonsa LocalStorageen tulevaisuutta ajatellen.
        if ((window.location.href.indexOf("#") !== -1)){
            document.getElementById("kayttajanNimi").innerHTML += "<input type=\"button\" value=\"Lisää reitti suosikkeihin\" onclick=\"lisaaSuosikki()\">";
        }
    };

    //funktio, joka luo dropdownmenut asema-json-datan perusteella
    function luoDropdownMenut(data){
        // luodaan lähtöasemien dynaaminen lista JSON:in avulla
        let dropdownlahto = $('#lahto');
        dropdownlahto.empty();
        dropdownlahto.append('<option selected="true" disabled>Valitse lähtöasema:</option>');
        dropdownlahto.prop('selectedIndex', 0);
        luoLahtoasemat(data);

// Populate dropdown with list of provinces
        function luoLahtoasemat(data) {
            $.each(data, function (key, entry) {
                dropdownlahto.append($('<option></option>').attr('value', entry.stationShortCode).text(entry.stationName));
            })
        };
        // luodaan pääteasemien dynaaminen lista JSON:in avulla
        let dropdownpaate = $('#paate');
        dropdownpaate.empty();
        dropdownpaate.append('<option selected="true" disabled>Valitse pääteasema:</option>');
        dropdownpaate.prop('selectedIndex', 0);
        luoPaateasemat(data);

        // Populate dropdown with list of provinces
        function luoPaateasemat(data) {
            $.each(data, function (key, entry) {
                dropdownpaate.append($('<option></option>').attr('value', entry.stationShortCode).text(entry.stationName));
            })
        };
    };
    // ei voi valita kahta samaa asemaa, pitää tehdä erillinen funktio tästä ja siirtää myös kutsu hakufunktion ekaksi riviksi
    $(document).ready(function() {
        $(".preferenceSelect").change(function() {
            // Get the selected value
            var selected = $("option:selected", $(this)).val();
            // Get the ID of this element
            var thisID = $(this).attr("id");
            // Reset so all values are showing:
            $(".preferenceSelect option").each(function() {
                $(this).prop("disabled", false);
            });
            $(".preferenceSelect").each(function() {
                if ($(this).attr("id") != thisID) {
                    $("option[value='" + selected + "']", $(this)).attr("disabled", true);
                }
            });
        });
    });
};