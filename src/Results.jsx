import { Link } from 'react-router-dom';
import styles from './styles/intro.module.css';

function Results() {

    return (
        <div>
            <h1>Display modules result here</h1>
            <Link to="/logistics"><button className={styles.button}>Confirm selection</button></Link>
        </div>
    );
}

export default Results;