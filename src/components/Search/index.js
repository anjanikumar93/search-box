import React from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import { API } from "../../constants";
import "./styles.css";

const getData = (title) => {
  const apiPath = `${API}&s=${title}&type=movie`;
  return fetch(apiPath)
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);
};

class Search extends React.Component {
  state = {
    inputVaule: ""
  };

  searchTerms = input => {
    if (!input) return Promise.resolve([]);
    if (input.length < 3) return Promise.resolve([]);
    return getData(input).then(response => {
      let list;
      if (response && !response.Error) {
        list = response.Search;
      } else {
        list = [{}];
      }
      return list;
    });
  };

  loadOptions = (input, cb) => {
    this.searchTerms(input).then(data => {
      return cb && cb(null, data);
    });
  };

  onChange = (searchTerm, resolve, reject) => {
    this.loadOptions(searchTerm, function (err, data) {
      if (data && data.length > 0) {
        resolve(data);
      }
      reject(err);
    });
  };

  render() {
    return (
      <div className="search">
        <SearchBar
          onChange={this.onChange}
          onSearch={this.searchTerms}
          placeholder="Search..."
          defaultValue={this.state.inputVaule}
        />
      </div>
    );
  }
}

Search.propTypes = {
  showButton: PropTypes.bool
};

export default Search;
