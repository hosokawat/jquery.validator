# jQuery.validator

Formのバリデーションを効率的に記述できるようにするjQueryプラグインです。

inputタグの属性にルールを設定することでバリデーションが出来るようになります。
Java BeansのアノテーションによるバリデーションみたいなことをWebページでも行いたくて作りました。

# 準備

jQuery.validatorを使うには他に次のライブラリが必要です。
- jQuery 1.x (https://jquery.com)
- validator.js (https://github.com/chriso/validator.js)

jsファイルを読み込みます。
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/validator/6.2.1/validator.js"></script>
<script src="https://code.jquery.com/jquery-1.12.4.min.js"> </script>
<script src="/path/to/jquery.validator.js"></script>
<!-- エラーメッセージファイル、日本語か英語かを選んでください。 -->
<script src="/path/to/jquery.validator.message.jp.js"></script>
<!-- または、 -->
<script src="/path/to/jquery.validator.message.en.js"></script>

```
# 使い方
# 例
バリデーションのルールとして
- 必須
- 1文字以上3文字以下

を.input1に設定する場合、次のコードで実装できます。

javascript
```javascript
/* エラーメッセージの設定 */
$.extend($.error_messsages,{
  'isLength': '{0}文字から{1}までで入力してください',
  'required':'入力必須です'
});
/* コード */
$('#f').validator();
```
html
```html
<body>
  <form id='f'>
  <input class='input1' data-validate-rules='required,isLength(1,3)'>
  <input type='submit'>
  </form>
</body>
```
[Demo](https://jsfiddle.net/hosokawat/9pp8dc07/)

# 使い方
## チュートリアル
jQuery.validatorが持つ代表的な機能を一通り使ってみましょう。
#### 1.validatorを初期化する

フォームのsubmitの時に実行されるように
イベントリスナーに登録する方法と、
```javascript
$('#f').validator();
```
[Demo](https://jsfiddle.net/hosokawat/9pp8dc07/)


即座に実行する方法があります。
```javascript
$.validator('#f');
```
[Demo](https://jsfiddle.net/hosokawat/zxod7ckh/)

フォームのsubmitの時に実行されるようにした場合、
バリデーションエラーがあればsubmitはキャンセルさ
れます。
即座に実行する場合、formのsubmit処理を別に実装する必要があります。
結果がbooleanで帰ってくるのでそれによって分岐するか、
後に出てくる後処理を登録する機能を使うことで実装できます。

#### 2.バリデートルールを設定する
バリデートルールはバリデートを行うinputタグのdata-validate-rules属性に設定します。
複数のバリデートを順番に行うときは左からカンマで区切りで記述します。

```html
<body>
  <form id='f'>
  <input data-validate-rules='required,isLength(1,3)'>
  <input type='submit'>
  </form>
</body>
```
上記のソースでは、requiredで必須を設定し、isLength(1,3)で1文字以上、３文字以下と設定しました。
まず、valueが空になっていれば、requiredのエラーが起きます。
次に1文字以上、３文字以下になっていなければisLengthのエラーが起きます。

プリセットでvalidator.jsに実装されているものが使えます。
[validator.js](https://github.com/chriso/validator.js)
独自のバリデーションを実装して拡張することもできます。

#### 3.エラーメッセージを設定する

エラーメッセージを設定するまで、エラーが起きてもメッセージは表示されません。

エラーメッセージの設定は$.error_messsagesオブジェクトに
メンバ変数を追加して行います。

jQueryを使っているので$.extendメソッドを使って追加できます。
```javascript
;$.extend($.error_messsages,{
  'isLength': '文字数{0}以上、{1}以下を入力してください。',
  'required':'必須です'
});
```
isLengthのように引数を持つバリデートルールのエラーメッセージには
引数の値を組み込むことができます。

0から数えて{位置番号}と書いておくと自動で置きかわって出力されます。

#### 4.完了
フォームのバリデート処理が実装できました。
デフォルトではエラーメッセージは最初の一つだけ出力されます。

独自に実装したバリデーションルールやエラーメッセージは一つのjsファイルにまとめて複数ページで共有しておくと効率的に作業ができおすすめです。

### 独自のバリデートルールを定義する
validator.jsの拡張として定義します。
```javascript
validator['バリデートルール名'] = function(value){
  return true;
};
```
### 複数要素を組み合わせてバリデートする
姓と名のように複数のinputを組み合わせて行うバリデートは
グループバリデートを使うとできます。

[Demo](https://jsfiddle.net/hosokawat/r17acnLf/)

#### 1.グループバリデートルールの定義
validator.jsを模倣して作ったgroupValidatorにバリデートルールを定義します。
```javascript
groupValidator['姓名'] = function(datas,params){
  if(datas['名']!='tarou' || datas['姓']!='hosokawa') {
    return false;
  }
};
```
datasはグループ内キーをキーとしてinputの値が配列で渡されます。
paramsはグループ内キーをキーとしてルールのパラメータの値が配列で渡されます。
返り値としてバリデートの成否をbooleanで返します。
#### 2.グループバリデートのエラーメッセージ定義
ルール名の後に、ドットでグループ内キーを入力して追加するとそれぞれのグループないキーに出力されます。
```javascript
;$.extend($.error_messsages,{
  '姓名.姓':'姓が違っている!',
  '姓名.名':'名が違っている!'
});
```
#### 3.グループバリデートの使用
普通のバリデートルールと同じようにinputのdata-validate-rules属性に設定します。
ルール名#バリデートを行うグループ.グループ内のキーと指定します。
```html
<form>
<input type='text' data-validate-rules='姓名#groupA.姓'>
<input type='text' data-validate-rules='姓名#groupA.名'>
<input type='submit'>
</form>
```
### その他、便利機能
#### エラーメッセージの出力先を変更する
```html
<input type='text' data-validate-message-destination='#dummy' data-validate-rules='required,isEmail'>
```
[Demo](https://jsfiddle.net/hosokawat/t15mg44j/)
#### 前後処理を追加する
バリデートのオプションとして前後に実行するコールバック関数を渡すことができます。

前に実行する処理はoptionに設定します。
```javascript
options = {setup:function(){console.log('バリデート処理前');}
};
$.validator('#f',options);
```
成功後、失敗後、完了後に行いたい処理をメソッドチェインで追加できます。
同じものが複数あった時には追加した順に実行されます。
thisはバリデート対象としたformのjQueryオブジェクトです。
次のコードの場合、メソッドのthisは$('#f')になっています。
メソッドの第１引数にはエラー内容の配列、第２引数には様々な情報を詰め込んだオブジェクトが渡されます。
```javascript
$.validator('#f',options).done(function(errors,options){
  console.log('バリデート成功後に実行する');
}).fail(function(errors,options){
  console.log('バリデート失敗後に実行する');
}).always(function(errors,options){
  console.log('バリデート完了後常に実行する');
});
```

[Demo](https://jsfiddle.net/hosokawat/np3r0z6z/)

#### 複雑なバリデートを行う
manual_validateのコールバックとしてバリデート処理を実装できます。
返り値として返したエラー配列がバリデータのエラーに取り込まれます。
エラーは$.Errorメソッドの返り値として得ます。
$.Errorの引数は
```javascript
$.Error('エラーとするバリデートルール',エラーとするinput,エラー出力のプライオリティ(0が最大),オプション値);
```
```javascript
options = {manual_validate:function(){
  var errors = [];
  if($('input#test').val() > 10) {
    errors.push($.Error('over',$('input#test'),0,null));
  }
  return errors;
}};
$.validator('#f',options);
```
#### バリデート成功してもsubmitしない
optionのdefault_submitにfalseを設定します。

[Demo](https://jsfiddle.net/hosokawat/9pp8dc07/)

#### エラーの出力件数上限を設定する
デフォルトでは左から一番最初にエラーとなったエラーのみが出力されます。
すべてのエラーを出力したい場合、inputのdata-validate-message-limit属性にエラーメッセージを出した件数を指定します。
```html
//　エラーを３件出したい時
<input type='text' data-validate-message-limit='3'  data-validate-rules='required,isEmail'>
```

[Demo](https://jsfiddle.net/hosokawat/8khag68t/)

## Please Help!
The person who translates Japanese into English is recruited.

日本語を英語に翻訳してくれる人を募集
