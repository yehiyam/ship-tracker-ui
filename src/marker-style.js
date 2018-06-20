export default `
.station:before {
  content: ' ';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 8px;
  margin: 0 8px;
}
.station {
  border-radius: 20px;
  padding-right: 12px;
  margin: -12px;
  color: transparent;
  line-height: 24px;
  font-size: 13px;
  white-space: nowrap;
}
.station span {
  display: none;
}
.station:hover {
  background: rgba(0,0,0,0.8);
  color: #fff;
}
.station:hover span {
  display: inline-block;
}


.hourly:before {
  content: ' ';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #8082e5;
  border-radius: 8px;
  margin: 0 8px;
}
.hourly {
  border-radius: 20px;
  padding-right: 12px;
  margin: -12px;
  color: transparent;
  line-height: 24px;
  font-size: 13px;
  white-space: nowrap;
}
.hourly span {
  display: none;
}
.hourly:hover {
  background: rgba(0,0,0,0.8);
  color: #fff;
}
.hourly:hover span {
  display: inline-block;
}
`;