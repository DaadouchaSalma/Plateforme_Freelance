import { Resolver,Query } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Candidature } from "src/candidature/candidature.entity";
import { Offer } from "src/offre/offer.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Stats } from "./stats.type";
import { CategorieStats } from "./categoriStat";
import { TopFreelancerStat } from "./topFreelancerStat";
import { CompetenceStat } from "./competenceStat";
import { FreelancerCompetence } from "src/freelancer-competence/freelancer-competence.entity";
import { Freelancer } from "src/freelancer/freelancer.entity";
import { WeeklyActivityStat } from "./weeklyActivityStat";
import { DomaineStat } from "./domaineStat";
import { Client } from "src/client/client.entity";


@Resolver()
export class StatsResolver {
  
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Offer)
    private offerRepo: Repository<Offer>,
    @InjectRepository(Candidature)
    private candidatureRepo: Repository<Candidature>,
    @InjectRepository(FreelancerCompetence)
    private freelancerCompetenceRepo: Repository<FreelancerCompetence>,
    @InjectRepository(Freelancer)
    private freelancerRepo: Repository<Freelancer>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  @Query(() => Stats)
  async getStats(): Promise<Stats> {
    const [clients, freelancers, activeOffers, candidatures] = await Promise.all([
      this.userRepo.count({ where: { role: 'CLIENT' } }),
      this.userRepo.count({ where: { role: 'FREELANCER' } }),
      this.offerRepo.count({ where: { status:'Active'} }),
      this.candidatureRepo.count({ where: { statut:'En attente'} }),
    ]);

    return {
      clients,
      freelancers,
      activeOffers,
      candidatures,
    };
  }
  @Query(() => [CategorieStats])
  async getOffresParCategorie(): Promise<CategorieStats[]> {
    const rawData = await this.offerRepo
      .createQueryBuilder('offer')
      .leftJoin('offer.categorie', 'categorie')
      .select('categorie.title', 'categorie')
      .addSelect('COUNT(offer.id)', 'nombre')
      .groupBy('categorie.title')
      .getRawMany();

    return rawData.map(item => ({
      categorie: item.categorie,
      nombre: parseInt(item.nombre, 10),
    }));
  }
  @Query(() => [TopFreelancerStat])
  async getTopFreelancers(): Promise<TopFreelancerStat[]> {
    const raw = await this.candidatureRepo
      .createQueryBuilder('c')
      .leftJoin('c.freelancer', 'f')
      .select('f.nom', 'nom')
      .addSelect('f.prenom', 'prenom')
      .addSelect('f.photo', 'photo')
      .addSelect('COUNT(c.id)', 'nombre')
      .where('c.statut = :status', { status: 'Accepté' })
      .groupBy('f.id')
      .addGroupBy('f.nom')
      .addGroupBy('f.prenom')
      .addGroupBy('f.photo')
      .orderBy('nombre', 'DESC')
      .limit(5)
      .getRawMany();

    return raw.map(r => ({
      nom: r.nom,
      prenom: r.prenom,
      photo: r.photo,
      nombre: parseInt(r.nombre, 10),
    }));
  }
  @Query(() => [CompetenceStat])
async getCompetenceStats(): Promise<CompetenceStat[]> {
  const totalFreelancers = await this.freelancerRepo.count();

  const rawStats = await this.freelancerCompetenceRepo
    .createQueryBuilder('fc')
    .leftJoin('fc.competence', 'competence')
    .select('competence.nom', 'nom')
    .addSelect('COUNT(DISTINCT fc.freelancerId)', 'freelancerCount')
    .groupBy('competence.nom')
    .getRawMany();

  console.log('rawStats:', rawStats);

  return rawStats.map((row) => {
    const count = parseInt(row.freelancerCount || '0', 10);
    return {
      nom: row.nom,
      count,
      percentage: totalFreelancers > 0 ? (count / totalFreelancers) * 100 : 0,
    };
  });
}

@Query(() => [WeeklyActivityStat])
async getActivityByWeekday(): Promise<WeeklyActivityStat[]> {
  const offerStats = await this.offerRepo
    .createQueryBuilder('offer')
    .select("DAYNAME(offer.createdAt)", 'day')
    .addSelect('COUNT(*)', 'offers')
    .groupBy("DAYNAME(offer.createdAt)")
    .getRawMany();

  const candidatureStats = await this.candidatureRepo
    .createQueryBuilder('candidature')
    .select("DAYNAME(candidature.dateApplication)", 'day')
    .addSelect('COUNT(*)', 'candidatures')
    .groupBy("DAYNAME(candidature.dateApplication)")
    .getRawMany();

  const dayMap: { [key: string]: string } = {
    Monday: 'Lundi',
    Tuesday: 'Mardi',
    Wednesday: 'Mercredi',
    Thursday: 'Jeudi',
    Friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche',
  };

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const stats: WeeklyActivityStat[] = allDays.map((engDay) => {
    const offer = offerStats.find(os => os.day === engDay);
    const candid = candidatureStats.find(cs => cs.day === engDay);

    return {
      day: dayMap[engDay],
      offers: parseInt(offer?.offers || '0', 10),
      candidatures: parseInt(candid?.candidatures || '0', 10),
    };
  });

  return stats;
}

@Query(() => [DomaineStat])
async getClientStatsByDomaine(): Promise<DomaineStat[]> {
  const domaines = [
    'Développement logiciel',
    'Marketing digital',
    'Design graphique',
    'Éducation & Formation',
    'Santé',
    'Finance'
  ];

  const stats: DomaineStat[] = [];

  for (const domaine of domaines) {
    const total = await this.clientRepo.count({
      where: { domaine }
    });

    stats.push({
      domaine,
      totalClients: total,
    });
  }

  return stats;
}

}
