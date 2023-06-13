import { useNavigate } from "react-router-dom";
import "./Application.css";
import withAuth from "../../hoc/withAuth";

const Application = () => {

    const navigate = useNavigate();

    const TilbakeKnapp = () => {
      navigate('/Profil');
    };

    return (
        <div className="application">
            <h2>Her er dine søknader</h2>
            <button className="applicationKnapp" onClick={TilbakeKnapp}>Tilbake til profil</button>
        </div>
    )
}
export default withAuth(Application);