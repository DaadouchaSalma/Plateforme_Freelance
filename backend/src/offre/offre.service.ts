import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Offer } from './offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/client/client.entity';
import { Categorie } from 'src/categorie/categorie.entity';
import { Competence } from 'src/competence/competence.entity';

@Injectable()
export class OffreService {

    constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Categorie)
    private categorieRepository: Repository<Categorie>,
    
    @InjectRepository(Competence)
    private readonly competenceRepository: Repository<Competence>, 

  ) {}

    async createOffer(data: {
  title: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: string;
  userId: number;
  competenceIds: number[];
  categorieId: number;
}): Promise<Offer> {
  const client = await this.clientRepository.findOne({
    where: { user: { id: data.userId } },
    relations: ['user'],
  });

  if (!client) {
    throw new Error('Client introuvable pour cet utilisateur');
  }

  const categorie = await this.categorieRepository.findOne({
    where: { id: data.categorieId }, 
  });
  if (!categorie) {
  throw new Error('Catégorie non trouvée');
}

  const offer = new Offer();
  offer.title = data.title;
  offer.description = data.description;
  offer.budget = data.budget;
  offer.startDate = data.startDate;
  offer.endDate = data.endDate;
  offer.status = data.status;
  offer.client = client;
  offer.categorie = categorie;
  if (data.competenceIds && data.competenceIds.length > 0) {
    offer.competences = await this.competenceRepository.findByIds(data.competenceIds);
  } else {
    offer.competences = [];
  }

  return this.offerRepository.save(offer);
}
async updateOffer(
  id: number,
  title?: string,
  description?: string,
  budget?: number,
  startDate?: Date,
  endDate?: Date,
  status?: string,
  categorieId?: number,
): Promise<Offer> {
  const offer = await this.offerRepository.findOne({
    where: { id },
    relations: ['client', 'categorie'],
  });

  if (!offer) {
    throw new Error('Offre introuvable');
  }

  if (title !== undefined) offer.title = title;
  if (description !== undefined) offer.description = description;
  if (budget !== undefined) offer.budget = budget;
  if (startDate !== undefined) offer.startDate = startDate;
  if (endDate !== undefined) offer.endDate = endDate;
  if (status !== undefined) offer.status = status;

  if (categorieId !== undefined) {
    const categorie = await this.categorieRepository.findOne({
      where: { id: categorieId },
    });
    if (!categorie) throw new Error('Catégorie non trouvée');
    offer.categorie = categorie;
  }

  return this.offerRepository.save(offer);
}
async getAllOffersForFreelancer(): Promise<Offer[]> {
  const offers = await this.offerRepository.find({
    where: { status: 'Active' },
    relations: ['categorie', 'client', 'client.user','competences'],
  });

  
  return offers.map(offer => ({
    ...offer,
    startDate:new Date(offer.startDate),
    endDate:new Date(offer.endDate),
  }));
}
async getAllOffersForClient(userId: number): Promise<Offer[]> {
  const offers = await this.offerRepository.find({
    where: { client: { user: { id: userId } } },
    relations: ['categorie'],
  });
 return offers.map(offer => ({
    ...offer,
    startDate:new Date(offer.startDate),
     }));
}
async getOfferById(id: number): Promise<Offer> {
  const offer = await this.offerRepository.findOne({
  where: { id },
  relations: ['categorie'],
});

if (!offer) {
  throw new NotFoundException('Offer not found');
}

return {
  ...offer,
  startDate:  new Date(offer.startDate),
  endDate:  new Date(offer.endDate),
};
}
async deleteOfferByClient(offerId: number, userId: number): Promise<boolean> {
  const offer = await this.offerRepository.findOne({
    where: { id: offerId },
    relations: ['client', 'client.user'],
  });

  if (!offer) {
    throw new NotFoundException('Offre non trouvée');
  }

  if (offer.client.user.id !== userId) {
    throw new ForbiddenException('Vous ne pouvez supprimer que vos propres offres');
  }

  await this.offerRepository.remove(offer);
  return true;
}

}
