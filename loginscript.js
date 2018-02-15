// Tämä funktio luo uuden käyttäjätunnuksen, jos Luo tili-painiketta painetaan.
// Lisätään uusi merkkijono LocalStorageen jo olemassaolevien jatkeeksi!
// ALERT-VIESTEISSÄ VIELÄ HIOMISEN VARAA!
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
            if (kayttajat.indexOf(uusiNimi) === -1) {
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

// Tämä lukee käyttäjän syöttämät tunnukset ja vertaa niitä "kayttajat" tallenteeseen.
// Jos löytyy vastaavuus, suoritetaan kirjautuminen ja siirry funktion kutsu.
// Muuten pyydetään tunnuksia uudestaan
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
// Tässä avataan alkuperäinen junien aikataulusivu, jonka urlin perään on asetettu juuri onnistuneesti sisäänkirjautuneen käyttäjän käyttäjätunnus
    function siirryKirjautuneenaAikatauluSivulle() {
        open(url="index.html" + "#" + document.getElementById("id").value,"_self");
    }


