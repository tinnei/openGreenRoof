import { useEffect } from 'react';
import styles from './styles/intro.module.css';

function App() {

  return (
    <div>
      <div className={styles.header}>
        <strong><h2>openGreenRoof</h2></strong>
      </div>

      <div className={styles.subHeader}>
        <strong><h4>Let's bring more green roofs to cities, together</h4></strong>
        <h4>Coming September 2022</h4>
      </div>

      <div className={styles.introBox}>
        <br></br>
        <span className={styles.subText}>
          <h5><strong>So why do we need more green roofs?</strong><br />
            For starter, <a href="https://www.youtube.com/watch?v=FlJoBhLnqko" target="_blank">this video by NPR's Beck Harlan and Kara Frame</a> did a great job explaining why green roofs are great for cities.
            <br />
            <br />

            <strong>TLDR, here's a short list of benefits:</strong>
            <br />
            - reduce heat island effect <br />
            - improve indoor climate <br />
            - ease surface runoff <br />
            - bring back bio-diversity <br />
            - more accessible nature <br />

            <br />
            <strong>How do we build more green roofs?</strong>
            <br />
            Thanks to wider awareness, there are already many existing companies dedicated to help builders
            transform unused roof spaces to green roofs. OpenGreenRoof as a public tool aims to take the
            effort further, by providing visibility and optimization engine to help identify more usable spaces,
            maximize environmental benefits, and get actionable next steps for anyone whos want to participate in this movement.

          </h5>
        </span>
      </div>

      <div className={styles.footer}>
        <strong>V1 Location:</strong> London | <strong> Supporting </strong>
        <a href="https://www.london.gov.uk/sites/default/files/the_london_plan_2021.pdf" target="_blank">
          London Plan 2021 - Policy G5
        </a><br/>
        Project by <a href="http://hellowelcomeback.online/" target="_blank">Tinnei</a>. Advised by UCL Bartlett Architectural Computation.
      </div>
    </div>
  );
}

export default App;
