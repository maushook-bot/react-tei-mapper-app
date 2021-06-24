import "./Header.css";

function Header(props) {
  const classes = 'header ' + props.className;
  return (
  <div className={classes}>
      <h1>Technology Enterprise Integration</h1>
      <h2>Data Pre-Migration</h2>
      {props.children}
  </div>
  );
}

export default Header;