import { get } from '../helpers/axios_config';
import axios from 'axios';
import config from '../config';
const debug = require('debug')('app:tmdb');

export const search_tmdb_multi = async (req, res, next) => {

  // TODO: pagination...

  const api_key = config.TMDB_API_KEY;
  const query = req.params.query;
  const page = req.params.page;
  const lang = req.params.lang;

  const searchRoute = 'https://api.themoviedb.org/3/search';
  const mediaType = 'multi';
  const key = `api_key=${api_key}`;
  const language = `language=${lang}`;
  const q = `query=${query}`;

  const route = `${searchRoute}/${mediaType}?${key}&${language}&${page}&include_adult=false&${q}`;

  try {
    const response = await axios(get(route));

    const page = response.data.page;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    const responseData = await responseObjectsArray(response.data.results);
    debug(responseData);

    let message;
    if (responseData.length === 0) message = 'No results';
    else message = `Search result: ${total_results} found. Page ${page} of ${total_pages}`;

    return res.json({
      message: message,
      reponse: responseData
    });
  }
  catch(error) {
    debug(error);
    return next(error);
  }

};

const responseObjectsArray = (responseData) => {

  //"poster_sizes":["w92","w154","w185","w342","w500","w780","original"]
  // Some responses have 'name' and 'first_air_date' instead of 'title' and 'release_date'

  return new Promise((resolve, reject) => {

    try{

      const responseArray = [];

      debug(`responseData length: ${responseArray.length}`);

      for (let i = 0; i < responseData.length; i++) {

        if (responseData[i].media_type !== "person") {

          const data = {
            id: responseData[i].id,
            media_type: responseData[i].media_type,
            overview: responseData[i].overview,
            title: responseData[i].title,
            release_date: responseData[i].release_date,
            poster: `https://image.tmdb.org/t/p/w185${responseData[i].poster_path}`,
            name: responseData[i].name,
            first_air_date: responseData[i].first_air_date
          };

          responseArray.push(data);

        }

      }

      resolve(responseArray);
    }
    catch(error) {
      reject(error);
    }

  });

};
