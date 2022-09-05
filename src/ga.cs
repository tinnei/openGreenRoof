public static Random rnd = new Random();
public static bool init = true;

public static Point3d rndPt1;
public static Point3d rndPt2;
public static Point3d rndPt3;
public static List<Point3d> rndPts = new List<Point3d>();

public static double maxX = 100.0;
public static double maxY = 100.0;
public static List<Circle> circles = new List<Circle>();

public static int popNum = 100;
public static int numRows = (int) Math.Sqrt(popNum);

public static Population p;

// section 1: genotyype, phenotype, individual, population
// section 2: offspring, fitness criteria, evaluation, add to evolution chain

if (init || reset) {
    p = new Population();
    rndPts.Clear();


    if (ptMode == 0) {
        rndPt1 = pt1;
        rndPt2 = pt2;
        rndPt3 = pt3;
    } else if (ptMode == 1) {
        rndPt1 = new Point3d(rnd.Next(boundX), rnd.Next(boundY), 0);
        rndPt2 = new Point3d(rnd.Next(boundX), rnd.Next(boundY), 0);
        rndPt3 = new Point3d(rnd.Next(boundX), rnd.Next(boundY), 0);
    }

    rndPts.Add(rndPt1);
    rndPts.Add(rndPt2);
    rndPts.Add(rndPt3);

    init = false;
    reset = false;
}

p.evolve();
circles.Clear();
for (int i = 0; i < p.pop.Length; ++i) {
    p.pop[i].draw(i);
}

if (ptMode == 1) {
    A = rndPts;
}
B = circles;


public class Genotype {
    public int[] genes;

    public Genotype() {
        genes = new int[4];
        for (int i = 0; i < genes.Length; i++) {
            genes[i] = (int) rnd.Next(-128, 128);
        }
    }

    public void mutate() {
        for (int i = 0; i < genes.Length; i++) {
            if (rnd.Next(100) < 5) {
                genes[i] = (int) rnd.Next(-128, 128);
            }
        }
    }
}

public class Phenotype {
    public Point3d center;
    public double i_Px;
    public double i_Py;

    public Phenotype(Genotype g) {
        i_Px = (g.genes[0] * maxX / 128.0);
        i_Py = (g.genes[1] * maxY / 128.0);
        center = new Point3d(i_Px, i_Py, 0);
    }

    public void draw(int i) {
        double radius = center.DistanceTo(rndPt1);
        Circle circle = new Circle(center, radius);
        circles.Add(circle);
    }

    // Fitness definition: optimal circle should be the circle that the three points lie in
    public double evaluate() {
        double fitness = 0.0;

        double r1 = center.DistanceTo(rndPt1);
        double r2 = center.DistanceTo(rndPt2);
        double r3 = center.DistanceTo(rndPt3);

        // FITNESS FORUMLAR
        // this formular pushes the point to be on the radius of the circle
        // 1. in best scenario, r1 = r2 = r3, thus
        //    in the desired result 1/(rX / rY) should be = 1
        // 2. knowing this, we want to reduce fitness when rX is different from rY
        //    to get all three point closer to be on the circle over iterations.
        //    We do this by subtracting the differences with 1, which makes (1-1/(rX / rY))
        //    This means the more different rX is from rY, the resulting number will be bigger, thus lesser the fitness
        // 3. Math.Pow is just here to raise the overall number so the solution converges faster
        // :D
        fitness -= Math.Pow((1-1/(r1 / r2)),2);
        fitness -= Math.Pow((1-1/(r2 / r3)),2);
        fitness -= Math.Pow((1-1/(r3 / r1)),2);
        fitness -= Math.Pow(1-1/((r1+r2+r3) / (3*r1)),2);
        fitness -= Math.Pow(1-1/((r1+r2+r3) / (3*r2)),2);
        fitness -= Math.Pow(1-1/((r1+r2+r3) / (3*r3)),2);

        // since now the solution boundary expanded, we should slowly constain the circle to be smaller
        // but not too drastic by adding Math.Sqrt so the number doesn't affect the condition above
        fitness -= Math.Sqrt((r1+r2+r3));

        return fitness;
    }
}

public class Individual : IComparable {
    public Genotype i_geno;
    public Phenotype i_pheno;
    public double i_fitness;

    public Individual() {
        i_geno = new Genotype();
        i_pheno = new Phenotype(i_geno);
        i_fitness = 0;
    }

    public void draw(int i) {
        i_pheno.draw(i);
    }

    public void evaluate() {
        i_fitness = i_pheno.evaluate();
    }

    public int CompareTo(Object objI) {
        Individual iToCompare = (Individual) objI;

        if (i_fitness < iToCompare.i_fitness) {
            return -1;
        }

        else if (i_fitness < iToCompare.i_fitness) {
            return 1;
        }
        return 0;
    }

}

public class Population {
    public Individual[] pop;

    public Population() {
        pop = new Individual[popNum];

        for (int i = 0; i < popNum; ++i) {
            pop[i] = new Individual();
            pop[i].evaluate();
        }

        // worst is at 1, best is at 1000
        Array.Sort(pop);
    }

    public void evolve() {
        // breed a, b
        // mutate to x
        Individual a, b, x;

        for (int i = 0; i < popNum; i++) {
            a = selectIndividual();
            b = selectIndividual();

            x = breed(a, b);
            pop[0] = x;
            pop[0].evaluate();

            Array.Sort(pop);
        }

    }

    public Individual selectIndividual() {
        // select a number closer to 1 than to 0 - most likely different
        int which = (int) Math.Floor(((double) popNum - 1e-3) * (1.0 - Math.Pow(rnd.NextDouble(), 2)));
        return pop[which];
    }

}

public static Genotype crossover(Genotype a, Genotype b) {
    Genotype c = new Genotype();
    // 50/50 chance for a or b
    for (int i = 0; i < c.genes.Length; i++) {
        if (rnd.NextDouble() < 0.5) {
            c.genes[i] = a.genes[i];
        } else {
            c.genes[i] = b.genes[i];
        }
    }
    return c;
}

public static Individual breed (Individual a, Individual b) {
    Individual c = new Individual();

    // crossover
    c.i_geno = crossover(a.i_geno, b.i_geno);

    // mutation
    c.i_geno.mutate();

    c.i_pheno = new Phenotype(c.i_geno);
    return c;
}

