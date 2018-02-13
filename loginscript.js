// Kun sivu avataan, latautuu testikäyttäjät localStorageen nimeltä kayttajat.
// Jatkossa tässä lisätään myös uudet käyttäjät, kun softa julkaistaan
// window.onload = function tallenna() {
//      var niki = {"id":"niki", "pw":"salasana"};
//      var kake = {"id":"kake", "pw":"salis"};
//      var jake = {"id":"jake", "pw":"palis"};
//      localStorage.kayttajat = JSON.stringify(niki);
//  };
// YLLÄOLEVA NYT YLIMÄÄRÄISTÄ!


// Tämä funktio luo uuden käyttäjätunnuksen, jos Luo tili-painiketta painetaan.
// Lisätään uusi merkkijono LocalStorageen jo olemassaolevien jatkeeksi!
    function uusiKayttaja(){
        var kayttajat = localStorage.kayttajat;
        var uusiNimi = document.getElementById("id").value;
        var uusiSalasana = document.getElementById("pw").value;
        if (kayttajat.indexOf(uusiNimi) === -1){
            if (uusiSalasana === '') {
                window.alert("Syötä myös salasana!")
            } else if (uusiNimi === ''){
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
// Tämä lukee käyttäjän syöttämät tunnukset ja vertaa niitä "kayttajat" tallenteeseen.
// Jos löytyy vastaavuus, suoritetaan kirjautuminen ja siirry funktion kutsu.
// Muuten pyydetään tunnuksia uudestaan
    function lue(){
        var kayttajat = localStorage.kayttajat;
        var kirjautuja = "{\"id\":\"" + document.getElementById("id").value + "\",\"pw\":\"" + document.getElementById("pw").value + "\"}";
        console.log(kayttajat);
        console.log(kirjautuja);

        if (kayttajat.indexOf(kirjautuja) === -1){
            window.alert("Väärä käyttäjätunnus tai salasana!")
            document.getElementById("id").value = '';
            document.getElementById("pw").value = '';
        } else {
            window.alert("Tervetuloa järjestelmään, " + document.getElementById("id").value + "!");
            siirry();
        }
    }
// Tässä avataan alkuperäinen junien aikataulusivu, jonka urlin perään on asetettu juuri onnistuneesti sisäänkirjautuneen käyttäjän käyttäjätunnus
    function siirry() {
        open(url="index.html" + "#" + document.getElementById("id").value);
    }


