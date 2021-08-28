const debug = require('debug')('app:movie');

export const getMovieObject = async (movieData, lang) => {

  // statuses: Canceled, In Production, Planned, Post Production, Released, Rumored

  debug('Preparing tv show object...');

  // GENRES
  const genresObjArray = movieData.genres;
  const genres = [];

  for (let i = 0; i < genresObjArray.length; i++) {
    genres.push(genresObjArray[i].name);
  }

  // TRAILERS
  const trailerObjArray = movieData.videos.results;
  const trailer = await getMovieTrailers(trailerObjArray);

  // LINK
  const link_original_name = movieData.original_name.trim().toLowerCase();
  link_original_name.replace(" ", "-");

  return new Promise((resolve, reject) => {
    try{
      const movie = {
        id: movieData.id,
        imdb_id: movieData.imdb_id,
        genres: genres,
        homepage: movieData.homepage,
        status: movieData.status,
        title: movieData.title,
        original_title: movieData.original_title,
        tagline: movieData.tagline,
        overview: movieData.overview,
        poster: `https://image.tmdb.org/t/p/w342${movieData.poster_path}`,
        release_date: movieData.release_date,
        trailer: trailer,
        tmdb_link: `https://www.themoviedb.org/tv/${movieData.id}-${link_original_name}?language=${lang}`
      };
      resolve(movie);
    }
    catch(error) {
      reject(error);
    }

  });

};

const getMovieTrailers = (trailerObjArray) => {

  debug(trailerObjArray);

  if (trailerObjArray.length === 0) return [];
  else {
    return new Promise((resolve, reject) => {
      try{
        const trailers = [];
        const scoreTrailer = 3;
        const scoreOfficial = 3;
        const scoreMain = 1;
        const scoreTrailerInTitle = 1;


        for (let i = 0; i < trailerObjArray.length; i++) {

          if (trailerObjArray[i].site === 'YouTube') {

            const trailerTitle = trailerObjArray[i].name.toLowerCase();

            let score = 0;

            if (trailerObjArray[i].type === 'Trailer') score = score + scoreTrailer;
            if (trailerObjArray[i].official === true) score = score + scoreOfficial;
            if (trailerTitle.includes('main') ||
                trailerTitle.includes('principal') ||
                trailerTitle.includes('trailer #1') ||
                trailerTitle.includes('trailer 1')) score = score + scoreMain;
            if (trailerTitle.includes('trailer')) score = score + scoreTrailerInTitle;

            const trailer = {
              name: trailerObjArray[i].name,
              key: trailerObjArray[i].key,
              site: trailerObjArray[i].site,
              type: trailerObjArray[i].type,
              official: trailerObjArray[i].official,
              priority: score,
              url: `https://www.youtube.com/watch?v=${trailerObjArray[i].key}`
            };
            trailers.push(trailer);
          }

        }

        trailers.sort((a,b) => { return a.priority - b.priority; });
        trailers.reverse();

        debug(trailers);

        resolve(trailers[0]);
      }
      catch(error) {
        reject(error);
      }

    });
  }

};
