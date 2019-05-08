hljs.initHighlightingOnLoad();

$(document).ready(function() {
  var form = $('#main-form');
  var output = $('#output');
  var input = $('#command');
  
  $('#command').focus();

  function generate(i) {
    var yaml = cli2compose(i);
    output.html(yaml);
    hljs.highlightBlock(output.get(0));
  }

  generate(input.val());

  form.on('submit', function(e) {
    e.preventDefault();
    generate(input.val());
  });

});