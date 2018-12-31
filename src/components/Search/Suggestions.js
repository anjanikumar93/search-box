import React, { Fragment } from "react";
import PropTypes from "prop-types";

class Suggestions extends React.Component {
  touchedMoved = false;
  state = {
    activeItem: -1
  };

  onTouchStart = index => {
    this.timer = setTimeout(() => {
      this.setState({ activeItem: index });
    }, 200);
  };

  onTouchMove = () => {
    clearTimeout(this.timer);
    this.touchedMoved = true;
    this.setState({ activeItem: -1 });
  };

  onTouchEnd = selectedObj => {
    if (!this.touchedMoved) {
      setTimeout(() => {
        this.props.onSelection(selectedObj);
      }, 200);
    }
    this.touchedMoved = false;
  };

  render() {
    const { highlightedItem, suggestions } = this.props;
    const { activeItem } = this.state;

    return (
      <ul
        className="search-bar-suggestions"
        onMouseLeave={() => this.setState({ activeItem: -1 })}
      >
        {suggestions &&
          suggestions.slice(0, 5).map((suggestion, index) => (
            <li
              className={`suggestion-item ${
                highlightedItem === index || activeItem === index
                  ? "highlighted"
                  : ""
              }`}
              key={index}
              onClick={() => this.props.onSelection(suggestion)}
              onMouseEnter={() => this.setState({ activeItem: index })}
              onMouseDown={e => e.preventDefault()}
              onTouchStart={() => this.onTouchStart(index)}
              onTouchMove={() => this.onTouchMove()}
              onTouchEnd={() => this.onTouchEnd(suggestion)}
            >
              {Object.keys(suggestion).length === 0 &&
              suggestion.constructor === Object ? (
                <span>Please type more to fetch results</span>
              ) : (
                <Fragment>
                  <strong>{suggestion.Title}</strong>
                  {/* Doing this because search doesn't returns any description. */}
                  <span>{`This movie was released in ${suggestion.Year}`}</span>
                </Fragment>
              )}
            </li>
          ))}
      </ul>
    );
  }
}

Suggestions.propTypes = {
  highlightedItem: PropTypes.number,
  suggestions: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired
};

export default Suggestions;
