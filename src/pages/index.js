import * as React from "react";
import "./global.css";
import { Helmet } from "react-helmet";
import { siteTitle, siteUrl, siteDescription, siteImage } from "../../config";
import {
  Grid,
  TextField,
  Switch,
  AppBar,
  Toolbar,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  List,
  IconButton,
  Link,
} from "@material-ui/core";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import LanguageIcon from "@material-ui/icons/Language";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import VideocamIcon from "@material-ui/icons/Videocam";
import PeopleIcon from "@material-ui/icons/People";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RepeatIcon from "@material-ui/icons/Repeat";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import HearingIcon from "@material-ui/icons/Hearing";
import CloseIcon from "@material-ui/icons/Close";
import TodayIcon from "@material-ui/icons/Today";
import SearchIcon from "@material-ui/icons/Search";
import MediaQuery from "react-responsive";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as QueryString from "querystring";

// styles
const pageStyles = {
  color: "#232129",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const pa0 = {
  padding: 0,
};

const pa10 = {
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
};

const pa10Main = {
  paddingTop: 10 + 64,
  paddingBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
};

const w100 = {
  width: "100%",
};

// utils
const whitespaceRegex = /\s+/;
const formatDate = (dt) => {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  return y + "-" + m + "-" + d;
};

const IndexPage = () => {
  // search condition models
  const [searchString, setSearchString] = React.useState("");
  const [filterImages, setFilterImages] = React.useState(false);
  const [filterVideos, setFilterVideos] = React.useState(false);
  const [since, setSince] = React.useState(undefined);
  const [until, setUntil] = React.useState(undefined);
  const [langJa, setLangJa] = React.useState(false);
  const [filterFollows, setFilterFollows] = React.useState(false);
  const [fromString, setFromString] = React.useState("");
  const [toString, setToString] = React.useState("");
  const [minFav, setMinFav] = React.useState(undefined);
  const [minRT, setMinRT] = React.useState(undefined);

  // handle model
  // TODO: save model to localStorage
  const clearModel = () => {
    setSearchString("");
    setFilterImages(false);
    setFilterVideos(false);
    setSince(undefined);
    setUntil(undefined);
    setLangJa(false);
    setFilterFollows(false);
    setFromString("");
    setToString("");
    setMinFav(undefined);
    setMinRT(undefined);
  };

  //building query
  const splitToSearchList = (sString) =>
    sString.split(whitespaceRegex).filter((it) => it);
  const splitToUserIdList = (idString) =>
    idString
      .split(whitespaceRegex)
      .map((it) => (it.startsWith("@") ? it.substr(1) : it))
      .filter((it) => it);
  const getFromQuery = (idString) => {
    const idList = splitToUserIdList(idString);
    return idList.length > 0
      ? "(" + idList.map((it) => "from:" + it).join(" OR ") + ")"
      : "";
  };
  const getToQuery = (idString) => {
    const idList = splitToUserIdList(idString);
    return idList.length > 0
      ? "(" + idList.map((it) => "to:" + it).join(" OR ") + ")"
      : "";
  };
  const getFilterMediaString = (filterImages, filterVideos) => {
    if (filterImages && filterVideos) return "filter:media";
    else if (filterImages && !filterVideos) return "filter:images";
    else if (!filterImages && filterVideos) return "filter:videos";
    else return "";
  };
  const getSearchQuery = () => {
    const queryList = [];
    queryList.push(...splitToSearchList(searchString));
    queryList.push(getFromQuery(fromString));
    queryList.push(getToQuery(toString));
    if (since) {
      queryList.push("since:" + formatDate(since));
    }
    if (until) {
      queryList.push("until:" + formatDate(until));
    }
    queryList.push(getFilterMediaString(filterImages, filterVideos));
    if (filterFollows) {
      queryList.push("filter:follows");
    }
    if (langJa) {
      queryList.push("lang:ja");
    }
    if (minFav > 0) {
      queryList.push("min_faves:" + minFav);
    }
    if (minRT > 0) {
      queryList.push("min_retweets:" + minRT);
    }
    const queryString = queryList.filter((it) => it).join(" ");
    return queryString ? queryString : "ついったー高度検索";
  };
  const getSearchUrl = () =>
    "https://twitter.com/search?" + QueryString.encode({ q: getSearchQuery() });

  // states for ui
  const [openSince, setOpenSince] = React.useState(false);
  const [openUntil, setOpenUntil] = React.useState(false);

  // app bar
  const appBar = () => {
    return (
      <AppBar position="fixed" style={pa0}>
        <Toolbar>
          <SearchIcon
            style={{ paddingRight: 10 }}
            onClick={() => window.open(getSearchUrl())}
          />
          <Link color="inherit" href={getSearchUrl()} style={w100}>
            {getSearchQuery()}
          </Link>
          <IconButton onClick={clearModel}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  };

  // main list
  const mainGrid = (colsDivision) => {
    const cols = (number) => number / colsDivision;
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={pa10Main}
      >
        <Grid item xs={cols(12)} style={w100}>
          <List style={pa0}>
            <ListItem style={pa10}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <TextField
                variant="outlined"
                margin="dense"
                label="検索ワード"
                style={w100}
                value={searchString}
                onChange={(event) => setSearchString(event.target.value)}
              />
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <PhotoCameraIcon />
              </ListItemIcon>
              <ListItemText primary="画像を検索" />
              <ListItemSecondaryAction>
                <Switch
                  checked={filterImages}
                  onChange={() => setFilterImages((f) => !f)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <VideocamIcon />
              </ListItemIcon>
              <ListItemText primary="動画を検索" />
              <ListItemSecondaryAction>
                <Switch
                  checked={filterVideos}
                  onChange={() => setFilterVideos((f) => !f)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <VerticalAlignTopIcon />
              </ListItemIcon>
              <ListItemText
                primary={(since ? formatDate(since) : "いつ") + "から"}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => setOpenSince(true)} style={pa10}>
                  <TodayIcon />
                </IconButton>
                {(since || openSince) && (
                  <IconButton
                    onClick={() => {
                      setSince(undefined);
                      setOpenSince(false);
                    }}
                    style={pa10}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            {openSince && (
              <ListItem style={pa10}>
                <Calendar
                  value={since}
                  onChange={(val) => {
                    setSince(val);
                    setOpenSince(false);
                  }}
                  maxDate={new Date()}
                  minDate={new Date(2006, 3 - 1, 21, 0, 0, 0)}
                />
              </ListItem>
            )}
            <ListItem style={pa10}>
              <ListItemIcon>
                <VerticalAlignBottomIcon />
              </ListItemIcon>
              <ListItemText
                primary={(until ? formatDate(until) : "いつ") + "まで"}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => setOpenUntil(true)} style={pa10}>
                  <TodayIcon />
                </IconButton>
                {(until || openUntil) && (
                  <IconButton
                    onClick={() => {
                      setUntil(undefined);
                      setOpenUntil(false);
                    }}
                    style={pa10}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            {openUntil && (
              <ListItem style={pa10}>
                <Calendar
                  value={until}
                  onChange={(val) => {
                    setUntil(val);
                    setOpenUntil(false);
                  }}
                  maxDate={new Date()}
                  minDate={new Date(2006, 3 - 1, 21, 0, 0, 0)}
                />
              </ListItem>
            )}
            <ListItem style={pa10}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="日本語のみ" />
              <ListItemSecondaryAction>
                <Switch
                  checked={langJa}
                  onChange={() => setLangJa((f) => !f)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="フォロー中の人のみ" />
              <ListItemSecondaryAction>
                <Switch
                  checked={filterFollows}
                  onChange={() => setFilterFollows((f) => !f)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <RecordVoiceOverIcon />
              </ListItemIcon>
              <TextField
                variant="outlined"
                margin="dense"
                label="ツイートした人のID (複数可)"
                style={w100}
                value={fromString}
                onChange={(event) => setFromString(event.target.value)}
              />
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <HearingIcon />
              </ListItemIcon>
              <TextField
                variant="outlined"
                margin="dense"
                label="ツイートされた人のID (複数可)"
                style={w100}
                value={toString}
                onChange={(event) => setToString(event.target.value)}
              />
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <TextField
                label="最小いいね数"
                type="number"
                inputProps={{ inputmode: "numeric", pattern: "[0-9]*" }}
                variant="outlined"
                margin="dense"
                value={minFav}
                onChange={(event) => setMinFav(event.target.value)}
                style={w100}
              />
            </ListItem>
            <ListItem style={pa10}>
              <ListItemIcon>
                <RepeatIcon />
              </ListItemIcon>
              <TextField
                label="最小リツイート数"
                type="number"
                inputProps={{ inputmode: "numeric", pattern: "[0-9]*" }}
                variant="outlined"
                margin="dense"
                value={minRT}
                onChange={(event) => setMinRT(event.target.value)}
                style={w100}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <head>
        <Helmet
          title={siteTitle}
          meta={[
            { name: "description", content: siteDescription },
            { property: "og:url", content: siteUrl },
            { property: "og:type", content: "article" },
            { property: "og:title", content: siteTitle },
            { property: "og:description", content: siteDescription },
            { name: "twitter:card", content: "summary" },
            { name: "twitter:creator", content: "@tomoesaturn" },
            { name: "twitter:title", content: siteTitle },
            { name: "twitter:description", content: siteDescription },
          ]}
          lang="ja"
        />
      </head>
      <main style={pageStyles}>
        {appBar()}
        <MediaQuery query="(max-width: 599px)" className="main-wrapper">
          {mainGrid(1)}
        </MediaQuery>
        <MediaQuery query="(min-width: 600px)" className="main-wrapper">
          {mainGrid(3)}
        </MediaQuery>
      </main>
    </div>
  );
};

export default IndexPage;
