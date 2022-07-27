function Options({ playlistItems }) {
    const playlistOptions = playlistItems.map((playlist) => (
        <option value={playlist}>{playlist}</option>
    ));

    return (
        <>
            <label for="dashboard--selection">Chosen playlist: </label>
            <select id="dashboard--selection" className="dashboard--selection">
                {playlistOptions}
            </select>
        </>
    );
};

export default Options;