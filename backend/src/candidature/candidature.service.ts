import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Offer } from 'src/offre/offer.entity';
import { Repository } from 'typeorm';
import { Candidature } from './candidature.entity';
import { Experience } from 'src/experience/experience.entity';
import { MinimalCandidatureInput } from './candidature.input';

@Injectable()
export class CandidatureService {
    constructor(
    @InjectRepository(Candidature)
    private candidatureRepo: Repository<Candidature>,
    @InjectRepository(Freelancer)
    private freelancerRepo: Repository<Freelancer>,
    @InjectRepository(Offer)
    private offerRepo: Repository<Offer>,
    @InjectRepository(Experience)
    private experienceRepo :Repository<Experience>
  ) {}
  
/*async createCandidature(data: {
  motivation: string;
  statut: string;
  dateApplication: Date;
  freelancerId: number;
  offerId: number;
}): Promise<Candidature> {
   const offer = await this.offerRepo.findOneBy({ id: data.offerId });
  const freelancer = await this.freelancerRepo.findOne({
    where: { user: { id: data.freelancerId } },
    relations: ['user'],
  });


  if (!freelancer || !offer) {
    throw new Error("Freelancer or Offer not found");
  }

  const candidature = this.candidatureRepo.create({
    motivation: data.motivation,
    statut: data.statut,
    dateApplication: new Date(),
    freelancer,
    offer,
  });

  return this.candidatureRepo.save(candidature);
}
*/
async getCandidaturesByFreelancerId(freelancerId: number): Promise<Candidature[]> {
  return this.candidatureRepo.find({
    where: {
      freelancer: { user: { id: freelancerId } },
    },
    relations: ['freelancer', 'offer','experiences', 'offer.client','offer.categorie'], 
  });
}

async getCandidaturesByOffreId(offreId: number): Promise<Candidature[]> {
  return this.candidatureRepo.find({
    where: { offer: { id: offreId } },
    relations: ['freelancer', 'offer','freelancer.FreelancerCompetences','freelancer.FreelancerCompetences.competence','experiences'], 
  });
}

async updateStatut(candidatureId: number, statut: string): Promise<Candidature> {
  const candidature = await this.candidatureRepo.findOne({
    where: { id: candidatureId },
  });

  if (!candidature) {
    throw new NotFoundException('Candidature non trouvée');
  }

  candidature.statut = statut;
  return this.candidatureRepo.save(candidature);
}



async createCandidature(input: MinimalCandidatureInput & { freelancerId: number }): Promise<Candidature> {
  const { freelancerId, offerId, experiences, ...rest } = input;

  const freelancer = await this.freelancerRepo.findOne({
    where: { user: { id: freelancerId } },
    relations: ['user'],
  });
  if (!freelancer) {
    throw new NotFoundException('Freelancer not found for user');
  }

  const offer = await this.offerRepo.findOneBy({ id: offerId });
  if (!offer) {
    throw new NotFoundException('Offer not found');
  }

  const experienceEntities = experiences?.map(exp => this.experienceRepo.create(exp));

  const candidature = this.candidatureRepo.create({
    ...rest,
    freelancer,
    offer,
    experiences: experienceEntities,
  });

  return this.candidatureRepo.save(candidature);
}


async accepterCandidature(id: number): Promise<Candidature> {
    const candidature = await this.candidatureRepo.findOne({ where: { id } });
    
    if (!candidature) {
      throw new Error('Candidature non trouvée');
    }

    candidature.statut = 'Accepté';
    return this.candidatureRepo.save(candidature);
  }

  async rejeterCandidature(id: number): Promise<Candidature> {
    const candidature = await this.candidatureRepo.findOne({ where: { id } });
    
    if (!candidature) {
      throw new Error('Candidature non trouvée');
    }

    candidature.statut = 'Refusé';
    return this.candidatureRepo.save(candidature);
  }

}
