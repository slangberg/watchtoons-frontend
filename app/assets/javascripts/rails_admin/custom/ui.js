$(document).on('rails_admin.dom_ready', function(){
  'use strict';
  var $header;
  var input = $('input#episode_tvdb_mismatch')[0];
  if(input){
    if(input.checked){
      $header = $('.page-header');
      $header.addClass('mismatch');
    }
  }
});
