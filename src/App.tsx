import { useState } from "react";
import "./App.css";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import LanguageIcon from "@mui/icons-material/Language";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RepeatIcon from "@mui/icons-material/Repeat";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import HearingIcon from "@mui/icons-material/Hearing";
import CloseIcon from "@mui/icons-material/Close";
import TodayIcon from "@mui/icons-material/Today";
import SearchIcon from "@mui/icons-material/Search";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TextField from "@mui/material/TextField";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Switch from "@mui/material/Switch";
import ListItemText from "@mui/material/ListItemText";

function App() {
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

  const [count, setCount] = useState(0);

  const whitespaceRegex = /\s+/;
  const formatDate = (dt: Date) => {
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  };

  // search condition models
  const [searchString, setSearchString] = useState("");
  const [filterImages, setFilterImages] = useState(false);
  const [filterVideos, setFilterVideos] = useState(false);
  const [since, setSince] = useState<Date | null>(null);
  const [until, setUntil] = useState<Date | null>(null);
  const [langJa, setLangJa] = useState(false);
  const [filterFollows, setFilterFollows] = useState(false);
  const [fromString, setFromString] = useState("");
  const [toString, setToString] = useState("");
  const [minFav, setMinFav] = useState(undefined);
  const [minRT, setMinRT] = useState(undefined);

  // handle model
  // TODO: save model to localStorage
  const clearModel = () => {
    setSearchString("");
    setFilterImages(false);
    setFilterVideos(false);
    setSince(null);
    setUntil(null);
    setLangJa(false);
    setFilterFollows(false);
    setFromString("");
    setToString("");
    setMinFav(undefined);
    setMinRT(undefined);
  };

  //building query
  const splitToSearchList = (sString: string) =>
    sString.split(whitespaceRegex).filter((it) => it);
  const splitToUserIdList = (idString: string) =>
    idString
      .split(whitespaceRegex)
      .map((it) => (it.startsWith("@") ? it.substr(1) : it))
      .filter((it) => it);
  const getFromQuery = (idString: string) => {
    const idList = splitToUserIdList(idString);
    return idList.length > 0
      ? "(" + idList.map((it) => "from:" + it).join(" OR ") + ")"
      : "";
  };
  const getToQuery = (idString: string) => {
    const idList = splitToUserIdList(idString);
    return idList.length > 0
      ? "(" + idList.map((it) => "to:" + it).join(" OR ") + ")"
      : "";
  };
  const getFilterMediaString = (
    filterImages: boolean,
    filterVideos: boolean
  ) => {
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
    if ((minFav ?? 0) > 0) {
      queryList.push("min_faves:" + minFav);
    }
    if ((minRT ?? 0) > 0) {
      queryList.push("min_retweets:" + minRT);
    }
    const queryString = queryList.filter((it) => it).join(" ");
    return queryString ? queryString : "ついったー高度検索";
  };
  const getSearchUrl = () =>
    "https://twitter.com/search?" +
    new URLSearchParams({ q: getSearchQuery() }).toString();

  // states for ui
  const [openSince, setOpenSince] = useState(false);
  const [openUntil, setOpenUntil] = useState(false);

  return (
    <div>
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
      <Grid container direction="column" style={pa10Main}>
        <Grid item style={w100}>
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
                      setSince(null);
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
                  onChange={(val: Date) => {
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
                      setUntil(null);
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
                  onChange={(val: Date) => {
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
                onChange={(event: any) => setMinFav(event.target?.value ?? 0)}
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
                onChange={(event: any) => setMinRT(event.target?.value ?? 0)}
                style={w100}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
