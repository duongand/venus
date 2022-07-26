function Options({ playlistItems }) {
    const playlistOptions = playlistItems.map((playlist) => (
        <option value={playlist}>{playlist}</option>
    ));

    return (
        <select className="dashboard--selection">
            {playlistOptions}
        </select>
    );
};

export default Options;