/**
 *  Bu kısım otomatik Express tarafından yaratıldı.
 *  Ilker Guller
 *  http://developerarea.blogspot.com
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', routes.index);

// Bu Kısmı ben ekledim.
app.get('/chatPage', routes.chatPage);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

/**
 * Yukarıdaki kısım otomatik Express tarafından yaratıldı.
 * Ilker Guller
 * http://developerarea.blogspot.com
 */

// Socket bağlantısı kurulur
var io = require('socket.io').listen(app);

// Kullanıcı Listesinin tutulacağı Object
var kullanicilar = {};

// Bağlantı kurulduğunda çalışacak kısım
io.sockets.on('connection', function(socket){
    // Kullanıcı Ekleme Fonksiyonu
    socket.on("kullaniciEkle", function(kullaniciadi){
        // Kullanıcı session'nda bilgileri saklıyoruz
        socket.kullaniciAdi = kullaniciadi;
        socket.userId = kullanicilar.length;

        // Array'e kullanıcı bilgilerini ekliyoruz
        kullanicilar[kullaniciadi] = {
            userName : kullaniciadi,
            userId : kullanicilar.length
        };

        // Bağlanan kullanıcıya hoşgeldin mesajı yolluyoruz
        socket.emit("mesajGonder", "Sistem", "Hoşgeldiniz.");

        // Bütün kullanıcılara yeni kullanıcı bağlandı mesajı yolluyoruz
        socket.broadcast.emit("mesajGonder", "Sistem", kullaniciadi + " muhabbete bağlandı.");

        // Bağlı kullanıcılarda Kullanıcı listesini yeniliyoruz
        io.sockets.emit("kullanicilariYenile", kullanicilar);
    });

    // Bağlantı kesildiği takdirde çalışacak fonksiyon
    socket.on("disconnect", function(){
        // Kullanıcıyı listeden siliyoruz
        delete kullanicilar[socket.kullaniciAdi];

        // Bağlı kullanıcılarda Kullanıcı listesini yeniliyoruz
        io.sockets.emit("kullanicilariYenile", kullanicilar);

        // Bağlı kullanıcılara kullanıcı çıktı mesajı yolluyoruz
        socket.broadcast.emit("mesajGonder", "Sistem", socket.kullaniciAdi + " muhabbetten ayrıldı :(");
    });

    // Client tarafından mesaj yollama fonksiyonu
    socket.on("mesajYolla", function(data){
        // Bağlı kullanıcılara kullanıcıdan gelen mesajı yolluyoruz
        io.sockets.emit("mesajGonder", socket.kullaniciAdi, data);
    });
});