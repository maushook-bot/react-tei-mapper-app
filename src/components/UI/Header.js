import "./Header.css";

function Header(props) {
  const classes = 'header ' + props.className;
  return (
  <div className={classes}>
      <h1>Technology Enterprise Integration</h1>
      {props.children}
  </div>
  );
}

export default Header;