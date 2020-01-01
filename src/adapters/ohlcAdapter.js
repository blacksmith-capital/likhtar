const moment = require('moment');
import axios from 'axios';

export default function(args = {}) {
  return {
    baseUrl: args.baseUrl || 'http://localhost:4000/api/v1/ohlc',
    getData(venue, symbol, from, to, granularity) {
      let url = new URL(this.baseUrl);
      let params = url.searchParams
      params.set('symbol', symbol)
      params.set('from',+from)
      params.set('to', +to)
      params.set('granularity', granularity)
      params.set('venue', venue)

      return axios.get(url)
        .then(this._format)
        .catch(error => { console.error(error) });
    },

    _format(response) {
      // transform matrix into array of maps
      let data = response.data.data.map((row) =>{
        var _row = {};
        var cols = response.data.columns
        cols.map((col, i) => {
          col == "date" ?
            _row["date"] = moment(row[i]).toDate() :
            _row[col] = row[i]
        })
        return _row;
      });

      return {
        data: data
      }
    }
  }
}
