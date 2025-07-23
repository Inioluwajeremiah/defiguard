import Footer from "../../components/footer";
import Header from "../../components/header";
import "./index.css";
import DecentralizedExchangeSection from "../../components/dex";

function DecentralizedExchange() {
  return (
    <div>
      <div className="header_section">
        <Header />
      </div>
      <DecentralizedExchangeSection />
      <Footer />
    </div>
  );
}

export default DecentralizedExchange;
