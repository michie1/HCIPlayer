// Generated by CoffeeScript 1.3.3
var addTrackToPlaylist, addTrackToPlaylistFromServer, playlistData, searchData, socket, suggestionData;

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
  $('<img />')[0].src = '/images/icons-18-white.png';
  $('<img />')[0].src = '/images/thumbs_up.png';
  $('<img />')[0].src = '/images/thumbs_up_clicked.png';
  $('<img />')[0].src = '/images/thumbs_down.png';
  $('<img />')[0].src = '/images/thumbs_down_clicked.png';
  $('ul.list li').live('click', function(e) {
    var that;
    if ($(this).hasClass('open')) {
      return $(this).toggleClass('open closed');
    } else {
      $.mobile.loading('show');
      console.log($.mobile.activePage.attr('id'));
      that = this;
      if ($.mobile.activePage.attr('id') === 'getSuggestions' && suggestionData[$(this).index()].album === '') {
        return socket.emit('trackInfo', $.observable(suggestionData).data()[$(this).index()].spotify, function(data) {
          $.observable(suggestionData[$(that).index()]).setProperty({
            album: data.album
          });
          $(that).toggleClass('open closed').parent().children('.open').not(that).toggleClass('open closed');
          return $.mobile.loading('hide');
        });
      } else if ($.mobile.activePage.attr('id') === 'addTrack' && searchData[$(this).index()].album === '') {
        console.log($.observable(searchData).data()[$(this).index()]);
        return socket.emit('trackInfo', $.observable(searchData).data()[$(this).index()].spotify, function(data) {
          console.log(data);
          $.observable(searchData[$(that).index()]).setProperty({
            album: data.album
          });
          $(that).toggleClass('open closed').parent().children('.open').not(that).toggleClass('open closed');
          return $.mobile.loading('hide');
        });
      } else if ($.mobile.activePage.attr('id') === 'playlist' && playlistData[$(this).index()].album === '') {
        return socket.emit('trackInfo', $.observable(playlistData).data()[$(this).index()].spotify, function(data) {
          $.observable(playlistData[$(that).index()]).setProperty({
            album: data.album
          });
          $(that).toggleClass('open closed').parent().children('.open').not(that).toggleClass('open closed');
          return $.mobile.loading('hide');
        });
      } else {
        $(that).toggleClass('open closed').parent().children('.open').not(that).toggleClass('open closed');
        return $.mobile.loading('hide');
      }
    }
  });
  $('#settings a').bind('click', function(e) {
    $('#settings [data-theme="e"]').buttonMarkup({
      theme: 'c'
    });
    $(this).parent().parent().parent().buttonMarkup({
      theme: 'e'
    });
    $('#settings').popup('close');
    return false;
  });
  $('body').bind('swipeleft', function(e) {
    if ($.mobile.activePage.attr('id') === 'playlist') {
      return $.mobile.changePage($('#addTrack'), {
        transition: 'slide'
      });
    } else if ($.mobile.activePage.attr('id') === 'addTrack') {
      return $.mobile.changePage($('#getSuggestions'), {
        transition: 'slide'
      });
    }
  });
  $('body').bind('swiperight', function(e) {
    if ($.mobile.activePage.attr('id') === 'addTrack') {
      return $.mobile.changePage($('#playlist'), {
        transition: 'reverse slide'
      });
    } else if ($.mobile.activePage.attr('id') === 'getSuggestions') {
      return $.mobile.changePage($('#addTrack'), {
        transition: 'reverse slide'
      });
    }
  });
  /*
  	$('#playlist').bind 'swipeleft', (e) ->
  		$.mobile.changePage $('#addTrack'), { transition: 'slide' }
  
  	$('#addTrack').bind 'swipeleft', (e) ->
  		$.mobile.changePage $('#getSuggestions'), { transition: 'slide' }
  
  	$('#addTrack').bind 'swiperight', (e) ->
  		$.mobile.changePage $('#playlist'), { transition: 'reverse slide' }
  
  	$('#getSuggestions').bind 'swiperight', (e) ->
  		$.mobile.changePage $('#addTrack'), { transition: 'reverse slide' }
  */

  socket.on('nextTrack', function() {
    $.observable(playlistData).remove(0, 1);
    if (playlistData.length === 1) {
      return $('.title').text(data.artist + ' — ' + data.title);
    }
  });
  socket.on('newTrack', function(data) {
    addTrackToPlaylistFromServer(data);
    if (playlistData.length === 1) {
      return $('.title').text(data.artist + ' — ' + data.title);
    }
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
    if ($(this).hasClass('addTrack')) {
      $(this).removeClass('addTrack').addClass('trackAdded');
    }
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
  return $.link.suggestionItem('#suggestionItems', suggestionData);
});
