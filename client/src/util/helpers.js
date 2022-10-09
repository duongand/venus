export function compilePlaylistInformation(response) {
  const playlistInformation = {};
  for (const playlist of response) {
    playlistInformation[playlist.name] = playlist.id;
  };
  
  return playlistInformation;
}