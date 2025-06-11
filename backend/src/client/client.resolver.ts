import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Resolver()
export class ClientResolver {
    constructor(private readonly clientService: ClientService) {}
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles('ADMIN')
      @Query(() => [Client])
      async allClients(): Promise<Client[]> {
        return this.clientService.findAll();
      }
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles('FREELANCER', 'ADMIN', 'CLIENT')
      @Query(() => Client, { nullable: true })
      async clientById(@Args('id', { type: () => Int }) id: number): Promise<Client | null> {
        return this.clientService.findOneById(id);
      }
    
       @UseGuards(JwtAuthGuard, RolesGuard)
       @Roles('CLIENT')
       @Mutation(() => Client)
      async updateClient(
        @CurrentUser() user: User,
        @Args('nom', { nullable: true }) nom?: string,
        @Args('photo', { nullable: true }) photo?: string,
        @Args('about', { nullable: true }) about?: string,
        @Args('adresse', { nullable: true }) adresse?: string,
        @Args('codePostal', { nullable: true }) codePostal?: string,
        @Args('tel', { nullable: true }) tel?: string,
        @Args('siteweb', { nullable: true }) siteweb?: string,
        @Args('domaine', { nullable: true }) domaine?: string,
        
      ): Promise<Client> {
        const client = await this.clientService.findByUserId(user.id);
    
    
        if (!client) {
        throw new Error('Client not found');
      }
    
      if (user.role !== 'CLIENT') {
        throw new Error('Not authorized to update this client');
      }

        if (nom !== undefined) client.nom = nom;
        if (photo !== undefined) client.photo = photo;
        if (about !== undefined) client.about = about;
        if (adresse !== undefined) client.adresse = adresse;
        if (codePostal !== undefined) client.codePostal = codePostal;
        if (tel !== undefined) client.tel = tel;
        if (siteweb !== undefined) client.siteweb = siteweb;
        if (domaine !== undefined) client.domaine = domaine;
    
        return this.clientService.save(client);
      }
    
    @UseGuards(JwtAuthGuard)
    @Query(() => Client, { nullable: true })
    async getCurrentClient (@CurrentUser() user: User): Promise<Client | null> {
        const client = await this.clientService.findByUserId(user.id)
        return client
    }
}