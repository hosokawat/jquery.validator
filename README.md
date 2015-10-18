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
javascript
```
$(function(){
  $('#f').validator();
  //エラーメッセージ
});
```
 #fのformをvalidatorに初期化します。

html
```
<body>
  <form id='f'>
  <input data-validate-rules='required,isLength(1,3)'>
  <input type='submit'>
  </form>
</body>
```

バリデート対象のdata-validate-rules属性にバリデートを行うルールを書きます。
必須項目の場合は、required
文字の長さが1文字以上３文字以下の場合、
isLengthを使いパラメータに(1,3)と設定します。


### 複数要素を組み合わせてバリデートする

### バリデータを使い分ける


## 使い方
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
