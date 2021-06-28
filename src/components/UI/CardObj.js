import "./CardObj.css";

function CardObj(props) {
  const classes = 'cardobj ' + props.className;
  return <div className={classes}>{props.children}</div>;
}

export default CardObj;
