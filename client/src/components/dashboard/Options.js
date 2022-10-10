function Options({ playlists, handlePlaylistChange }) {
  const playlistOptions = Object.keys(playlists).map((title) => {
    return <option value={title}>{title}</option>
  });

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