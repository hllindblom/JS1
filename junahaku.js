window.onload = function () {

    req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if(req.readyState === 4){
            if(req.status === 200){
                var data = JSON.parse(req.responseText);
                console.dir(data);
                var ulos = document.getElementById("lista");
                ulos.innerHTML = '';
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
                        + saapumisaika.toLocaleDateString("fi", optiot);
                }
            } else {
                alert("Pyyntö epäonnistui");
            }
        }
    };
    // luodaan valittujen asemien väliset yhteydet listaksi
    document.getElementById("nappi").onclick = function(){
        var lahtoasema = document.getElementById("lahto").value;
        var paateasema = document.getElementById("paate").value;
        console.dir(lahtoasema);
        console.dir(paateasema);
        req.open('GET', 'https://rata.digitraffic.fi/api/v1/live-trains/station/' + lahtoasema + '/' + paateasema, true);
        req.send(null);
    }
    // luodaan lähtöasemien dynaaminen lista JSON:in avulla
    let dropdownlahto = $('#lahto');
    dropdownlahto.empty();
    dropdownlahto.append('<option selected="true" disabled>Valitse lähtöasema:</option>');
    dropdownlahto.prop('selectedIndex', 0);
    const url = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
// Populate dropdown with list of provinces
    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            dropdownlahto.append($('<option></option>').attr('value', entry.stationShortCode).text(entry.stationName));
        })
    });
    // luodaan pääteasemien dynaaminen lista JSON:in avulla
    let dropdownpaate = $('#paate');
    dropdownpaate.empty();
    dropdownpaate.append('<option selected="true" disabled>Valitse päätasema:</option>');
    dropdownpaate.prop('selectedIndex', 0);
    const url2 = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
    // Populate dropdown with list of provinces
    $.getJSON(url2, function (data) {
        $.each(data, function (key, entry) {
            dropdownpaate.append($('<option></option>').attr('value', entry.stationShortCode).text(entry.stationName));
        })
    });
    // ei voi valita kahta samaa asemaa
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