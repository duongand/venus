function Options({ playlistNames, handlePlaylistChange }) {
    const playlistOptions = playlistNames.map((playlist) => (
        <option value={playlist}>{playlist}</option>
    ));

    return (
        <>
            <label for="dashboard--selection">Playlist: </label>
            <select id="dashboard--selection" className="dashboard--selection" onChange={handlePlaylistChange}>
                {playlistOptions}
            </select>
        </>
    );
};

export default Options;