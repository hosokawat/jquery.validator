# jquery.validator

Formのバリデーションを簡単に行えるようにするjQueryプラグインです。

長いjavascriptを書かなくても、
inputタグの属性値にバリデーションを行うルールを記述することで
バリデーションが出来るようになります。

また、
validate.js(https://github.com/chriso/validator.js)
をプリセットのバリデーションルールとして組み込んでいる為、
初めから様々なバリデートが可能です。

## インストール方法

下記のライブララリを先に読み込んでからこのライブラリを読み込んでください。
- jQuery 1.x (https://jquery.com)
- validator.js (https://github.com/chriso/validator.js)

```html
<script src="/path/to/jquery.validator.js"></script>
<!-- エラーメッセージファイル、日本語か英語かを選んでください。 -->
<script src="/path/to/jquery.validator.message.jp.js"></script>
<!-- または、 -->
<script src="/path/to/jquery.validator.message.en.js"></script>

```

## 例
バリデーションのルールとして
- 必須
- 1文字以上3文字以下

を.input1に設定する場合、下記のコードで実装できます。

javascript
```javascript
$(function(){
  $('#f').validator();
});
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
## チュートリアル
### 一つのデータをバリデートする
#### 1.validatorの初期化をするjavascriptコードを書く

jquery.validatorの実行はユーザのsubmit操作により実行されるように設定する方法と
javascriptで即時に実行する方法があります。

今回はユーザのsubmit操作で実行されるように初期化します。
```javascript
$(function(){
  $('#f').validator();
});
```
 これで#fのformをsubmitした時にバリデートが行われるように設定されました。
 もしエラーが起きればsubmitはキャンセルされます。
#### 2.バリデートルールを設定する
バリデートルールはバリデートを行うinputタグのdata-validate-rules属性に設定します。
複数のバリデートを順番に行うときは左からカンマで区切り記述します。

```html
<body>
  <form id='f'>
  <input data-validate-rules='required,isLength(1,3)'>
  <input type='submit'>
  </form>
</body>
```
今回はrequiredで必須を設定し、isLength(1,3)で1文字以上、３文字以下と設定しました。
まず、valueが空になっていれば、requiredのエラーが起きます。
次に1文字以上、３文字以下になっていなければisLengthのエラーが起きます。

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
isLengthのようにオプションを持つバリデートルールのエラーメッセージには
オプションの値を組み込むことができます。

0から順番に{位置番号}と入力しておくと自動で置きかわります。

#### 4.完成！！！
フォームのバリデート処理が完成しました。
これで、エラーがすべてなくなるまでフォームのsubmitは中断されます。

### 独自のバリデートルールを定義する

### 複数要素を組み合わせてバリデートする

### その他、便利機能
#### エラーメッセージの出力先を変更する
#### バリデータを使い分ける
#### 前後に処理を割り込ませる

## 詳細な使い方
### 初期化設定
```
$.validator('#id');
```

 #idの子要素に対してバリデートを実行します。
全てのタグに対して実行可能です。
```
$('form#id').validator();
```
submitイベント実行時にバリデータされるようにイベントを設定します。
### 初期化オプション


### バリデーションルールの設定
input要素のdata-validate-rules属性にカンマ区切りでルールを記述します。

初期設定では一番左のルールのエラーメッセージだけが表示されます。
ルールはデフォルトち

### エラーメッセージ
### グループバリデーション




### バリデーションルールの追加方法
validator.jsの

グループバリデーションルールの追加方法

 #formというformタグに対して
 ```
 $('#form').validator();
 ```
と実行しておくとsubmit時にバリデータが実行されるようになります。

のsubmitにバリデーションルールを

 フォーム子要素のinputに対して
を実行するとformのbind
また、
$.validator('form');
と実行すると


## Please Help!
The person who translates Japanese into English is recruited.

日本語を英語に翻訳してくれる人を募集
