const debug = require('debug')('app:tv');

export const getTvObject = (tvData, lang) => {

  //"poster_sizes":["w92","w154","w185","w342","w500","w780","original"]
  //"logo_sizes":["w45","w92","w154","w185","w300","w500","original"]
  //"secure_base_url":"https://image.tmdb.org/t/p/"
  // statuses: ['Returning Series', 'Planned', 'In Production', 'Ended', 'Canceled', 'Pilot']
  // Decidir se mantenho "networks"

  debug('Preparing tv show object...');

  // GENRES
  const genresObjArray = tvData.genres;
  const genres = [];

  for (let i = 0; i < genresObjArray.length; i++) {
    genres.push(genresObjArray[i].name);
  }

  // LINK
  const link_original_name = tvData.original_name.trim().toLowerCase();
  link_original_name.replace(" ", "-");

  //Created By
  const creatorsObjArray = tvData.created_by;
  const creators = [];

  for (let i = 0; i < creatorsObjArray.length; i++) {
    creators.push(creatorsObjArray[i].name);
  }

  return new Promise((resolve, reject) => {
    try{

      const show = {
        id: tvData.id,
        name: tvData.name,
        original_name: tvData.original_name,
        status: tvData.status,
        in_production: tvData.in_production,
        first_air_date: tvData.first_air_date,
        last_air_date: tvData.last_air_date,
        created_by: creators,
        number_of_seasons: tvData.number_of_seasons,
        genres: genres,
        homepage: tvData.homepage,
        networks: tvData.networks,
        tagline: tvData.tagline,
        overview: tvData.overview,
        poster: `https://image.tmdb.org/t/p/w342${tvData.poster_path}`,
        tmdb_link: `https://www.themoviedb.org/tv/${tvData.id}-${link_original_name}?language=${lang}`
      };

      resolve(show);
    }
    catch(error) {
      reject(error);
    }

  });

};
