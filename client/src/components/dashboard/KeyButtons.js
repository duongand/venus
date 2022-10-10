function KeyButtons({ handleKeyChange }) {
  return (
    <div className="dashboard--key-buttons">
      <button className="dashboard--buttons" value="artist" id="active" onClick={handleKeyChange}>Artist</button>
      <button className="dashboard--buttons" value="album" onClick={handleKeyChange}>Album</button>
      <button className="dashboard--buttons" value="danceability" onClick={handleKeyChange}>Danceability</button>
      <button className="dashboard--buttons" value="energy" onClick={handleKeyChange}>Energy</button>
      <button className="dashboard--buttons" value="liveness" onClick={handleKeyChange}>Liveness</button>
      <button className="dashboard--buttons" value="loudness" onClick={handleKeyChange}>Loudness</button>
      <button className="dashboard--buttons" value="popularity" onClick={handleKeyChange}>Popularity</button>
      <button className="dashboard--buttons" value="speechiness" onClick={handleKeyChange}>Speechiness</button>
      <button className="dashboard--buttons" value="tempo" onClick={handleKeyChange}>Tempo</button>
    </div>
  );
};

export default KeyButtons;