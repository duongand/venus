import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import { compilePlaylistInformation } from './util/helpers.js';

function App() {
	const [accessToken, setAccessToken] = useState(undefined);
	// const [refreshToken, setRefreshToken] = useState(null);
	const [playlistInformation, setPlaylistInformation] = useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState(undefined);
	const [playlistTracks, setPlaylistTracks] = useState(undefined);
	const [chartKey, setChartKey] = useState('artist');

	function handlePlaylistChange(event) {
		setSelectedPlaylist(event.target.value);
		setPlaylistTracks(null);
		setChartKey('artist');
	};

	function handleKeyChange(event) {
		setChartKey(event.target.value);
	};

	useEffect(() => {
		if (window.location.search) {
			const urlParams = new URLSearchParams(window.location.search);
			setAccessToken(urlParams.get('access_token'));
			// setRefreshToken(urlParams.get('refresh_token'));
			window.history.pushState({}, null, '/');
		};
	}, [])

	useEffect(() => {
		if (!accessToken) return;

		axios.get('/get_playlists', {
			params: {
				access_token: accessToken
			}
		}).then((response) => {
			setPlaylistInformation(compilePlaylistInformation(response.data));
			setSelectedPlaylist(response.data[0].name);
		}).catch((error) => {
			console.log(error);
		});
	}, [accessToken]);

	useEffect(() => {
		if (!selectedPlaylist || !accessToken) return;

		axios.get('/playlist_features', {
			params: {
				access_token: accessToken,
				id: playlistInformation[selectedPlaylist]
			}
		}).then((response) => {
			setPlaylistTracks(response.data);
		}).catch((error) => {
			console.log(error);
		});
	}, [accessToken, playlistInformation, selectedPlaylist]);

	return (
		<div className="App">
			{accessToken ?
				<Dashboard
					playlists={playlistInformation}
					selectedPlaylist={selectedPlaylist}
					playlistTracks={playlistTracks}
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
