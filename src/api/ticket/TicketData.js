import user1 from 'src/assets/images/profile/user-1.jpg';
import user2 from 'src/assets/images/profile/user-2.jpg';
import user3 from 'src/assets/images/profile/user-3.jpg';
import user4 from 'src/assets/images/profile/user-4.jpg';
import user5 from 'src/assets/images/profile/user-5.jpg';
import { Chance } from 'chance';
import { http, HttpResponse } from 'msw';
const chance = new Chance();

let TicketData = [
  {
    Id: 1,
    ticketTitle: 'Sed ut perspiciatis unde omnis iste',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Anulado',
    Label: 'error',
    thumb: user1,
    name: 'Liam González',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 15.00',
  },
  {
    Id: 2,
    ticketTitle: 'Consequuntur magni dolores eos qui ratione',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user2,
    name: 'Steve Martínez',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 12.50',
  },
  {
    Id: 3,
    ticketTitle: 'Exercitationem ullam corporis',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Aceptado',
    Label: 'success',
    thumb: user3,
    name: 'Jack Rivera',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 18.00',
  },
  {
    Id: 4,
    ticketTitle: 'Sed ut perspiciatis unde omnis iste',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Anulado',
    Label: 'error',
    thumb: user4,
    name: 'Steve López',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 10.00',
  },
  {
    Id: 5,
    ticketTitle: 'Exercitationem ullam corporis',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Anulado',
    Label: 'error',
    thumb: user5,
    name: 'Liam Rodríguez',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 14.75',
  },
  {
    Id: 6,
    ticketTitle: 'Consequuntur magni dolores eos qui ratione',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user1,
    name: 'Jack Fernández',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 16.25',
  },
  {
    Id: 7,
    ticketTitle: 'Sed ut perspiciatis unde omnis iste',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Aceptado',
    Label: 'success',
    thumb: user2,
    name: 'Steve Herrera',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 11.50',
  },
  {
    Id: 8,
    ticketTitle: 'Consequuntur magni dolores eos qui ratione',
    ticketDescription:
      'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
    Status: 'Anulado',
    Label: 'error',
    thumb: user3,
    name: 'John Morales',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 13.00',
  },
  // Agregando 13 referidos más - 7 passengers + 6 drivers
  {
    Id: 9,
    ticketTitle: 'Referido por María González',
    ticketDescription: 'Usuario referido por María González. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user1,
    name: 'Carlos Vargas',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 17.25',
  },
  {
    Id: 10,
    ticketTitle: 'Referido por Ana Silva',
    ticketDescription: 'Usuario referido por Ana Silva. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user2,
    name: 'Luis Castillo',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 9.50',
  },
  {
    Id: 11,
    ticketTitle: 'Referido por Roberto Mendoza',
    ticketDescription: 'Usuario referido por Roberto Mendoza. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user3,
    name: 'Sofia Delgado',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 19.75',
  },
  {
    Id: 12,
    ticketTitle: 'Referido por Carmen López',
    ticketDescription: 'Usuario referido por Carmen López. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user4,
    name: 'Miguel Torres',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 8.25',
  },
  {
    Id: 13,
    ticketTitle: 'Referido por Diego Ramírez',
    ticketDescription: 'Usuario referido por Diego Ramírez. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user5,
    name: 'Paola Jiménez',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 22.00',
  },
  {
    Id: 14,
    ticketTitle: 'Referido por Laura Martínez',
    ticketDescription: 'Usuario referido por Laura Martínez. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user1,
    name: 'Andrés Vásquez',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 7.50',
  },
  {
    Id: 15,
    ticketTitle: 'Referido por Fernando Castro',
    ticketDescription: 'Usuario referido por Fernando Castro. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user2,
    name: 'Valentina Ruiz',
    Date: chance.date(),
    deleted: false,
    Type: 'Pasajero',
    Comission: 'S/ 20.50',
  },
  // Los siguientes 6 son conductores
  {
    Id: 16,
    ticketTitle: 'Referido por Patricia Herrera',
    ticketDescription: 'Usuario referido por Patricia Herrera. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user3,
    name: 'Sebastián Méndez',
    Date: chance.date(),
    deleted: false,
    Type: 'Conductor',
    Comission: 'S/ 35.00',
  },
  {
    Id: 17,
    ticketTitle: 'Referido por Javier Morales',
    ticketDescription: 'Usuario referido por Javier Morales. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user4,
    name: 'Isabella Peña',
    Date: chance.date(),
    deleted: false,
    Type: 'Conductor',
    Comission: 'S/ 28.75',
  },
  {
    Id: 18,
    ticketTitle: 'Referido por Mónica Jiménez',
    ticketDescription: 'Usuario referido por Mónica Jiménez. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user5,
    name: 'Gabriel Santos',
    Date: chance.date(),
    deleted: false,
    Type: 'Conductor',
    Comission: 'S/ 42.50',
  },
  {
    Id: 19,
    ticketTitle: 'Referido por Alejandro Vargas',
    ticketDescription: 'Usuario referido por Alejandro Vargas. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user1,
    name: 'Camila Aguilar',
    Date: chance.date(),
    deleted: false,
    Type: 'Conductor',
    Comission: 'S/ 31.25',
  },
  {
    Id: 20,
    ticketTitle: 'Referido por Natalia Restrepo',
    ticketDescription: 'Usuario referido por Natalia Restrepo. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user2,
    name: 'Nicolás Cordero',
    Date: chance.date(),
    deleted: false,
    Type: 'Conductor',
    Comission: 'S/ 38.00',
  },
  {
    Id: 21,
    ticketTitle: 'Referido por Tomás Guerrero',
    ticketDescription: 'Usuario referido por Tomás Guerrero. Registro pendiente de validación.',
    Status: 'Pendiente',
    Label: 'warning',
    thumb: user3,
    name: 'Juliana Ramos',
    Date: chance.date(),
    deleted: false,
    Type: 'Conductor',
    Comission: 'S/ 25.50',
  },
];

export default TicketData;

export const TicketHandlers = [
  // Mock GET request to retrieve Ticket data
  http.get('/api/data/ticket/TicketData', () => {
    try {
      return HttpResponse.json({ status: 200, msg: 'Success', data: TicketData });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),

  // Mock DELETE endpoint for deleting a ticket
  http.delete('/api/data/ticket/delete', async ({ request }) => {
    try {
      const { id } = await request.json();
      const tickets = TicketData.map((ticket) =>
        ticket.Id === id ? { ...ticket, deleted: true } : ticket,
      );
      TicketData = tickets;
      return HttpResponse.json({ status: 200, msg: 'Success', data: TicketData });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'Internal server error',
        error,
      });
    }
  }),
];
