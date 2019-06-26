hljs.initHighlightingOnLoad();

$(document).ready(function() {
  var form = $('#main-form');
  var output = $('#output');
  var input = $('#command');
  var issueLink = $("#issue-link")
  var issueURL = new URL("https://github.com/raphaelyancey/cli2compose/issues/new");
  var issueTemplate = "**Input**\n```\n[input]\n```\n**Output**\n```\n[output]\n```";
  
  $('#command').focus();

  function generate(i) {
    var yaml = cli2compose(i);
    output.html(yaml);
    var tpl = issueTemplate;
    tpl = tpl.replace('[input]', i);
    tpl = tpl.replace('[output]', yaml);
    issueURL.searchParams.append('body', tpl);
    issueURL.searchParams.append('title', 'Unexpected result');
    issueLink.attr('href', issueURL.href);
    hljs.highlightBlock(output.get(0));
  }

  generate(input.val());

  form.on('submit', function(e) {
    e.preventDefault();
    generate(input.val());
  });

});