import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './styles/result.module.css';

// TODO - Aug 1 to Aug 15
// - turn this page into optimization engine
//   on load, start putting the data into the equation
// https://www.thisdot.co/blog/quick-intro-to-genetic-algorithms-with-a-javascript-example

function Results() {
    // const location = useLocation();
    // const { veg } = location.state;

    var objWaterSavings;
    var objEnergySavings;
    var objCarbonSequestered;
    var objCostSavings;

    useEffect(() => {
        console.log("------ in useEffect!");
        generate(100, 'boo', 0.05, 5);
    });

    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // generate combination
    function generateLetter() {
        const code = random(97, 123); // ASCII char codes
        return String.fromCharCode(code);
    }

    function getWaterSavings(soil, veg, area) {
        return 1;
    }

    function getEnergySavings(soil, veg, area) {
        return 1;
    }

    function getCarbonTotal(veg, area) {
        return 1;
    }

    function getCost(soil, veg, area) {
        return 1;
    }

    // Member will be a combination of veg and soil mix
    class Member {
        constructor(target) {
            this.target = target;
            this.keys = [];

            // combination of vegetation %
            // [flower A, 20%, soilA], [flowerB, 30%, soilB]
            for (let i = 0; i < target.length; i += 1) {
                this.keys[i] = generateLetter();
            }
        }

        // a value that will be used to compare
        // we'll add water, energy, carbon, cost here
        fitness() {
            let match = 0;
            for (let i = 0; i < this.keys.length; i += 1) {
                if (this.keys[i] === this.target[i]) {
                    match += 1;
                }
            }
            return match / this.target.length;

            // let objWaterSavings = getWaterSavings(soil, veg, area);
            // let objEnergySavings = getEnergySavings(soil, veg, area);
            // let objCarbonSequestered = getCarbonTotal(veg, area);
            // let objCostSavings = getCost(soil, veg, area);
            // return 1 / objCostSavings + objWaterSavings + objEnergySavings + objCarbonSequestered;
        }

        // mixing the genes to breed new one <- ??? how to apply for green roofs?
        crossover(partner) {
            const { length } = this.target;
            const child = new Member(this.target);
            const midpoint = random(0, length);
            for (let i = 0; i < length; i += 1) {
                if (i > midpoint) {
                    child.keys[i] = this.keys[i];
                } else {
                    child.keys[i] = partner.keys[i];
                }
            }
            return child;
        }

        // change up bits in the gene
        mutate(mutationRate) {
            for (let i = 0; i < this.keys.length; i += 1) {
                // If below predefined mutation rate, generate a new random letter on this position.
                if (Math.random() < mutationRate) {
                    this.keys[i] = generateLetter();
                }
            }
        }
    }

    class Population {
        constructor(size, target, mutationRate) {
            size = size || 1;
            this.members = [];
            this.mutationRate = mutationRate;

            for (let i = 0; i < size; i += 1) {
                this.members.push(new Member(target));
            }
        }

        // move population closer to fit members
        _selectMembersForMating() {
            const matingPool = [];
            this.members.forEach((m) => {
                const f = Math.floor(m.fitness() * 100) || 1;
                for (let i = 0; i < f; i += 1) {
                    matingPool.push(m);
                }
            });
            return matingPool;
        }

        // update mating pool
        _reproduce(matingPool) {
            for (let i = 0; i < this.members.length; i += 1) {
                // Pick 2 random members/parents from the mating pool
                const parentA = matingPool[random(0, matingPool.length)];
                const parentB = matingPool[random(0, matingPool.length)];

                // Perform crossover
                const child = parentA.crossover(parentB);

                // Perform mutation
                child.mutate(this.mutationRate);

                this.members[i] = child;
            }
        }

        evolve(generations) {
            for (let i = 0; i < generations; i += 1) {
                const pool = this._selectMembersForMating();
                this._reproduce(pool);
            }
        }
    }

    function generate(populationSize, target, mutationRate, generations) {
        // Create a population and evolve for N generations
        const population = new Population(populationSize, target, mutationRate);
        population.evolve(generations);

        // Get the typed words from all members, and find if someone was able to type the target
        const membersKeys = population.members.map((m) => m.keys.join(''));
        const perfectCandidatesNum = membersKeys.filter((w) => w === target);

        // Print the results
        console.log(membersKeys);
        console.log(`${perfectCandidatesNum ? perfectCandidatesNum.length : 0} member(s) typed "${target}"`);
    }


    return (
        <div className={styles.resultSidebar}>
            <div className={styles.resultList}>
                <h1><strong>Optimized results here</strong></h1>
                <br />
                <h1><i>Loading your results here...</i></h1>
                <br />
                {/* <h1>Selected veg options: {veg}</h1> */}
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