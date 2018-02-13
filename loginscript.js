// Kun sivu avataan, latautuu testikäyttäjät localStorageen nimeltä kayttajat.
// Jatkossa tässä lisätään myös uudet käyttäjät, kun softa julkaistaan
window.onload = function tallenna() {
    var niki = {"id":"niki", "pw":"salasana"};
    var kake = {"id":"kake", "pw":"salis"};
    var jake = {"id":"jake", "pw":"palis"};
    localStorage.kayttajat = JSON.stringify(niki);
    localStorage.kayttajat += JSON.stringify(kake);
    localStorage.kayttajat += JSON.stringify(jake);
}
// Tämä lukee käyttäjän syöttämät tunnukset ja vertaa niitä "kayttajat" tallenteeseen.
// Jos löytyy vastaavuus, suoritetaan kirjautuminen ja siirry funktion kutsu.
// Muuten pyydetään tunnuksia uudestaana
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


