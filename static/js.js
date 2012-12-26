// Generated by CoffeeScript 1.3.3
var addTrackToPlaylist, addTrackToPlaylistFromServer, playlistData, searchData, socket, suggestionData,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

playlistData = [];

suggestionData = [];

searchData = [];

socket = io.connect(settings.url);

addTrackToPlaylist = function(e) {
  var data, newTrack;
  data = $.view($(e).parent().parent()).data;
  $.observable(playlistData).insert(playlistData.length, data);
  newTrack = $('#playlistItems li:last').addClass('new');
  setTimeout((function() {
    return newTrack.removeClass('new');
  }), 3000);
  if (playlistData.length === 1) {
    $('.title').text(data.artist + ' — ' + data.title);
  }
  return socket.emit('addTrack', data);
};

addTrackToPlaylistFromServer = function(data) {
  var newTrack;
  $.observable(playlistData).insert(playlistData.length, data);
  newTrack = $('#playlistItems li:last').addClass('new');
  return setTimeout((function() {
    return newTrack.removeClass('new');
  }), 3000);
};

if (playlistData.length === 1) {
  $('.title').text(data.artist + ' — ' + data.title);
}

socket.on('setTitle', function(title) {
  return $('.title').text(title);
});

$(document).ready(function() {
  if (playlistData.length === 0) {
    $('.title').text('HCIPlayer');
  } else {
    $('.title').text(playlistData);
  }
  socket.emit('reqSug', function(data) {
    return $.observable(suggestionData).refresh(data);
  });
  $('ul.list li').live('click', function(e) {
    $.mobile.loading('show');
    if (__indexOf.call(suggestionData[$(this).index()], 'album') >= 0 === false) {
      if ($.mobile.activePage.attr('id') === 'getSuggestions') {
        $.observable(suggestionData[$(this).index()]).setProperty({
          album: 'bla',
          tags: 'blabla'
        });
      } else if ($.mobile.activePage.attr('id') === 'addTrack') {
        $.observable(searchData[$(this).index()]).setProperty({
          album: 'bla',
          tags: 'blabla'
        });
      } else {
        $.observable(playlistData[$(this).index()]).setProperty({
          album: 'bla',
          tags: 'blabla'
        });
      }
    }
    $(this).toggleClass('open closed').parent().children('.open').not(this).toggleClass('open closed');
    return $.mobile.loading('hide');
  });
  socket.on('newTrack', function(data) {
    return console.log(data);
  });
  socket.on('sugTrack', function(data) {
    return $.observable(suggestionData).insert(suggestionData.length, data);
  });
  return true;
});

$('#playlist').live('pagebeforecreate', function() {
  $('#playlistItems .thumbup').live('click', function(e) {
    $(this).toggleClass('liked');
    return false;
  });
  $('#playlistItems .thumbdown').live('click', function(e) {
    $(this).toggleClass('disliked');
    return false;
  });
  $.templates({
    playlistItem: '#playlistItem'
  });
  return $.link.playlistItem('#playlistItems', playlistData);
});

$('#addTrack').live('pagebeforecreate', function() {
  $('#searchSubmit').bind('click', function(e) {
    $.mobile.loading('show');
    return $.ajax({
      type: 'POST',
      url: settings.url + '/search',
      data: {
        type: 'artist',
        query: $('#search-basic').val()
      },
      dataType: 'json',
      success: function(data) {
        $.observable(searchData).refresh(data);
        $('#searchResults').css('display', 'block');
        return $.mobile.loading('hide');
      }
    });
  });
  $('#searchItems .addTrack').live('click', function(e) {
    addTrackToPlaylist(this);
    /*
    		$(this).toggleClass 'addTrack trackAdded'
    		$.observable(playlistData).insert playlistData.length, $.view($(this).parent().parent()).data
    		newTrack = $('#playlistItems li:last').addClass 'new'
    		setTimeout ( ->
    			newTrack.removeClass 'new'
    		), 3000
    */

    return false;
  });
  $.templates({
    searchItem: '#searchItem'
  });
  return $.link.searchItem('#searchItems', searchData);
});

$('#getSuggestions').live('pageshow', function() {});

$('#getSuggestions').live('pageinit', function() {
  $('#suggestionItems .addTrack').live('click', function(e) {
    if ($(this).hasClass('addTrack')) {
      $(this).removeClass('addTrack').addClass('trackAdded');
    }
    addTrackToPlaylist(this);
    return false;
  });
  $.templates({
    suggestionItem: '#suggestionItem'
  });
  $.link.suggestionItem('#suggestionItems', suggestionData);
  return $('#suggestionItems').link(true, suggestionData);
});
