//Esitellään globaaleja muuttujia

req = new XMLHttpRequest();
var asematUrl = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
var asemat;
var lahtoasema;
var paateasema;
var paivamaara;

/**
 * Funktio avaa rest -yhteyden käyttäjän antamien tietojen perusteella ja luo kirjautuneelle suosikkinappulan.
 */
function hae(){
    document.getElementById("lista").innerHTML ='';
    lahtoasema = document.getElementById("lahto").value;
    paateasema = document.getElementById("paate").value;
    paivamaara = document.getElementById("pvm").value;

    var pvm2 = new Date(paivamaara);
    pvm2= pvm2.toISOString();

    req.open('GET', 'https://rata.digitraffic.fi/api/v1/live-trains/station/' + lahtoasema + '/' + paateasema + '?startDate=' + pvm2 + '&limit=15', true);
    req.send(null);
    // Onnistuneen haun jälkeen tsekataan onko käyttäjä kirjautunut. Jos on, luodaan nappi, jolla käyttäjä voi tallentaa hakutietonsa LocalStorageen tulevaisuutta ajatellen.
    if ((window.location.href.indexOf("#") !== -1)){
        document.getElementById("faviNappi").innerHTML = "<button class=\"btn btn-block\" id=\"favnappi\" onclick=\"lisaaSuosikki()\">Lisää reitti suosikkeihin</button>";
    }
}

/**
 * Sijoittaa suosikin hakuehtoihin ja toteuttaa haun.
 */
function avaaSuosikki(){
    var kayttajanNimi = window.location.href.substring((window.location.href.indexOf("#")+1), window.location.href.length);
    var splitattava= localStorage.getItem(kayttajanNimi)
    var splitattu = splitattava.split(" ");
    console.dir(splitattu);
    var lahtoAsemaSuosikki = splitattu[0];
    var paateAsemaSuosikki = splitattu[2];
    console.log(lahtoAsemaSuosikki);
    console.log(paateAsemaSuosikki);
    $('#lahto').val(lahtoAsemaSuosikki);
    $('#paate').val(paateAsemaSuosikki);
    hae();
}

/**
 * Kirjaa ulos käyttäjän.
 */
function kirjauduUlos() {
    window.alert("Olet nyt kirjautunut ulos. Tervetuloa uudestaan!");
    open(url="index.html","_self");
}

/**
 * Tallentaa haetun reitin suosikiksi.
 */
function lisaaSuosikki(){
    window.alert("Tallensit reitin");
    lahtoasema = document.getElementById("lahto").value;
    paateasema = document.getElementById("paate").value;
    document.getElementById("suosikkiReitti").innerHTML = "<button class=\"btn btn-block\" id=\"suosikki\" onclick=\"avaaSuosikki()\">Hae suosikkireittiä: " + lahtoasema + " - " + paateasema+"</button>";
    var kayttajanNimi = window.location.href.substring((window.location.href.indexOf("#")+1), window.location.href.length);
    localStorage.setItem(kayttajanNimi,lahtoasema + " - " + paateasema);
}

/**
 * Laskee etäisyyden kahden pisteen väliltä. Parametreina kahden pisteen latitude ja longitude. Käyttää apufunktiona muutaRadiaaniksi-funktiota. Palauttaa etäisyyden kilometreinä.
 */
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

/**
 * Tämä funktio muuttaa asteet radiaaneiksi.
 */
function muutaRadiaaniksi(deg) {
    return deg * Math.PI / 180;
}

//Luodaan "top" -nappi, joka palauttaa käyttäjän sivun alkuun.
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


