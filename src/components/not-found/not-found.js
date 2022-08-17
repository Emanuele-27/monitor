import ImageNotFound from 'assets/not-found.webp';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "2rem 10rem 2rem 20%" }}>
            <img src={ImageNotFound} alt="not-found" />
            <div style={{ flexGrow: 2 }}>
                <p style={{ fontWeight: 700, fontSize: "2rem", marginBottom: "3rem" }}>Ooops, la pagina ricercata non esiste <br /> oppure è attualmente offline.</p>
                <Link to="/content">
                    <button type="button" className="btn btn-primary" title="Torna alla home">
                        TORNA ALLA HOME
                    </button>
                </Link>
            </div>
        </div>
    );
}