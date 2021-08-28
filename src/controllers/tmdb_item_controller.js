import { get } from '../helpers/axios_config';
import axios from 'axios';
import config from '../config';
import { getMovieObject } from '../helpers/movieHeper';
import { getTvObject } from '../helpers/tvHelper';
const debug = require('debug')('app:tmdb');

export const item_search_multi = async (req, res, next) => {

  const api_key = config.TMDB_API_KEY;

  // PARAMS
  const type = req.params.type;
  const itemId = req.params.itemId;
  const lang = req.params.lang;

  // ROUTE
  const tmdbRoute = `https://api.themoviedb.org/3/${type}`;
  const key = `api_key=${api_key}`;
  const language = `language=${lang}`;
  const append_video = `&append_to_response=videos&include_video_language=${lang}`;
  const route = `${tmdbRoute}/${itemId}?${key}&${language}&${append_video}`;

  // JUSTWATCH
  const justwatch_route = `${tmdbRoute}/${itemId}/watch/providers?${key}`;
  const langParts = lang.split("-");
  const countryCode = langParts[1];

  debug(`Type: ${type}`);

  try {

    let data;
    let message;

    // use Promisse.all ?
    const response = await axios(get(route));
    const justwatch_response = await axios(get(justwatch_route));

    const providers = justwatch_response.data.results;
    let localProviders = providers[countryCode];
    if (!localProviders) localProviders = [];
    debug(`Local Providers: ${localProviders}`);


    if (type === 'movie') {
      data = await getMovieObject(response.data, lang);
      message = `Found movie: ${data.title}`;
    }
    else {
      data = await getTvObject(response.data, lang);
      message = `Found tv show: ${data.name}`;
    }

    return res.json({
      message: message,
      reponse: data,
      providers: localProviders
    });
  }
  catch(error) {
    debug(error);
    return next(error);
  }

};