window.onload = function () {

    // Asettaa päivämäärän valinta -kenttään default-arvoksi tämän päivän
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if(hours < 10) hours = "0" + hours;
    if(minutes < 10) minutes = "0" + minutes;
    var today = year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
    $('#pvm').attr('value', today);

    // TÄSSÄ PIILOTETAAN SISÄÄNKIRJAUTUMISPALKKI JOS KIRJAUTUNUT JO SISÄÄN JA NÄKYVILLÄ KIRJAUDU ULOS PALKKI, JOS EI KIRJAUTUNUT VAIN TÄMÄ NÄKYVILLÄ
    if ((window.location.href.indexOf("#") !== -1)){
        document.getElementById("piilotettava").style.display = "none";
    } else {
        document.getElementById("piilotettava").style.display = "block";
    }

    // Printtaa kirjautuneen nimimerkin sivulle, luo kirjaudu ulos napin ja luo uuden localstoragen käyttäjälle, jos ei jo olemassa.
    if (window.location.href.indexOf("#") !== -1){
        var kayttajanNimi = window.location.href.substring((window.location.href.indexOf("#")+1), window.location.href.length);
        console.log(kayttajanNimi);
        document.getElementById("kirjauduUlosPiilotettava").innerHTML = "Käyttäjä: " + kayttajanNimi + "<br>";
        document.getElementById("kirjauduUlosPiilotettava").innerHTML += "<input style=\"margin-top: 5px\" class=\"btn btn-xs\" type=\"button\" value=\"Kirjaudu ulos\" onclick=\"kirjauduUlos()\">";
        if (localStorage.getItem(kayttajanNimi) === null){
            localStorage.setItem(kayttajanNimi, '');
        } else {
            console.log(localStorage.getItem(kayttajanNimi));
            document.getElementById("suosikkiReitti").innerHTML = "<button id=\"suosikki\" class='btn btn-block' onclick=\"avaaSuosikki()\">Hae suosikkireittiä: " + localStorage.getItem(kayttajanNimi)+"</button>";
        }
    }

    // TÄSSÄ PIILOTETAAN KIRJAUDU ULOS PAINIKE JOS EI KIRJAUTUNUT SISÄÄN, JOS KIRJAUTUNUT NIIN VAIN TÄMÄ NÄKYVILLÄ!
    if ((window.location.href.indexOf("#") !== -1)){
        document.getElementById("kirjauduUlosPiilotettava").style.display = "block";
    } else {
        document.getElementById("kirjauduUlosPiilotettava").style.display = "none";
    }

    // Haetaan asema-data, suodatetaan pois ne asemat, jotka eivät ole matkustaja-asemia.
    $.getJSON(asematUrl, function (jsondata) {
        asemat = jsondata;
        var matkustajaAsemat= $.grep(asemat,function (mat) {
            return (mat.passengerTraffic===true);
        })
        luoDropdownMenut(matkustajaAsemat);
    });

    estaSamaValintaDropdowneissa();
    // Haetaan käyttäjän geolokaatio ja tallennetaan omaLat- ja omaLon-muuttujiin.
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

    // Käydään läpi kaikki asemat ja etsitään lähin asema.
    // Esitellään muuttujat, etäisyyden alkuarvo = "ääretön".
    var lahinAsema;
    var etaisyys = Number.MAX_VALUE;

    // Funktio käynnistyy napin painalluksella.
    document.getElementById("haeAsema").onclick = function(){

        // Käydään läpi asemat ja haetaan pienintä etäisyyttä (linnuntietä).
        for(var i = 0; i < asemat.length; i++){
            var asemanLat = asemat[i].latitude;
            var asemanLon = asemat[i].longitude;
            //otetaan hakuun mukaan vain matkustajaliikenteelle sallitut asemat
            if(asemat[i].passengerTraffic && laskeEtaisyys(asemanLat, asemanLon, omaLat, omaLon) < etaisyys){
                etaisyys = laskeEtaisyys(asemanLat, asemanLon, omaLat, omaLon);
                lahinAsema = asemat[i];
            }
        }

        // Sijoitetaan alasvetovalikkoon lähin asema.
        $('#lahto').val(lahinAsema.stationShortCode);
    }

    req.onreadystatechange = function () {
        if(req.readyState === 4){
            if (req.status === 200){
                var data = JSON.parse(req.responseText);

                // Varoitetaan, jos yhteyksiä ei löydy, ei turhaan tulosteta tyhjää lähtöasemaa.
                if(data.code === "TRAIN_NOT_FOUND"){
                    window.alert("Yhteydelle ei löydy suoria junia! Valitse toinen yhteys.");
                }

                // Luodaan taulukko, johon junat lisätään.
                $('<table></table>', {
                    id: 'taulukko',
                    class: 'table table-responsive table-hover'
                }).appendTo('#lista');

                // Lisätään headerit taulukolle.
                $('#taulukko').append('<thead><tr><th></th><th>Juna</th><th>Lähtöaika</th><th>Saapumisaika</th>');

                // Haetaan dokumentin kohta, johon taulukon tiedot lisätään (käytetään for-luupissa alla).
                var taulukonTaytto = document.getElementById('taulukko');

                for(var i = 0; i < data.length; i++){
                    var juna = data[i]; //haetaan juna, jota käsitellään
                    var lahtoasemanIndeksi = palautaJunanTiedot(lahtoasema, juna.timeTableRows);
                    var paateasemanIndeksi = palautaJunanTiedot(paateasema, juna.timeTableRows);
                    var lahtoaika = new Date(juna.timeTableRows[lahtoasemanIndeksi].scheduledTime);
                    var saapumisaika = new Date(juna.timeTableRows[paateasemanIndeksi].scheduledTime);
                    // Jos lähijuna, junan nimi = lähijunan tunnus, muuten junan tyyppi + junan numero.
                    var junanNimi = (juna.trainCategory==="Commuter")? (juna.commuterLineID+"-juna") : (juna.trainType+juna.trainNumber);
                    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false}; //ajan näyttämisen asetukset

                    // Lisätään taulukkoon rivi, jossa on junan tiedot.
                    taulukonTaytto.innerHTML += '<tr class="clickable" data-toggle="collapse" id=' + juna.trainNumber
                        + ' data-target=.' + juna.trainNumber + '><td><i class="glyphicon glyphicon-plus"></i></td><td>'+junanNimi+'</td>' +
                        '<td>'+ lahtoaika.toLocaleDateString("fi", optiot) + '</td>' +
                        '<td>' + saapumisaika.toLocaleDateString("fi", optiot) + '</td></tr>';

                    // Haetaan niiden asemien tiedot, joissa juna pysähtyy.
                    // Loopin alku vaati säätöä, että se toimii silloin, kun lähtöpaikka on junan eka asema.
                    var loopinAlku;
                    var aika;
                    var asemanNimi;
                    if(lahtoasemanIndeksi === 0){
                        loopinAlku = 1;
                        aika = new Date(juna.timeTableRows[0].scheduledTime);
                        asemanNimi = palautaAsemanTiedot(juna.timeTableRows[0].stationShortCode).stationName;
                        taulukonTaytto.innerHTML += '<tr class="collapse '+juna.trainNumber+'"><td></td><td>'+asemanNimi+'</td>' +
                            '<td>'+ aika.toLocaleTimeString("fi", optiot) +'</td><td></td></tr>';
                    } else {
                        loopinAlku = lahtoasemanIndeksi;
                    }

                    for(var j = loopinAlku; j <= paateasemanIndeksi; j += 2){
                        if (juna.timeTableRows[j].trainStopping) {
                            aika = new Date(juna.timeTableRows[j].scheduledTime);
                            asemanNimi = palautaAsemanTiedot(juna.timeTableRows[j].stationShortCode).stationName;

                            //lisätään asemien tiedot taulukkoon
                            taulukonTaytto.innerHTML += '<tr class="collapse '+juna.trainNumber+'"><td></td><td>'+asemanNimi+'</td>' +
                                '<td>'+ aika.toLocaleTimeString("fi", optiot) +'</td><td></td></tr>';
                        }
                    }
                }
            } else {
                alert("Pyyntö epäonnistui");
            }
        }
    };

    /**
     * Palauttaa aseman koko nimen shortCoden perusteella.
     */
    function palautaAsemanTiedot(syote) {
        var a = $.grep(asemat, function (e) {
            return (e.stationShortCode === syote);
        });
        return a[0];
    }

    /**
     * Palauttaa haetun aseman indeksin junan tiedoista.
     */
    function palautaJunanTiedot(asemakoodi, data) {
        return data.findIndex(x => x.stationShortCode === asemakoodi);
    }

    // Luodaan valittujen asemien väliset yhteydet listaksi.
    document.getElementById("nappi").onclick = hae;

    /**
     * Luodaan dropdownmenut asema-json-datan perusteella.
     */
    function luoDropdownMenut(data){
        // luodaan lähtöasemien dynaaminen lista JSON:in avulla
        var dropdownlahto = $('#lahto');
        dropdownlahto.empty();
        dropdownlahto.append('<option selected="true" disabled>Valitse lähtöasema:</option>');
        dropdownlahto.prop('selectedIndex', 0);
        luoLahtoasemat(data);

        function luoLahtoasemat(data) {
            $.each(data, function (key, entry) {
                dropdownlahto.append($('<option></option>').attr('value', entry.stationShortCode).text(entry.stationName));
            })
        };
        // Luodaan pääteasemien dynaaminen lista JSON:in avulla.
        var dropdownpaate = $('#paate');
        dropdownpaate.empty();
        dropdownpaate.append('<option selected="true" disabled>Valitse pääteasema:</option>');
        dropdownpaate.prop('selectedIndex', 0);
        luoPaateasemat(data);

        function luoPaateasemat(data) {
            $.each(data, function (key, entry) {
                dropdownpaate.append($('<option></option>').attr('value', entry.stationShortCode).text(entry.stationName));
            })
        };
    };

    // Ei voi valita kahta samaa asemaa.
    function estaSamaValintaDropdowneissa () {
        $(".preferenceSelect").change(function() {
            var selected = $("option:selected", $(this)).val();
            var thisID = $(this).attr("id");
            $(".preferenceSelect option").each(function() {
                $(this).prop("disabled", false);
            });
            $(".preferenceSelect").each(function() {
                if ($(this).attr("id") != thisID) {
                    $("option[value='" + selected + "']", $(this)).attr("disabled", true);
                }
            });
        });
    };
};

