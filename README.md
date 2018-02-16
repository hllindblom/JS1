# JS1

Ominaisuudet:

Yleistä:
 - asemalistaus haetaan sivun latautuessa, dropdown-menut luodaan dynaamisesti
 - asemalistauksessa ei pysty valitsemaan samaa lähtö- ja saapumispaikkaa
 - asemalistaus näyttää vain matkustajaliikenteelle sallitut asemat
    
Haku:
 
 - junia voi hakea tietylle päivälle ja kellonajalle (oletuksena sivun avautumishetken aika ja pvm)
 - hakee 15 seuraavaa lähtöä
 - oman sijainnin perusteella voi hakea lähimmän lähtöaseman (ja se määräytyy automaattisesti lähtöasemaksi)
 - tietyn junan tarkemmat pysähtymistiedot näytetään klikkaamalla ko. junaa
	- haetaan vain lähtöpaikan ja määränpään väliset tarkemmat tiedot, listataan vain ne asemat, jossa juna pysähtyy
 - lähijunista haetaan junan "commuterLineID" junan tunnuksen sijaan

Sisäänkirjautuminen:

 - käyttäjä voi luoda tilin ja kirjautua sillä sisään
 - kirjautumistiedot ja käyttäjän tallentamat tiedot (suosikkireitti) säilötään local storage:ssa
 - yksilöity varoitus jos:
	- yrittää luoda uutta tiliä jo olemassaolevalla käyttäjänimellä
	- väärä käyttäjätunnus ja/tai salasana
	- molemmat kentät tyhjiä ja yrittää kirjautua tai luoda tiliä
	- salasanakenttä tyhjä ja yrittää kirjautua tai luoda tiliä
	- käyttäjätunnuskenttä tyhjä ja yrittää kirjautua tai luoda tiliä
 - kenttien automaattinen tyhjennys varoitusten ja ilmoitusten välissä
 - kun käyttäjä on kirjautuneena, käyttäjän käyttäjänimi ja "kirjaudu ulos" -nappi generoituvat sivun ylälaitaan
 - kun käyttäjä on tehnyt haun, generoituu viiveellä "lisää reitti suosikkeihin" -nappi 
	- painamalla nappia kys. reitti tallentuu käyttäjän omaan local storage:en ja generoituu reittilinkiksi sivulle
	- reittilinkki suorittaa kys. tallennetun haun kun sitä clickataan
	- käyttäjän lisäämä suosikki jää muistiin ja latautuu sivulle seuraavilla sisäänkirjautumisilla
	- käyttäjällä voi olla lisättynä vain yksi suosikkireitti kerralla, uuden suosikkireitin lisääminen kirjoittaa vanhan päälle
 - kun käyttäjä kirjautuu ulos, palataan oletusindex -sivulle

Muuta:

 - "Top" -nappi sivun alareunassa palauttaa takaisin sivun alkuun
