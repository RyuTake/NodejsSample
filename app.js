// httpオブジェクトのロード
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

// テンプレートファイル読み込み(同期処理)
// syncがつかないと非同期処理のため、ファイル読み込みが終わる前にほかの処理が走ってしまう
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');

//サーバオブジェクト作成
var server = http.createServer(getFromClient);

//ポート番号3000でサーバを起動(待ち受け状態)
server.listen(3000);
console.log('Server start!');


//-------------関数定義--------------------

// createServerの引数処理
function getFromClient(request, response){
    // url分解
    var url_parts = url.parse(request.url,true);

    //ルーティング部(requestの値を参照して、それに応じたページを返す処理)
    switch (url_parts.pathname){
        // /の場合
        case '/':
        // レンダリング(ejs->html生成)
        var content = "これはIndexページです";
        var query = url_parts.query;
        if(query.msg != undefined){
            content += 'あなたは「' + query.msg + '」と送りました。';
        }
        var content = ejs.render(index_page,{
            title:"Index",
            content:content,
        });
        response.writeHead(200, {'Ccontent-Type': 'text/html'});
        response.write(content);
        response.end();
        break;

        // otherの場合
        case '/other':
        // レンダリング(ejs->html生成)
            var content = ejs.render(other_page,
            {
                title:"Other",
                content:"これはOtherページです。"
            });
        response.writeHead(200, {'Ccontent-Type': 'text/html'});
        response.write(content);
        response.end();
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


};