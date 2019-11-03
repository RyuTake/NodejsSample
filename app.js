// httpオブジェクトのロード
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

// テンプレートファイル読み込み(同期処理)
// readFileSync, readFileの違い
// 非同期処理のため、ファイル読み込みが終わる前にほかの処理が走ってしまう
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');


//サーバオブジェクト作成
var server = http.createServer(getFromClient);

//ポート番号3000でサーバを起動(待ち受け状態)
server.listen(3000);
console.log('Server start!');


//-------------関数定義--------------------

// createServerの引数に使う関数
function getFromClient(request, response){
    // url分解
    // trueにすることでクエリパラメータも読み込む
    var url_parts = url.parse(request.url,true);

    //ルーティング部(requestの値を参照して、それに応じたページを返す処理)
    switch (url_parts.pathname){
        // /の場合
        case '/':
            // 関数で切り出し
            response_index(request, response);
        break;

        // otherの場合
        case '/other':
            // 関数で切り出し
            response_other(request, response);
        break;

        // css読み込み
        case '/style.css':
        response.writeHead(200, {'Content-Type' : 'text/css'});
        response.write(style_css);
        response.end();
        break;

        // デフォルト処理
        default:
            response.writeHead(200, {'Content-Type' : 'text/plain'});
            response.end('no page...');
            break;
    }


}

// 追加するデータ用変数
var data = {
    'Taro':'090-999-999',
    'Hanako':'080-888-888',
    'Sachiko':'070-777-777',
    'Ichiro':'060^666-666'
};

// indexのアクセス処理
function response_index(request, response){
        var msg = "これはIndexページです";
        // レンダリング(ejs->html生成)
        var content = ejs.render(index_page, {
            title:"Index",
            content:msg,
            data:data,
        });        
        response.writeHead(200, {'Ccontent-Type': 'text/html'});
        response.write(content);  
        response.end();
}

// otherのアクセス処理
function response_other(request, response){
    var msg = "これはOtherページです";
    

    // POSTアクセス時の処理
    if(request.method == 'POST'){
        // 空の文字列bodyを用意しておく
        var body = '';

        // イベントで分岐を記載せずとも、
        // オブジェクト.onの書き方でオブジェクトにイベントが発生したときだけその処理を実行させられる

        // データ受信のイベント処理
        // dataというイベントが入ってきたとき、(data)=>～の関数を実行する
        // (data)が引数の関数、という表現のようだ
        request.on('data', (data)=>{
                body += data;
            });
        
        // データ受信終了のイベント処理
        // endイベントに対する処理は引数が不要(すべてのデータは受信完了している)なのでｍ
        // ()=>関数という書き方になる
        request.on('end',() =>{
            var post_data = qs.parse(body); // データのパース
            msg += 'あなたは、「'+post_data.msg+'」と書きました。';
            var content = ejs.render(other_page,{
                title:"Other",
                content:msg,
            });
            response.writeHead(200, {'Ccontent-Type': 'text/html'});
            response.write(content);
            response.end();
        });
        

    }
    // GETアクセス時の処理
    else{
        var msg = "ページがありません。";
        var content = ejs.render(other_page,{
            title:"Other",
            content:msg,
        });
        response.writeHead(200, {'Ccontent-Type': 'text/html'});
        response.write(content);
        response.end();
    }
}