// LOGIN scriptiä

/**
 * Luodaan uusi käyttäjätunnus, jos Luo tili-painiketta painetaan.
 */
function luoJaLisaaUusiKayttaja(){
    var kayttajat = localStorage.kayttajat;
    var uusiNimi = document.getElementById("id").value;
    var uusiSalasana = document.getElementById("pw").value;

    if(kayttajat === undefined){
        if (uusiNimi === '' && uusiSalasana === ''){
            window.alert("Syötä käyttäjätunnus ja salasana!")
        } else if (uusiNimi !== '' && uusiSalasana === '') {
            window.alert("Syötä myös salasana!")
        } else if (uusiNimi === '' && uusiSalasana !== ''){
            window.alert("Syötä myös käyttäjätunnus!")
        } else {
            var uusiKirjautuja = "{\"id\":\"" + uusiNimi + "\",\"pw\":\"" + uusiSalasana + "\"}";
            localStorage.kayttajat += uusiKirjautuja;
            window.alert("Uusi käyttäjätunnus on nyt luotu. Voit kirjautua järjestelmään syöttämilläsi tiedoilla!");
            document.getElementById("id").value = '';
            document.getElementById("pw").value = '';
        }
    } else {
        // Otetaan kiinni tyhjä käyttäjätunnus.
        if(kayttajat.indexOf(uusiNimi) === 0 && uusiSalasana === ''){
            window.alert("Syötä käyttäjätunnus ja salasana!");
        } else if (kayttajat.indexOf(uusiNimi) === 0 && uusiSalasana !== ''){
            window.alert("Syötä myös käyttäjätunnus!");
        } else if (kayttajat.indexOf(uusiNimi) === -1) {
            if (uusiNimi === '' && uusiSalasana === '') {
                window.alert("Syötä käyttäjätunnus ja salasana!")
            } else if (uusiNimi !== '' && uusiSalasana === '') {
                window.alert("Syötä myös salasana!")
            } else if (uusiNimi === '' && uusiSalasana !== '') {
                window.alert("Syötä myös käyttäjätunnus!")
            } else {
                var uusiKirjautuja = "{\"id\":\"" + uusiNimi + "\",\"pw\":\"" + uusiSalasana + "\"}";
                localStorage.kayttajat += uusiKirjautuja;
                window.alert("Uusi käyttäjätunnus on nyt luotu. Voit kirjautua järjestelmään syöttämilläsi tiedoilla!");
                document.getElementById("id").value = '';
                document.getElementById("pw").value = '';
            }
        } else {
            window.alert("Käyttäjätunnus on jo olemassa! Yritä uudestaan.")
        }
    }
}

