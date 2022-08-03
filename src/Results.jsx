import { Link } from 'react-router-dom';
import styles from './styles/result.module.css';

function Results() {
    var objWaterSavings;
    var objEnergySavings;
    var objCarbonSequestered;
    var objCostSavings;

    return (
        <div className={styles.resultSidebar}>
            <div className={styles.resultList}>
                <h1><strong>Optimized results here</strong></h1>
                <br />
                <h1><i>Loading your results here...</i></h1>
                <br />
                <h1>Water saving: {objWaterSavings}</h1>
                <h1>Energy saving: {objEnergySavings}</h1>
                <h1>Carbon sequester: {objCarbonSequestered}</h1>
                <h1>Cost saving: {objCostSavings}</h1>
            </div>
            <div className={styles.buttonGroup}>
                <Link to="/grassfield"><button className={styles.darkButton_Small}>Try another</button></Link>
                <Link to="/logistics"><button className={styles.darkButton_Small}>Confirm Plan</button></Link>
            </div>
        </div>
    );
}

export default Results;