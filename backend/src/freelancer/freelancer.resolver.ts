import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Freelancer } from './freelancer.entity';
import { FreelancerService } from './freelancer.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal';
import { join } from 'path';
import { LienProfInput } from 'src/lien-prof/lien-prof.input';
import { Repository } from 'typeorm';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { LienProf } from 'src/lien-prof/lien-prof.entity';
import { Competence } from 'src/competence/competence.entity';

@Resolver()
export class FreelancerResolver {
    constructor(
              private readonly freelancerService: FreelancerService,
        @InjectRepository(LienProf)
        private readonly lienProfRepository: Repository<LienProf>,
    
        @InjectRepository(FreelancerCompetence)
        private readonly freelancerCompetenceRepository: Repository<FreelancerCompetence>,
    
        @InjectRepository(Freelancer)
        private readonly freelancerRepository: Repository<Freelancer>,

        @InjectRepository(Competence)
        private readonly competenceRepository: Repository<Competence>
      ) {}

  @Query(() => [Freelancer])
  async allFreelancers(): Promise<Freelancer[]> {
    return this.freelancerService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Query(() => Freelancer, { nullable: true })
  async freelancerById(@Args('id', { type: () => Int }) id: number): Promise<Freelancer | null> {
    return this.freelancerService.findOneById(id);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('FREELANCER')
@Mutation(() => Freelancer)
async updateFreelancer(
  @CurrentUser() user: User,
  @Args('nom', { nullable: true }) nom?: string,
  @Args('prenom', { nullable: true }) prenom?: string,
  @Args({ name: 'photo', type: () => GraphQLUpload, nullable: true }) photo?: Promise<FileUpload>,
  @Args('bio', { nullable: true }) bio?: string,
  @Args('disponibilite', { nullable: true }) disponibilite?: boolean,
  @Args('liensProf', { type: () => [LienProfInput], nullable: true }) liensProf?: LienProfInput[],
  @Args('competences', { type: () => [Int], nullable: true }) competences?: number[],
  @Args('niveaux', { type: () => [String], nullable: true }) niveaux?: string[],
): Promise<Freelancer> {
  const freelancer = await this.freelancerService.findByUserId(user.id);
  if (!freelancer) throw new Error('Freelancer not found');
  if (user.role !== 'FREELANCER') throw new Error('Not authorized');

  // Optional fields
  if (nom !== undefined) freelancer.nom = nom;
  if (prenom !== undefined) freelancer.prenom = prenom;
  if (bio !== undefined) freelancer.bio = bio;
  if (disponibilite !== undefined) freelancer.disponibilite = disponibilite;

  // Handle new photo upload
  if (photo) {
    const { createReadStream, filename } = await photo;
    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir);

    const uniqueFilename = `${Date.now()}-${filename}`;
    const filepath = join(uploadDir, uniqueFilename);

    await new Promise<void>((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filepath))
        .on('finish', () => resolve())
        .on('error', (error) => reject(error)),
    );

    freelancer.photo = uniqueFilename;
  }

  await this.freelancerRepository.save(freelancer);

  // Update professional links
if (liensProf) {
  // Get existing links for this freelancer
  const existingLinks = await this.lienProfRepository.find({
    where: { freelancer: { id: freelancer.id } }
  });

  // Process each link in the input
  for (const lienInput of liensProf) {
    // If an ID is provided, try to update that specific link
    if (lienInput.id) {
      const existingLink = existingLinks.find(link => link.id === lienInput.id);
      if (existingLink) {
        existingLink.url = lienInput.url;
        existingLink.type = lienInput.type;
        await this.lienProfRepository.save(existingLink);
        continue;
      }
    }

    // Otherwise, add a new link
    const newLien = this.lienProfRepository.create({
      ...lienInput,
      freelancer
    });
    await this.lienProfRepository.save(newLien);
  }
}

  // Update competences + niveaux
  if (competences && niveaux && competences.length === niveaux.length) {
    for (let i = 0; i < competences.length; i++) {
      const competence = await this.competenceRepository.findOne({ where: { id: competences[i] } });
      if (competence) {
        let fc = await this.freelancerCompetenceRepository.findOne({
          where: { freelancer: { id: freelancer.id }, competence: { id: competence.id } },
        });

        if (!fc) {
          fc = this.freelancerCompetenceRepository.create({
            competence,
            niveau: niveaux[i],
            freelancer,
          });
        } else {
          fc.niveau = niveaux[i];
        }
        await this.freelancerCompetenceRepository.save(fc);
      }
    }
  }

  return freelancer;
}

  @UseGuards(JwtAuthGuard)
    @Query(() => Freelancer, { name: 'meFreelancer', nullable: true })
    async getCurrentFreelancer(@CurrentUser() user: User): Promise<Freelancer | null> {
        const freelancer = await this.freelancerService.findByUserId(user.id);
        return freelancer;
    }
    
}