/**
 * Tämä lukee käyttäjän syöttämät tunnukset ja vertaa niitä "kayttajat" tallenteeseen.
 * Jos löytyy vastaavuus, suoritetaan kirjautuminen ja siirry funktion kutsu. Muuten pyydetään tunnuksia uudestaan.
 */
function kirjautuuSisaanJosTunnuksetOikein() {
    var kayttajat = localStorage.kayttajat;
    var kirjautuja = "{\"id\":\"" + document.getElementById("id").value + "\",\"pw\":\"" + document.getElementById("pw").value + "\"}";
    console.log(kayttajat);
    console.log(kirjautuja);

    if (kayttajat === undefined){
        window.alert("Järjestelmässä ei ole vielä yhtäkään käyttäjää, luo ensimmäinen!")
    } else if (kayttajat.indexOf(kirjautuja) === -1){
        window.alert("Väärä käyttäjätunnus tai salasana!")
        document.getElementById("id").value = '';
        document.getElementById("pw").value = '';
    } else {
        window.alert("Tervetuloa järjestelmään, " + document.getElementById("id").value + "!");
        siirryKirjautuneenaAikatauluSivulle();
    }
}

/**
 * Tässä avataan alkuperäinen junien aikataulusivu, jonka urlin perään on asetettu juuri onnistuneesti sisäänkirjautuneen käyttäjän käyttäjätunnus.
 */
function siirryKirjautuneenaAikatauluSivulle() {
    window.location.reload();
    open(url="index.html" + "#" + document.getElementById("id").value,"_self");
}