playlistData = [
	{ artist: 'Nitrous Oxide', title: 'Alderaan' },
	{ artist: 'Nitrous Oxide', title: 'Alderaan 2' }
]

suggestionData =[
	{ artist: 'Nitrous Oxide', title: 'Alderaan 3' },
	{ artist: 'Nitrous Oxide', title: 'Alderaan 4' }
]


searchData =[
	{ artist: 'Nitrous Oxide', title: 'Alderaan 5' },
	{ artist: 'Nitrous Oxide', title: 'Alderaan 6' }
]


$(document).ready () ->
	$('ul.list li').live 'click', (e) ->
		#console.log 'toggle'
		$(this).toggleClass('open closed').parent().children('.open').not(this).toggleClass 'open closed'

$('#playlist').live 'pagebeforecreate', () ->	
	$('#playlistItems .thumbup').live 'click', (e) ->
		if $(this).hasClass 'liked'
			console.log 'Like weghalen'
		else
			console.log 'Like toevoegen'
		false

	$('#playlistItems .thumbdown').live 'click', (e) ->
		if $(this).hasClass 'disliked'
			console.log 'Dislike weghalen'
		else
			console.log 'Dislike toevoegen'
		false

	$.templates { playlistItem: '#playlistItem' }
	$.link.playlistItem '#playlistItems', playlistData
	#$.observable(playlistData).insert playlistData.length, { artist: 'Michiel', title: 'Track 3' }


addTrackToPlaylist = (e) ->
		$(e).toggleClass 'addTrack trackAdded'
		$.observable(playlistData).insert playlistData.length, $.view($(e).parent().parent()).data
		newTrack = $('#playlistItems li:last').addClass 'new'
		setTimeout ( ->
			newTrack.removeClass 'new'
		), 3000

$('#addTrack').live 'pagebeforecreate', () ->	
	$('#searchSubmit').bind 'click', (e) ->
		$('#searchResults').css 'display', 'block'

	$('#searchItems .addTrack').live 'click', (e) ->
		addTrackToPlaylist(this)
		###
		$(this).toggleClass 'addTrack trackAdded'
		$.observable(playlistData).insert playlistData.length, $.view($(this).parent().parent()).data
		newTrack = $('#playlistItems li:last').addClass 'new'
		setTimeout ( ->
			newTrack.removeClass 'new'
		), 3000
		###
		false


	$.templates { searchItem: '#searchItem' }
	$.link.searchItem '#searchItems', searchData
	

$('#getSuggestions').live 'pagebeforecreate', () ->	
	$('#suggestionItems .addTrack').live 'click', (e) ->
		addTrackToPlaylist(this)
		###
		$(this).toggleClass 'addTrack trackAdded'
		$.observable(playlistData).insert playlistData.length, $.view($(this).parent().parent()).data
		newTrack = $('#playlistItems li:last').addClass 'new'
		setTimeout ( ->
			newTrack.removeClass 'new'
		), 3000
		###
		false
	
	$.templates { suggestionItem: '#suggestionItem' }
	$.link.suggestionItem '#suggestionItems', suggestionData

