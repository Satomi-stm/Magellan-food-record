const express = require('express');
const app = express();
const PORT = 4400;

//テンプレートエンジンの設定
app.set('view engine', 'ejs');
const pg = require("pg");

//prismaの設定
const { PrismaClient } = require("@prisma/client");

//PrismaClientをインスタンス化
const prisma = new PrismaClient();

//multerのインポート //sharpのインポート
const multer = require('multer');
const sharp = require('sharp')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

app.post('/testpost', upload.single('image'), async(req,res) =>{
  const country = req.body.country
  const restaurant = req.body.restaurant
  const place = req.body.place
  const food = req.body.food
  const comment = req.body.comment
  const file = req.file

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()
})


//cssファイルが入っているpublicフォルダの読み込み
app.use(express.static('public'));

// POSTで、req.bodyでJSON受け取りを可能に
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// DBに接続
var pool = new pg.Pool({
    database: "postgres",
    user: "postgres", //ユーザー名はデフォルト以外を利用した人は適宜変更すること
    password: "satomi1118", //PASSWORDにはPostgreSQLをインストールした際に設定したパスワードを記述。
    host: "localhost",
    port: 5432
  });
  

//メインページのルーティング設計
app.get('/', (req,res) => {
    res.render('main.ejs');
});

//Start Server!
const kill = require('kill-port');
app.listen(PORT,() =>{
    console.log("Start Sever!");
})

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});


//テストレコード画面のルーティング設計
app.get('/test', (req,res) =>{
  res.render('testRecord.ejs');
});

//レストラン登録画面のルーティング
app.get('/record', (req,res) =>{
    res.render('record.ejs');
});

app.post("/submitInformation/", (req, res, next) => {
    console.log(req.body);


  // 新規情報をDBに追加
    var query = {
      text:
        "INSERT INTO information (country, restrauntName, location, mealName, comment) VALUES($1, $2, $3, $4, $5)",
      values: [req.body.country, req.body.restaurantName, req.body.location, req.body.mealName, req.body.comment]　
    };
  
  //新規情報で追加した画像をawsのS3バケットに入れる
  

  pool.connect((err, client) => {
    if (err) {
      console.log(err);
    } else {
      // query関数の第一引数にSQL文をかく
      client
        .query(query)
        .then(() => {
          // res.render('information.ejs');
          res.render('information.ejs');
        })
        .catch(e => {
          console.error(e.stack);
        });
    }
  });
});



//登録した情報の一覧画面のルーティング
app.get('/information', (req,res) =>{
    res.render('information.ejs');
});

