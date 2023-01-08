
$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
      var file = '/static/components/' + $(this).data('include') + '.html' + '?_=' + Math.round(Math.random()*10000)
      $(this).load(file)
    })
  })