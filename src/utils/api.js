import Axios from 'axios';

export const Get = (url) => {
  return Axios.get(url)
    .then(data => data).catch(error => { throw error; });
};
