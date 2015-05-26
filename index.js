import Bacon, { Bus } from 'baconjs';
import React, { Component, PropTypes } from 'react';
import fetch from 'imports?self=>{},es6p=es6-promise,Promise=>es6p.Promise!exports?self.fetch!whatwg-fetch';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = { stream: new Bus(), results: new Bus() };
  }


  componentDidMount() {
    let searchWikipedia = (term) => fetch(`http://en.wikipedia.org/w/api.php?action=opensearch&search=${term}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function(response) {
        return response.json();
      });

    this.state.stream
      .filter((v) => v.length > 2)
      .debounce(250) // ms
      .flatMapLatest((term) => Bacon.fromPromise(searchWikipedia(term)))
      .onValue((response) => this.setState({
        results: Bacon.zipAsArray(
          Bacon.fromArray(response[1]),
          Bacon.fromArray(response[2]),
          Bacon.fromArray(response[3])
        )
      }));
  }


  render() {
    let results = [];

    this.state.results.onValue((value) => results.push(value));

    return (
      <div>
        <SearchInput stream={this.state.stream} />

        <ul>
          {results.map((result) => (
            <li key={result[0]}>
              <a href={result[2]} target="_blank">{result[0]}</a>
              <br />
              <small>{result[1]}</small>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}


class SearchInput extends Component {
  static propTypes = {
    stream: PropTypes.instanceOf(Bus).isRequired
  }


  constructor(props) {
    super(props);
    this.state = { value: '' };
  }


  render() {
    return (
      <div>
        <input
          type="search"
          ref="input"
          placeholder="Search Wikipedia"
          value={this.state.value}
          onChange={() => this.handleChange()}
        />
      </div>
    );
  }


  handleChange() {
    let value = React.findDOMNode(this.refs.input).value;

    this.setState({ value });
    this.props.stream.push(value);
  }
}


React.render(<App />, document.body);


window.searchWikipedia = new App().searchWikipedia;
