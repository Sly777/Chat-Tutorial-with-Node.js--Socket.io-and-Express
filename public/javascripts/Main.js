// http://developerarea.blogspot.com
// Ilker Guller
// Socketi tanımlıyoruz
var socket;

function SocketTarafi(kulIsmi){
    // Socket bağlantısı kurulur
    var socket = io.connect("http://localhost:3000");

    // Kullanıcı bağlandığında çalışacak fonksiyon
    socket.on("connect", function(){
        // Kullanıcılar listesine ekle
        socket.emit("kullaniciEkle", kulIsmi);
        $('#isimGirisEkrani').fadeOut("slow", function(){
            $('#chatBolumu').fadeIn("slow");
        });
    });

    // Mesaj Gonderme Fonksiyonu
    socket.on("mesajGonder", function(kullaniciadi, data){
        // Mesajı konuşma penceresine yaz
        $('#konusmaPenceresi').append("<b style='color:gray;text-decoration: italic;'>" + kullaniciadi + ":</b> " + data + "<br/>");
    });

    // Kullanıcı listesini yenileme fonksiyonu
    socket.on("kullanicilariYenile", function(data){
        // Kullanıcıların yazdığı ekranı temizle
        $('#kullanicilar').empty();
        // Kullanıcı isimlerini ekrana yaz
        $.each(data, function(key, value){
            $('#kullanicilar').append("<div>" + key + "</div>");
        });
    });

    // Mesajı Gönder Butonuna basınca mesajı yolla
    $('#mesajiYolla').click(function() {
        var message = $('#mesaj').val();
        $('#mesaj').val('');
        // Server tarafından mesajYolla fonksiyonunu çağırıyoruz
        socket.emit('mesajYolla', message);
    });
}

$(function(){
    $('#btnBaglan').click(function(){
        var kulIsmi = $('#txtIsim').val();
        if(kulIsmi === ""){
            alert('Lütfen isminizi girin');
        } else {
            // Eğer isim girilmişse socket kodlarını çalıştırmaya başlıyoruz.
            SocketTarafi(kulIsmi);
        }
    });

    // Kullanıcı enter'a basarsa da mesajı gönder
    $('#mesaj').keypress(function(e) {
        if(e.which == 13) {
            $('#mesajiYolla').click();
        }
    });
});