# jquery.validator
A simple, best jquery form validator plugin

##Installation

Include script after the Some library :
- jQuery 1.x (https://jquery.com) 
- validator.js (https://github.com/chriso/validator.js)
```html
<script src="/path/to/jquery.validator.js"></script>
```

##Example
バリデートのルールが
- 必須
- 1文字以上3文字以下の場合 

javascript
```
$(function(){
  $('#f').validator()
});
```
html
```
<body>
  <form id='f'>
  <input class='input1' data-validate-rules='required,isLength(1,3)'>
  </form>
</body>
```

##Usage


##Please Help!
The person who translates Japanese into English is recruited.
日本語を英語に翻訳してくれる人を募集
