import { Link } from 'react-router-dom';
import styles from './styles/intro.module.css';

function Logistics() {

    return (
        <div>
            Display companies
            <Link to="/map"><button className={styles.button}>Back to Map</button></Link>
        </div>
    );
}

export default Logistics;