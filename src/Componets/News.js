import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pagesize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
      
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - NewsHunt`;
  }

  async updateNews(){
    this.props.setProgress(10);

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d9153c50e8a84679a9f06ab78595b981&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);

  }
  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d9153c50e8a84679a9f06ab78595b981&page=1&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }


  handlePrevClick = async () => {
    
    this.setState({page: this.state.page - 1});
    this.updateNews();
  };

  handleNextClick = async () => {

    this.setState({page: this.state.page + 1});
    this.updateNews();
  };

  fetchMoreData = async() =>{

     this.setState({page: this.state.page + 1})
     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=d9153c50e8a84679a9f06ab78595b981&page=1&pageSize=${this.props.pageSize}`;
    //  this.setState({ loading: true });
     let data = await fetch(url);
     let parsedData = await data.json();
     console.log(parsedData);
     this.setState({
       articles: this.state.articles.concat(parsedData.articles),
       totalResults: parsedData.totalResults,
       loading: false,
     });
  }

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">
          NewsHunt - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
          Headlines{" "}
        </h1>

        <InfiniteScroll
        dataLength={this.state.articles.length}
        next={this.fetchMoreData}
        hasMore={this.state.articles.length !== this.state.totalResults}
        loader={<Spinner/>}
        >
        {this.state.loading && <Spinner />}
        <div className="row">
          {this.state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 100) : ""}
                  description={
                    element.description ? element.description.slice(0, 150) : ""
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                />
              </div>
            ))}
        </div>
        </InfiniteScroll> 

      </div>
    );
  }
}

export default News;
