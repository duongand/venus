import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const axios = require('axios');

function App() {
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);

	const [playlistNames, setPlaylistNames] = useState([]);
	const [playlistIds, setPlaylistIds] = useState({});
	const [selectedPlaylist, setSelectedPlaylist] = useState('');
	const [playlistTrackIds, setPlaylistTrackIds] = useState('');
	const [trackInformation, setTrackInformation] = useState({});
	const [compiledInformation, setCompiledInformation] = useState(null);

	const [chartKey, setChartKey] = useState('artist');

	function handlePlaylistChange(event) {
		setSelectedPlaylist(event.target.value);
		setPlaylistTrackIds('');
		setCompiledInformation(null);
		setChartKey('artist');
	};

	function handleKeyChange(event) {
		setChartKey(event.target.value);
	};

	useEffect(() => {
		if (window.location.search) {
			const urlParams = new URLSearchParams(window.location.search);
			setAccessToken(urlParams.get('access_token'));
			setRefreshToken(urlParams.get('refresh_token'));
			window.history.pushState({}, null, '/');
		};
	}, [])

	useEffect(() => {
		if (accessToken === null) return;

		axios.get('/get_playlists', {
			params: {
				access_token: accessToken
			}
		}).then((response) => {
			const tempPlaylistNames = response.data.items.map((playlist) => {
				return playlist.name;
			});

			const tempPlaylistIds = {};
			for (const playlist of response.data.items) {
				tempPlaylistIds[playlist.name] = {
					'id': playlist.id
				};
			};

			setPlaylistNames(tempPlaylistNames);
			setPlaylistIds(tempPlaylistIds)
			setSelectedPlaylist(tempPlaylistNames[0]);
		}).catch((error) => {
			console.send(error);
		});
	}, [accessToken]);

	useEffect(() => {
		if (selectedPlaylist === '') return;

		axios.get('/get_playlist_tracks', {
			params: {
				access_token: accessToken,
				id: playlistIds[selectedPlaylist].id
			}
		}).then((response) => {
			const trackIds = response.data.map((data) => {
				return data.track.id;
			});

			const joinedTrackIds = trackIds.join(',');
			setPlaylistTrackIds(joinedTrackIds);

			const preTrackInformation = {}; 
			response.data.map((data) => {
				preTrackInformation[data.track.id] = {
					'name': data.track.name,
					'artist': data.track.artists[0].name,
					'album': data.track.album.name,
					'popularity': data.track.popularity
				};
			});

			setTrackInformation(preTrackInformation);
		}).catch((error) => {
			console.log(error);
		});
	}, [selectedPlaylist]);

	useEffect(() => {
		if (playlistTrackIds === '') return;

		axios.get('/get_audio_features', {
			params: {
				access_token: accessToken,
				track_ids: playlistTrackIds
			}
		}).then((response) => {
			const data = response.data;

			const tempCompiledInformation = [];
			for (const track of data) {
				const tempTrackId = track.id;

				const tempTrack = {
					'acousticness': track.acousticness,
					'danceability': track.danceability,
					'energy': track.energy,
					'instrumentalness': track.instrumentalness,
					'liveness': track.liveness,
					'loudness': track.loudness,
					'speechiness': track.speechiness,
					'tempo': track.tempo,
					'valence': track.valence,
					'name': trackInformation[tempTrackId].name,
					'artist': trackInformation[tempTrackId].artist,
					'album': trackInformation[tempTrackId].album,
					'popularity': trackInformation[tempTrackId].popularity
				};
				tempCompiledInformation.push(tempTrack);
			};
			setCompiledInformation(tempCompiledInformation);
		}).catch((error) => {
			console.log(error);
		});
	}, [playlistTrackIds])

	return (
		<div className="App">
			{accessToken ?
				<Dashboard
					playlistNames={playlistNames}
					selectedPlaylist={selectedPlaylist}
					selectedPlaylistTracks={compiledInformation}
					chartKey={chartKey}
					handlePlaylistChange={handlePlaylistChange}
					handleKeyChange={handleKeyChange}
				/> :
				<Login />
			}
		</div>
	);
}

export default App;
