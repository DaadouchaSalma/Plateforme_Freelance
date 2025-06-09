import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Repository } from 'typeorm';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { CurrentUser } from './current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';


@Resolver()
export class AuthResolver {
    constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Freelancer)
    private readonly freelancerRepository: Repository<Freelancer>,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    const result = await this.authService.login(user);
    return result.access_token + ' role ' + result.user.role;
  }

   @Mutation(() => User)
  async registerClient(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nom') nom: string,
    @Args('photo') photo: string,
    @Args('adresse') adresse: string,
    @Args('about') about: string,
    @Args('codePostal') codePostal: string,
    @Args('tel') tel: string,
    @Args('siteweb') siteweb: string,
    @Args('domaine') domaine: string,
  ): Promise<User> {
    const user = await this.userService.create({ email, password, role: 'CLIENT' });

    const client = this.clientRepository.create({ nom, photo, about, adresse, codePostal, tel, siteweb, domaine, user });
    await this.clientRepository.save(client);

    return user;
  }
  // @Mutation(() => User)
  // async registerFreelancer(
  //   @Args('email') email: string,
  //   @Args('password') password: string,
  //   @Args('nom') nom: string,
  //   @Args('prenom') prenom: string,
  //   @Args('photo') photo: string,
  //   @Args('bio', { nullable: true }) bio?: string,
  // ): Promise<User> {
  //   const user = await this.userService.create({ email, password, role: 'FREELANCER' });

  //   const freelancer = this.freelancerRepository.create({ nom, prenom, photo, bio, user });
  //   await this.freelancerRepository.save(freelancer);

  //   return user;
  // }
@Mutation(() => User)
  async registerFreelancer(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nom') nom: string,
    @Args('prenom') prenom: string,
    @Args({ name: 'photo', type: () => GraphQLUpload }) photo: Promise<FileUpload>,
    @Args('bio', { nullable: true }) bio?: string,
  ): Promise<User> {
    // 1. Attendre le fichier uploadé
    const { createReadStream, filename } = await photo;

    // 2. Préparer le dossier upload
    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir);
    }

    // 3. Générer un nom unique
    const uniqueFilename = `${Date.now()}-${filename}`;
    const filepath = join(uploadDir, uniqueFilename);

    // 4. Sauvegarder le fichier
    await new Promise<void>((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filepath))
        .on('finish', () => resolve())
        .on('error', (error) => reject(error)),
    );

    // 5. Créer l'utilisateur
    const user = await this.userService.create({ email, password, role: 'FREELANCER' });

    // 6. Créer le freelancer avec le chemin du fichier stocké
    const freelancer = this.freelancerRepository.create({
      nom,
      prenom,
      photo: uniqueFilename, // tu peux stocker le chemin relatif
      bio,
      user,
    });
    await this.freelancerRepository.save(freelancer);

    return user;
  }

}
