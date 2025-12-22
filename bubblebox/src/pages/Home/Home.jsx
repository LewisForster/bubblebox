import Navbar from "../../components/navbar/Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <Navbar></Navbar>
      <header className="header">
        <h1 className="header">Bubblebox</h1>
        <p>The best task tracker!</p>
      </header>
    </div>
  );
}
export default Home;
