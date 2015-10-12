# jquery.validator
A simple, best jquery validator plugin


##Installation

Include script after the Some library :
- jQuery 1.x (https://jquery.com) 
- validator.js (https://github.com/chriso/validator.js)
```html
<script src="/path/to/jquery.validator.js"></script>
```

##Example
validate rule of .input1
- required
- Below 3 character beyond 1 character 

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
