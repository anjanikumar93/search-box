import React, { Component } from "react";
import PropTypes from "prop-types";
import Suggestions from "./Suggestions";
import SearchIcon from "./../../assets/icons/Search";

const keyCodes = {
  ENTER: 13,
  ESCAPE: 27,
  UP: 38,
  DOWN: 40
};

const initialState = {
  highlightedItem: -1,
  searchTerm: "",
  suggestions: [],
  value: "",
  selectedObj: null
};

class SearchBar extends Component {
  state = { ...initialState };

  componentDidMount() {
    this.props.autoFocus && this.refs.input.focus();
    this.setState({
      value: this.props.defaultValue || ""
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  normalizeInput = () => this.state.value.toLowerCase().trim();

  autosuggest = () => {
    const searchTerm = this.normalizeInput();
    if (!searchTerm) return;
    new Promise((resolve, reject) => {
      this.props.onChange(searchTerm, resolve, reject);
    }).then(suggestions => {
      if (!this.state.value) return;
      this.setState({
        highlightedItem: -1,
        searchTerm,
        suggestions
      });
    });
  };

  scroll = key => {
    const { highlightedItem: item, suggestions } = this.state;
    const lastItem = suggestions.length - 1;
    let nextItem;

    if (key === keyCodes.UP) {
      nextItem = item <= 0 ? lastItem : item - 1;
    } else {
      nextItem = item === lastItem ? 0 : item + 1;
    }

    this.setState({
      highlightedItem: nextItem,
      value: suggestions[nextItem].Title,
      selectedObj: suggestions[nextItem]
    });
  };

  search = () => {
    if (!this.state.value) return;
    clearTimeout(this.timer);
    this.refs.input.blur();
    const { highlightedItem, suggestions } = initialState;
    this.setState({
      highlightedItem,
      suggestions,
      value: this.state.selectedObj.Title
    });
    this.props.onSearch(this.state.selectedObj);
  };

  handleChange = e => {
    clearTimeout(this.timer);
    const input = e.target.value;
    if (!input) return this.setState(initialState);
    this.setState({ value: input, selectedObj: null });
    this.timer = setTimeout(() => this.autosuggest(), this.props.delay);
  };

  onKeyDown = e => {
    const key = e.which || e.keyCode;
    switch (key) {
      case keyCodes.UP:
      case keyCodes.DOWN:
        e.preventDefault();
        this.scroll(key);
        break;

      case keyCodes.ENTER:
        this.search();
        break;

      case keyCodes.ESCAPE:
        this.refs.input.blur();
        break;
      default:
        break;
    }
  };

  onSelection = selectedObj => {
    this.setState(
      {
        value: selectedObj.Title,
        selectedObj
      },
      () => this.search()
    );
  };

  onSearch = e => {
    e.preventDefault();
    this.search();
  };

  render() {
    const {
      isFocused,
      suggestions,
      value,
      searchTerm,
      highlightedItem
    } = this.state;

    return (
      <div className="search-bar-wrapper">
        <div
          className={`
            search-bar-field
            ${isFocused ? "is-focused" : ""}
            ${suggestions.length > 0 ? "has-suggestions" : ""}
          `}
        >
          <input
            className="search-bar-input"
            id="search-bar-input"
            name="search"
            type="text"
            maxLength="100"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            ref="input"
            value={value}
            placeholder="Search here..."
            onChange={this.handleChange}
            onBlur={() => this.setState({ isFocused: false, suggestions: [] })}
            onKeyDown={suggestions && this.onKeyDown.bind(this)}
            onFocus={() => this.setState({ isFocused: true })}
          />
          <button
            className="icon search-bar-submit"
            type="submit"
            onClick={this.onSearch}
          >
            <SearchIcon />
          </button>
        </div>
        {suggestions.length > 0 && (
          <Suggestions
            searchTerm={searchTerm}
            suggestions={suggestions}
            highlightedItem={highlightedItem}
            onSelection={this.onSelection}
          />
        )}
      </div>
    );
  }
}

SearchBar.propTypes = {
  autoFocus: PropTypes.bool,
  delay: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  defaultValue: PropTypes.string
};

SearchBar.defaultProps = {
  autoFocus: true,
  delay: 200
};

export default SearchBar;
